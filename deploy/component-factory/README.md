# Per-client Component Factory deployment

This deployment exposes the private Component Factory as an authenticated
Streamable HTTP MCP endpoint. Run one isolated deployment for each client.

## First controlled client (local private deployment)

The `Made With These Hands` instance runs as a WSL user service bound only to
`127.0.0.1:8787`. It is not reachable from another machine.

```bash
npm run component-factory:provision-local
systemctl --user link "$PWD/deploy/component-factory/mwth-component-factory.service"
systemctl --user enable --now mwth-component-factory.service
npm run component-factory:verify-local
```

The provisioner stores the server environment and client access token in
git-ignored mode-0600 files. It preserves the existing client bearer token when
rerun. Do not copy `.env.client` to a client device because it contains the
server-side Directus credential.

Operational commands:

```bash
systemctl --user status mwth-component-factory.service
journalctl --user -u mwth-component-factory.service
systemctl --user restart mwth-component-factory.service
systemctl --user disable --now mwth-component-factory.service
```

## Provision

1. Generate a client token:

   ```bash
   npm run component-factory:token
   ```

2. Give the plaintext token to the client through a secret manager. Store only
   its SHA-256 hash in the Factory environment.
3. Copy `tools/component-factory-mcp/.env.client.example` to
   `deploy/component-factory/.env.client` and fill every value.
4. Put the service behind an HTTPS reverse proxy whose hostname exactly matches
   `COMPONENT_FACTORY_ALLOWED_HOSTS`.
5. Start the isolated service:

   ```bash
   docker compose -f deploy/component-factory/docker-compose.client.yml up -d --build
   ```

The Made With These Hands public endpoint is `https://factory.nakanodigital.com/mcp`. The unauthenticated
health endpoint is `/healthz` and returns no client or credential details.

## Client Codex configuration

Keep the bearer token in the client's environment rather than writing it into
`config.toml`:

```toml
[mcp_servers.component_factory]
url = "https://factory.nakanodigital.com/mcp"
bearer_token_env_var = "CLIENT_COMPONENT_FACTORY_TOKEN"
required = true
enabled_tools = [
  "get_workflow_context",
  "read_brand_contract",
  "list_components",
  "start_component_proposal",
  "scaffold_component",
  "validate_component",
  "create_preview",
  "prepare_component_release",
  "publish_approved_component",
]
default_tools_approval_mode = "writes"
```

The client also configures their tenant-scoped Directus MCP separately. Do not
give the client the Factory's Directus service token, image, volume, repository,
or deployment credentials.

Use the client-facing install pack in
[`handover/client-codex-install.md`](../../handover/client-codex-install.md) and
[`handover/codex-mcp.example.toml`](../../handover/codex-mcp.example.toml) when
setting up the client's Codex.

## Isolation and operations

- Use a unique hostname, bearer token, Directus service account, proposal volume,
  logs, preview target, and deployment identity for every client.
- The container drops Linux capabilities, uses a read-only root filesystem, and
  persists only proposal records.
- `COMPONENT_FACTORY_ALLOWED_HOSTS` is mandatory to prevent host-header and DNS
  rebinding attacks.
- Requests with an `Origin` header are rejected unless the exact origin appears
  in `COMPONENT_FACTORY_ALLOWED_ORIGINS`.
- Publishing still requires a human-approved Directus proposal. The MCP service
  cannot record its own approval.
- Terminate access by revoking the client token and stopping this deployment.

## Production boundary

This service hosts the governed proposal, validation, preview, and release
control plane. Production source generation and deployment remain private CI
actions. Connect that CI pipeline to the prepared release record; never expose
repository commands, patches, or renderer paths as MCP inputs.
