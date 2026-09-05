# Hugh's Codex Project Bundle

This directory is the project-scoped Codex handover for Made With These Hands.
It contains no credentials.

1. Put `config.toml` at `.codex/config.toml` in Hugh's trusted project.
2. Put `AGENTS.md` at the project root.
3. Run `npm run nakano:oauth:verify-public` from the project and confirm it passes.
4. Authenticate the `nakano` MCP connection in Codex using the client's dedicated
   Nakano identity, never a Nakano platform-owner account.
5. The client identity must have exactly one active membership:
   `made-with-these-hands`. With one membership, Nakano binds the grant
   automatically and does not show a tenant chooser.
6. Confirm the consent screen names Made With These Hands, then approve only the
   required scopes.
7. Use `/mcp` to confirm the optional gateway is connected.
8. Run the prompts in `OWNER_ACCEPTANCE.md` in order.

The hosted CMS remains Directus 12.0.2 and its database is dedicated to Made
With These Hands. Directus and Component Factory credentials stay inside Nakano;
Hugh receives a revocable OAuth grant bound to his user and this tenant.

Before delivery, the Nakano operator must run the read-only isolation gate from
the Nakano repository:

```bash
npm run client:isolation:verify -- --email CLIENT_EMAIL --tenant made-with-these-hands
```

Every check must pass. Do not hand over an identity with `platform_admin` or
memberships, consents, access tokens, or refresh tokens for another tenant.
See [CLIENT_ISOLATION.md](CLIENT_ISOLATION.md) for the complete boundary.
Use [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) as the authoritative delivery
gate; it deliberately keeps automated evidence separate from Hugh's sign-off.
