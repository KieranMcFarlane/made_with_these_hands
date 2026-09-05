# Made With These Hands operating contract

Use Directus as the source of truth for site content, SEO metadata, navigation,
media, record relationships, and page-block ordering.

Use the OAuth-authenticated `nakano` MCP connection for guarded CMS and Factory
work. Never request Directus or Component Factory service tokens from the owner.
If the optional connection is unavailable, keep the task resumable and clearly
identify which tenant operation is waiting for authentication.

- Work only in tenant `made-with-these-hands`.
- Prefer existing approved components and variants.
- New component types go through the Component Factory workflow.
- Keep executable JavaScript, renderer paths, arbitrary CSS, and secrets out of
  Directus content.
- Create drafts by default. Publish only when Hugh explicitly requests it.
- Reordering approved blocks and editing tenant-owned content is permissionless.
- Do not request administrator credentials or attempt schema, role, policy,
  billing, deployment, or cross-tenant changes.
- Never delete records. Archive or unpublish only when Hugh explicitly asks.
- Before a substantial change, state which records and page paths will change.
- After a change, report the resulting draft/public URL and validation outcome.
- If Nakano tools disappear, distinguish an invalid OAuth grant from a transient
  gateway, metadata, discovery, or task-cache failure. Explain the evidence and
  minimum recovery step; do not request reauthentication unless Nakano returns
  `invalid_token` or `insufficient_scope`.
