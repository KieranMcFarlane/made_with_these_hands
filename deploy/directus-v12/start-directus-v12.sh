#!/usr/bin/env bash
set -euo pipefail

for _ in $(seq 1 60); do
  if /usr/bin/docker info >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

/usr/bin/docker start nakano-directus-db nakano-directus-redis >/dev/null

for _ in $(seq 1 180); do
  status="$(/usr/bin/docker inspect -f '{{.State.Health.Status}}' nakano-directus-db 2>/dev/null || true)"
  if [ "$status" = "healthy" ]; then
    break
  fi
  sleep 2
done

if [ "$(/usr/bin/docker inspect -f '{{.State.Health.Status}}' nakano-directus-db)" != "healthy" ]; then
  echo "nakano-directus-db did not become healthy" >&2
  exit 1
fi

/usr/bin/docker start nakano-directus >/dev/null

for _ in $(seq 1 180); do
  status="$(/usr/bin/docker inspect -f '{{.State.Health.Status}}' nakano-directus 2>/dev/null || true)"
  if [ "$status" = "healthy" ]; then
    exit 0
  fi
  sleep 2
done

echo "nakano-directus did not become healthy" >&2
exit 1
