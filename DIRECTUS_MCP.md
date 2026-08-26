# Directus MCP Handoff

Directus MCP is the right connection layer for structured site changes: makers, products, episodes, posts, page records, navigation, and v12 content blocks.

For the complete repeatable process—existing-site assessment, progressive
migration, per-client Factory deployment, client MCP configuration, acceptance,
ownership, and offboarding—use
[`CLIENT_COMPONENT_SYSTEM_HANDOVER.md`](./CLIENT_COMPONENT_SYSTEM_HANDOVER.md).

For the client-facing Codex install pack, use
[`handover/client-codex-install.md`](./handover/client-codex-install.md),
[`handover/codex-mcp.example.toml`](./handover/codex-mcp.example.toml), and
[`handover/owner-capability-guide.md`](./handover/owner-capability-guide.md).

## Directus Setup

Enable MCP in Directus:

```text
Settings > AI > Model Context Protocol
```

Use the Directus remote MCP endpoint:

```text
https://cms.nakanodigital.com/mcp
```

Prefer OAuth where available. If using a static token, create a dedicated MCP user and role; do not use an admin token.

## Recommended MCP Role

Grant read access to:

```text
directus_collections
directus_fields
directus_relations
directus_files
tenants
site_pages
navigation_items
brand_settings
makers
products
episodes
posts
comments
enquiries
site_sections
brand_settings
block_hero
block_text
block_media
block_quote
block_listing
block_cta
block_slideshow
```

Grant create/update access to:

```text
site_pages
navigation_items
makers
products
episodes
posts
site_sections
block_hero
block_text
block_media
block_quote
block_listing
block_cta
block_slideshow
```

Keep destructive actions restricted. Avoid delete permissions unless a human specifically approves archival/cleanup work.

The MCP policy must keep `admin_access` disabled. In Directus, keep
`Settings > AI > Model Context Protocol > Allow Deletes` disabled. Also remove
all delete permissions from the MCP policy as a second server-side safeguard.

For public comments and enquiries:

```text
comments: read/update status only, if moderation through MCP is wanted
enquiries: read/update status only
```

## Claude Code Example

```bash
claude mcp add --transport http directus https://your-directus.example.com/mcp
```

## Codex / Local MCP Example

Use a project or user MCP config with placeholders only:

```json
{
  "mcpServers": {
    "directus": {
      "url": "https://cms.nakanodigital.com/mcp",
      "headers": {
        "Authorization": "Bearer ${DIRECTUS_MCP_TOKEN}"
      }
    }
  }
}
```

If your MCP client only supports command-based servers, run a small bridge or use the client-supported remote HTTP format. Keep `DIRECTUS_MCP_TOKEN` in local environment or the client secret store, never in git.

## Agent Workflow

```text
1. Inspect schema, fields, and relations first.
2. Find the tenant and target site_pages record by path.
3. Read site_pages.blocks and identify the exact block item.
4. Update the target block collection item.
5. Create a block only when adding a genuinely new section.
6. Keep products as enquiry-led objects, not checkout products.
7. Leave legacy site_sections alone unless migrating a known key.
8. Verify the site route after content changes.
```

## Proper v12 Blocks

The canonical editable page structure is:

```text
site_pages.blocks -> Builder (M2A)
```

Allowed block collections:

```text
block_hero
block_text
block_media
block_quote
block_listing
block_cta
block_slideshow
```

This gives MCP clients a clean content editing surface: page metadata lives on `site_pages`, reusable editorial models live in their own collections, and visual/page sections live as typed block records.

## Creating New Component Types

Directus MCP composes approved blocks. The separate Component Factory MCP governs requests for new component types:

```text
component-factory://workflow
```

It exposes proposal, scaffold, validation, preview, release-preparation, and approval-gated publication tools. Both Claude and Codex can run the same stdio server:

```bash
npm run component-factory:mcp
```

The factory prefers shadcn primitives, writes proposals only beneath `component-system/proposals`, never stores executable code in Directus, and requires a human-approved `component_proposals` record before publication.

Its approval gate is reproducible with:

```bash
npm run components:verify
```

That command validates the repository contracts, compares them with the live Directus fields, registry, and Builder allowlist, runs slideshow behaviour tests and the dependency audit, creates a production build, then smoke-tests every published Directus route.
