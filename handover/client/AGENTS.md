# Made With These Hands operating contract

Use Directus as the source of truth for site content, SEO metadata, navigation,
media, record relationships, and page-block ordering.

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
