# Client Codex Install

This is the client-safe install path for Made With These Hands. The client gets scoped MCP access, not server admin credentials.

## What The Client Installs

The client configures two remote MCP servers in Codex:

| MCP server | Purpose | Credential |
| --- | --- | --- |
| Directus MCP | Edit content, pages, navigation, media, blocks, comments, and enquiries | `DIRECTUS_MCP_TOKEN` |
| Component Factory MCP | Request, validate, preview, and approval-gate new component types | `CLIENT_COMPONENT_FACTORY_TOKEN` |

## Required URLs

Replace these with the real hosted endpoints:

```text
DIRECTUS_MCP_URL=https://cms.nakanodigital.com/mcp
COMPONENT_FACTORY_MCP_URL=https://factory.nakanodigital.com/mcp
SITE_URL=https://hands.nakanodigital.com
```

For the current local proof:

```text
DIRECTUS_MCP_URL=http://127.0.0.1:8055/mcp
COMPONENT_FACTORY_MCP_URL=http://127.0.0.1:8787/mcp
SITE_URL=http://localhost:3038
```

## Codex TOML

Use [codex-mcp.example.toml](./codex-mcp.example.toml) as the template.

The client machine should provide the token values as environment variables:

```bash
export DIRECTUS_MCP_TOKEN="provided-through-secret-manager"
export CLIENT_COMPONENT_FACTORY_TOKEN="provided-through-secret-manager"
```

## Permission Model

Directus MCP should be scoped to the Made With These Hands tenant.

Allowed:

- read schema and approved registry;
- create/update pages;
- create/update page blocks;
- reorder `site_pages.blocks`;
- create/update makers, products, podcast episodes, posts, comments, enquiries, and navigation;
- upload/read media where needed.

Denied:

- admin access;
- delete actions;
- arbitrary schema changes by default;
- approval of unsafe components by the same agent;
- executable JavaScript, renderer paths, or source code in Directus content.

## Install Test

After the client adds both MCP servers, ask Codex:

```text
List the Directus collections available for Made With These Hands, then list the approved component registry. Do not edit anything.
```

Expected result:

- Codex can see `site_pages`, `site_pages_blocks`, approved `block_*` collections, makers, products, episodes, posts, comments, enquiries, navigation, brand settings, and component registry.
- Codex cannot delete records.
- Codex cannot administer Directus users, roles, policies, or server settings.

Then test composition:

```text
Create a draft page called MCP Test Page using only an approved Text block. Put it after the main content slot. Do not publish it.
```

Then test the guardrail:

```text
I want a new component type for an audio chapter player. Start a component proposal and explain what approval is needed before it can be published.
```

Expected result:

- Codex uses the Component Factory MCP.
- It creates/updates a proposal, not production frontend code.
- It explains the brand and approval checks.

## Handover Checklist

- Directus is reachable over HTTPS.
- Directus MCP is enabled in Directus settings.
- Directus MCP user has tenant-scoped read/create/update permissions.
- Directus MCP user has no delete permissions.
- Site token is separate from MCP token.
- Component Factory is hosted on HTTPS.
- Component Factory `/healthz` responds.
- Unauthenticated `/mcp` requests are rejected.
- Authenticated Component Factory MCP discovery works.
- `npm run components:validate-live` passes before handover.
- Client Codex can read approved components and create a draft test page.
