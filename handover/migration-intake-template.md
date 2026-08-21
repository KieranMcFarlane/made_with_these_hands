# Migration Intake Template

Use this for every client before converting an existing site or Claude design
output into the Directus and Component Factory system.

For machine-readable onboarding, copy
`handover/migration-intake.example.json`, fill it for the client, and run:

```bash
npm run migration:validate -- handover/client-name.intake.json
```

## Client

| Field | Notes |
| --- | --- |
| Client name |  |
| Tenant key |  |
| Current domain |  |
| Target domain |  |
| Directus tenant/project |  |
| Primary approver |  |
| Content editors |  |
| Technical contact |  |

## Source Material

| Source | Link/path | Notes |
| --- | --- | --- |
| Existing website |  |  |
| Claude design output |  |  |
| Brand book/assets |  |  |
| Content export |  |  |
| Media library |  |  |
| Analytics/search data |  |  |

## Route Inventory

| Route | Page type | Current source | New target | Reorderable? | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | Home |  | `site_pages` | Yes |  |
|  |  |  |  |  |  |

## Structured Content

| Entity | Collection | Count | Required fields | Notes |
| --- | --- | --- | --- | --- |
| Pages | `site_pages` |  | title, path, status, SEO |  |
| Posts | `posts` |  | title, slug, dek, body, image, status |  |
| Products/objects | `products` |  | name, slug, maker, craft, image, enquiry copy |  |
| Makers/people | `makers` |  | name, slug, bio, craft, image |  |
| Episodes | `episodes` |  | title, slug, guest, audio URL, transcript |  |
| Enquiries | `enquiries` |  | name, email, message, source item |  |

## Component Mapping

| Existing/design section | Current location | Approved component | Variant | New proposal needed? | Notes |
| --- | --- | --- | --- | --- | --- |
| Hero |  | `block_hero` | split | No |  |
|  |  |  |  |  |  |

## Proposed New Components

Only fill this when approved blocks cannot cover the requirement.

| Need | Reason existing blocks fail | Proposed fields | Behaviour | Risk |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Brand Contract Notes

| Area | Rule |
| --- | --- |
| Palette |  |
| Typography |  |
| Spacing |  |
| Image ratios |  |
| Motion |  |
| Accessibility |  |
| Tone of voice |  |

## Integrations

| Integration | Required? | Owner | Auth method | Notes |
| --- | --- | --- | --- | --- |
| Resend/email |  |  | API key |  |
| Podcast host |  |  | URL/feed/OAuth |  |
| Comments |  |  | Directus/API |  |
| Analytics |  |  | Script/server-side |  |
| Social scheduling/Postiz |  |  | MCP/OAuth |  |

## Permissions

| Role | Can read | Can create | Can update | Can delete | Can publish |
| --- | --- | --- | --- | --- | --- |
| Site runtime | Published content | No | No | No | No |
| Content editor | Tenant content | Drafts | Own drafts | No | No |
| Approver | Tenant content | Drafts | Drafts | No | Yes |
| Directus MCP user | Tenant content | Drafts | Drafts | No | No/controlled |
| Factory service | Brand/registry/proposals | Proposals | Proposals | No | Release records only |

## Migration Batches

| Batch | Routes/collections | Acceptance check | Rollback |
| --- | --- | --- | --- |
| 1 | Brand, navigation, homepage draft | Visual match and build pass | Legacy home |
| 2 | Structured content | Records resolve and media loads | Restore export |
| 3 | Detail templates | Slots render correctly | Legacy route |
| 4 | Forms/integrations | Test submission received | Disable form |

## Acceptance Checklist

- [ ] Sitemap captured.
- [ ] Structured entities mapped.
- [ ] Component inventory completed.
- [ ] Claude/design output mapped to approved components or proposals.
- [ ] Directus schema plan reviewed.
- [ ] Brand contract recorded.
- [ ] Tenant roles scoped.
- [ ] Client MCP TOML generated.
- [ ] Storybook stories added for new components.
- [ ] No executable code stored in Directus.
- [ ] `npm run components:test` passes.
- [ ] `npm run registry:validate` passes.
- [ ] `npm run build` passes.
- [ ] Client can edit one content record.
- [ ] Client can draft or reorder one approved page block.
