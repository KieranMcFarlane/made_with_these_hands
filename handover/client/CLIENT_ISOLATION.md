# Client Tenant Isolation

## Required identity model

Give the client a dedicated Nakano user. Do not share the Nakano platform-owner
account. The client user must:

- not have `platform_admin` authority;
- have exactly one active membership, for `made-with-these-hands`;
- use `tenant_admin` only when the client should own publishing decisions, or
  `tenant_member` for draft editing without publish authority;
- have no consent, access token, or refresh token bound to another tenant.

With exactly one membership, Nakano selects Made With These Hands automatically.
The client sees their project name on consent and is not presented with other
Nakano tenants.

## OAuth boundary

The authorization server writes immutable `tenant_id` and `tenant_role` claims
into the access token from the selected membership. The client cannot supply
these claims. The MCP gateway then verifies:

1. signature, issuer, audience, and expiry;
2. the mandatory tenant claim;
3. current tenant status and current user membership;
4. an active consent whose reference is the same tenant;
5. the intersection of token scopes and the current database role;
6. tenant-specific entitlements and tenant-specific downstream credentials.

Changing a tool argument cannot change this tenant context. CMS, Factory,
Design Job, recovery, and audit operations derive the tenant from the verified
principal rather than client-provided data.

## Operator release gate

From the private Nakano operations repository, run:

```bash
npm run client:isolation:verify -- --email CLIENT_EMAIL --tenant made-with-these-hands
```

The report must show all checks as `true`, one active membership, and only
`made-with-these-hands` under consent and token tenants. The report masks the
email and prints no credentials.

Then complete `OWNER_ACCEPTANCE.md`, including the cross-tenant denial and
destructive-tool checks. Revoke the connection from Nakano Control if the
client relationship ends or the device is lost.

## Local project boundary

OAuth isolates Nakano services; it does not restrict the client computer's
filesystem. Give the client a clean project repository containing this project
only. Exclude `.env*`, internal Nakano repositories, service files, backups,
operator logs, and credentials. The project-scoped `.codex/config.toml` contains
only the public OAuth MCP URL and no bearer tokens.
