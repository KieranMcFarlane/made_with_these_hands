# Made With These Hands release operations

Production releases run through `.github/workflows/release.yml`.

The workflow first verifies the component contract, tests, shadcn registry,
Storybook, and the Next.js production build on a GitHub-hosted runner. Only a
successful verification job can dispatch the deployment job to the private
runner labelled `mwth-production`.

## Server layout

```text
~/.config/made-with-these-hands/production.env
~/apps/made-with-these-hands/
  current -> releases/<git-sha>
  releases/<git-sha>/
```

The environment file is mode `0600`, is never copied into Git, and is loaded for
both the build and the systemd runtime. The three newest releases are retained.

The public endpoints are:

- Website: `https://hands.nakanodigital.com`
- Storybook: `https://hands.nakanodigital.com/storybook/index.html`

## Release

Run the **Verify and deploy** workflow against the reviewed branch or commit.
The deployment creates a new immutable release, builds it, switches the
`current` symlink, restarts `made-with-these-hands.service`, and checks both the
website and Storybook before reporting success.

## Rollback

Point `~/apps/made-with-these-hands/current` at a retained release and restart
the user service:

```bash
ln -sfn "$HOME/apps/made-with-these-hands/releases/<git-sha>" \
  "$HOME/apps/made-with-these-hands/current.next"
mv -Tf "$HOME/apps/made-with-these-hands/current.next" \
  "$HOME/apps/made-with-these-hands/current"
systemctl --user restart made-with-these-hands.service
```

Directus migrations and Factory deployment are separate operations. The site
release workflow does not mutate Directus schema, content, permissions, or
Factory state.
