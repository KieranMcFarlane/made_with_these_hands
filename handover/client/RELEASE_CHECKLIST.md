# Client Release Checklist

## Automated gates

- [ ] `npm run client-handover:verify` passes.
- [ ] `npm run nakano:oauth:verify-public` passes from the live environment.
- [ ] `npm run client-access:verify` proves discovery and the client's live OAuth grant.
- [ ] `npm run production:readiness` passes without publishing draft content.
- [ ] The private Nakano operator runs `npm run client:isolation:verify -- --email CLIENT_EMAIL --tenant made-with-these-hands` and every check is true.
- [ ] A second-tenant read is denied and destructive tools are absent.

## Operator gates

- [ ] Rotate any credential exposed during development or support.
- [ ] Create a dedicated Nakano client identity with no platform-owner role.
- [ ] Assign exactly one membership: `made-with-these-hands`.
- [ ] Grant only the scopes needed for the agreed client role.
- [ ] Confirm the consent screen names Made With These Hands and shows no tenant chooser.
- [ ] Confirm revocation from **Nakano Control > AI Connections**.
- [ ] Verify the Resend sending domain before enabling enquiry notification delivery.

## Client gates

- [ ] Hugh completes every prompt in `OWNER_ACCEPTANCE.md` from his own Codex installation.
- [ ] Record Hugh's name, decision, date, and any exceptions in the acceptance table.
- [ ] Demonstrate reconnection after a revoked or expired grant; Codex must explain that protected work paused and preserve the task.
- [ ] Give the client only the project repository. Exclude `.env*`, internal Nakano repositories, backups, service files, and operator logs.

## Release

- [ ] Review the complete Git diff and separate unrelated work.
- [ ] Commit the approved client release from a clean worktree.
- [ ] Create a signed or annotated version tag only after all gates above pass.
- [ ] Do not deploy or publish as part of packaging unless separately approved.

The release is not complete while any automated check, tenant provisioning step,
or Hugh's personal acceptance remains outstanding.
