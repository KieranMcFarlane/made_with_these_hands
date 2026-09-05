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

Directus Studio remains available at `https://cms.nakanodigital.com`, but its
MCP route is private. Client tools connect through the tenant-aware Nakano
gateway:

```text
https://mcp.nakanodigital.com/mcp
```

Authentication uses Nakano OAuth 2.1 with PKCE. Directus service credentials are
encrypted gateway implementation details and must never be placed on a client
device.

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

Directus raw delete, schema administration, roles and secrets are not exposed
through the customer gateway. Nakano exposes `cms_archive_items` and
`cms_restore_items` instead: an explicit archive captures a tenant-scoped
snapshot, records an audit event, changes the item to `archived`, and can be
restored to its prior status. Bulk archive requires a Directus recovery point
from the last 24 hours. Permanent deletion remains a break-glass platform
operation outside the tenant OAuth grant.

The MCP policy must keep `admin_access` disabled. In Directus, keep
`Settings > AI > Model Context Protocol > Allow Deletes` disabled. Also remove
all delete permissions from the MCP policy as a second server-side safeguard.

For public comments and enquiries:

```text
comments: read/update status only, if moderation through MCP is wanted
enquiries: read/update status only
```

## Codex / Local MCP Example

Use the single optional Nakano connection. Authentication is completed in the
browser and does not require token environment variables:

```toml
[mcp_servers.nakano]
url = "https://mcp.nakanodigital.com/mcp"
auth = "oauth"
oauth_resource = "https://mcp.nakanodigital.com/mcp"
required = false
default_tools_approval_mode = "auto"
tool_timeout_sec = 120
```

CMS tools are exposed with the `cms_` prefix and are filtered by tenant, role,
package and consented scope. Factory tools use the `factory_` prefix.

Before policy evaluation, clients should resolve conversation language into a
semantic intent envelope containing the operation, stable target identifiers,
requested capabilities, explicit prohibitions, lifecycle intent, presentation
decisions, and confidence. Policy must never classify negated text such as “no
audio playback” as a requested capability. Mutations should carry idempotency
keys, support dry-run semantic diffs, and return human labels plus
`next_allowed_actions` and `blocking_actions`.

Preview state is not a single URL. The gateway and Factory distinguish
`url_assigned`, `artifact_verified`, and `reachable`, and verify that the target
does not render “Component proposal not found” before presenting it for human
review.

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
