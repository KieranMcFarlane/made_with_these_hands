#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${GITHUB_WORKSPACE:-}" || -z "${GITHUB_SHA:-}" ]]; then
  echo "This script must run from the GitHub Actions deployment job." >&2
  exit 1
fi

deploy_root="${MWTH_DEPLOY_ROOT:-$HOME/apps/made-with-these-hands}"
environment_file="${MWTH_ENV_FILE:-$HOME/.config/made-with-these-hands/production.env}"
release_dir="$deploy_root/releases/$GITHUB_SHA"
current_link="$deploy_root/current"

if [[ ! -f "$environment_file" ]]; then
  echo "Production environment file is missing: $environment_file" >&2
  exit 1
fi

mkdir -p "$deploy_root/releases"
rm -rf "$release_dir"
mkdir -p "$release_dir"

rsync -a --delete \
  --exclude '.git/' \
  --exclude '.next/' \
  --exclude 'node_modules/' \
  --exclude 'storybook-static/' \
  --exclude 'public/storybook/' \
  --exclude '/.env*' \
  "$GITHUB_WORKSPACE/" "$release_dir/"

cd "$release_dir"
set -a
# shellcheck disable=SC1090
source "$environment_file"
set +a

npm ci
npm run registry:validate
npm run registry:build
npm run storybook:build
mkdir -p public/storybook
rsync -a --delete storybook-static/ public/storybook/
npm run build

ln -sfn "$release_dir" "$deploy_root/current.next"
mv -Tf "$deploy_root/current.next" "$current_link"

install -m 0644 \
  "$release_dir/deploy/made-with-these-hands.service" \
  "$HOME/.config/systemd/user/made-with-these-hands.service"
systemctl --user daemon-reload
systemctl --user restart made-with-these-hands.service

for attempt in {1..30}; do
  if curl --fail --silent --show-error --max-time 5 http://127.0.0.1:3009/ >/dev/null; then
    break
  fi
  if [[ "$attempt" == 30 ]]; then
    systemctl --user status made-with-these-hands.service --no-pager --full >&2 || true
    exit 1
  fi
  sleep 2
done

curl --fail --silent --show-error --max-time 10 \
  http://127.0.0.1:3009/storybook/index.html >/dev/null

find "$deploy_root/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
  | sort -nr \
  | tail -n +4 \
  | cut -d' ' -f2- \
  | xargs -r rm -rf

echo "Deployed $GITHUB_SHA to $current_link"
