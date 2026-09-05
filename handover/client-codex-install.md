# Made With These Hands: connect Codex

The client connects to one OAuth-protected Nakano MCP resource:

| Connection | Purpose | Credential handling |
| --- | --- | --- |
| Nakano MCP Gateway | Directus content and governed Component Factory operations | OAuth grant stored by Codex |

## Install

1. Open this trusted Made With These Hands project in Codex.
2. Add the configuration from `handover/client/config.toml` to the project MCP configuration.
3. Select **Authenticate** for `nakano`.
4. Sign in to Nakano Control.
5. Choose **Made With These Hands**.
6. Review and approve the tenant-scoped capabilities.

Before asking a client to authenticate, verify that the public OAuth routes are
live from the deployment environment:

```bash
npm run nakano:oauth:verify-public
```

The command verifies protected-resource discovery, authorization-server
discovery, canonical resource binding, and the recoverable `cms:archive` and
`cms:restore` scopes. It does not need a credential and must pass before the
Codex OAuth connection can start.

Codex receives namespaced tools such as `cms_*` and `factory_*`. Nakano checks the
user, tenant membership, role, package entitlements and granted scopes on every
request. Revoke the grant from **Control > AI Connections**.

Directus and Component Factory bearer tokens are internal gateway credentials.
They must not be added to the client's shell, repository or Codex configuration.

The connection is optional at startup. If authentication expires or Nakano is
temporarily unavailable, Codex remains resumable and reports the unavailable
tenant tools at task level.
