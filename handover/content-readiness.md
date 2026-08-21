# Content Readiness

Verified against Directus 12.0.2 on 21 August 2026.

## Available Now

- All seven primary navigation pages exist and are published.
- Five maker records, seven enquiry-enabled object records, five demo episode
  records, and two journal records drive the current design proof.
- The real Made With These Hands Podbean RSS feed is connected. All 36 feed
  episodes were imported with stable GUIDs, canonical episode links, dates,
  descriptions, durations, audio URLs, and derived SEO metadata.
- Every RSS episode was created as `draft`; the sync never auto-publishes.
- The `/owner-acceptance` page exists as draft record `59` with three ordered
  approved blocks. It is available through the owner MCP identity and excluded
  from published site data.
- Eight earlier Nakano design-discovery pages remain drafts and are not part of
  the public route set.

## Demo Versus Confirmed Content

The five published episode pages numbered `042`, `043`, `045`, `046`, and `047`
are design-demo records and do not match Hugh's live RSS catalogue. The maker,
object, and journal copy also came from the design/seed package. It should not
be represented as owner-approved biography or product copy until Hugh confirms
it.

The RSS import is source-backed from Hugh's public feed at
`https://feed.podbean.com/hughmn/feed.xml`. Re-run safely with:

```bash
npm run directus:podcast-sync
DIRECTUS_ADMIN_TOKEN="<operator-secret>" npm run directus:podcast-sync -- --apply
```

The first command is a dry run. The apply command creates new records as drafts,
updates previously imported records by GUID, and preserves their current
publication status.

## Owner Input Required

- Confirm which demo makers, objects, journal entries, and episode pages are
  real and publishable.
- Approve guest names, guest-to-maker relations, and craft categories for the
  36 imported podcast drafts.
- Supply or approve transcripts. The RSS feed does not contain them.
- Supply final maker portraits and object photography. Current local images are
  design/demo assets and have not been promoted as approved CMS media.
- Confirm object descriptions, availability, prices, and enquiry wording.
- Confirm the production enquiry recipient and provide the production Resend
  API/domain configuration through the server secret store.

Run `npm run directus:content-audit` for the current machine-readable gap report.
