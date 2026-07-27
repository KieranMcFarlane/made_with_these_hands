# Directus MCP Handoff

Directus MCP is the right connection layer for structured site changes: makers, products, episodes, posts, page records, navigation, and v12 content blocks.

## Directus Setup

Enable MCP in Directus:

```text
Settings > AI > Model Context Protocol
```

Use the Directus remote MCP endpoint:

```text
https://your-directus.example.com/mcp
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
makers
products
episodes
posts
comments
enquiries
site_sections
block_hero
block_text
block_media
block_quote
block_listing
block_cta
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
```

Keep destructive actions restricted. Avoid delete permissions unless a human specifically approves archival/cleanup work.

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
      "url": "https://your-directus.example.com/mcp",
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
```

This gives MCP clients a clean content editing surface: page metadata lives on `site_pages`, reusable editorial models live in their own collections, and visual/page sections live as typed block records.

