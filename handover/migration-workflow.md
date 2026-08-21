# Existing Site and Design Output Migration Workflow

## Purpose

This workflow turns an existing website, a Claude design output, or both into a
tenant-safe Directus and Component Factory project.

The goal is not to paste generated code into production. The goal is to extract
the useful structure, content, visual intent, and repeated patterns, then map
them into:

- Directus collections and page blocks;
- the approved component registry;
- Storybook previews;
- the Component Factory proposal workflow;
- Codex MCP configuration for ongoing client work.

## Inputs

Collect these before migration starts:

| Input | Use |
| --- | --- |
| Existing website URL or export | Sitemap, current content, current IA, SEO state |
| Claude design output | Visual direction and candidate section layouts |
| Brand assets | Logo, fonts, palette, image treatment, tone |
| Content exports | Products, posts, people, episodes, media, forms |
| Client permissions | Who can edit, approve, publish, and administer |
| Integrations | Email, analytics, social posting, podcast host, forms |

Claude, v0, Figma, or HTML design output is treated as reference material. It
does not become the source of truth until it has passed through the registry and
guardrails.

## Migration Stages

### 1. Capture Sitemap and Page Families

Create a route inventory:

```text
/                         Home
/about                    Founder/profile page
/journal                  Blog index
/journal/[slug]           Blog detail
/podcast                  Podcast archive
/podcast/[slug]           Episode detail
/objects                  Product/object index
/objects/[slug]           Product/object detail
/makers/[slug]            Maker/guest detail
/contact                  Contact/enquiry
```

For each route, record:

- purpose;
- owner;
- current source system;
- SEO title and description;
- reusable sections;
- forms or interactions;
- media requirements;
- whether the client must reorder sections.

### 2. Extract Structured Content

Separate content from layout.

Common collections:

| Content type | Directus collection |
| --- | --- |
| Pages | `site_pages` |
| Navigation | `navigation_items` |
| Posts/articles | `posts` |
| Products/objects | `products` |
| Makers/people/guests | `makers` |
| Podcast episodes | `episodes` |
| Comments | `comments` |
| Enquiries | `enquiries` |
| Brand rules | `brand_settings` |

For a different client, rename or extend these domain collections, but keep the
same separation:

- page composition lives in `site_pages` and typed `block_*` collections;
- domain records live in their own structured collections;
- executable behaviour stays in frontend code.

### 3. Build the Component Inventory

For each page section or design section, classify it:

| Classification | Example | Migration target |
| --- | --- | --- |
| Builder block | Hero, text, media, listing, CTA | Approved `block_*` collection |
| Structured template | Product detail, episode detail | Route template plus optional slots |
| Listing/card | Product cards, episode rows | `block_listing` or template renderer |
| Interactive module | Enquiry form, comments, player | Explicit frontend contract |
| Site chrome | Header, footer, nav | Global settings/navigation |
| Primitive | Buttons, inputs, image frame | Implementation detail |

Prefer mapping to existing approved blocks:

- `block_hero`
- `block_text`
- `block_media`
- `block_quote`
- `block_listing`
- `block_cta`
- `block_slideshow`
- `block_podcast_player`

Create a Component Factory proposal only when a section cannot be expressed as
an approved block, variant, or safe composition.

### 4. Map Design Output to Guarded Components

For Claude design output:

1. Identify every section.
2. Name the content fields needed by each section.
3. Map the section to an approved component where possible.
4. Capture visual differences as controlled variants, not arbitrary CSS.
5. Reject inline scripts, generated state machines, unknown dependencies, and
   production renderer paths.
6. Create a proposal for missing components.
7. Add a Storybook story for accepted components.
8. Register the component in the shadcn/registry surface where appropriate.

Allowed extraction:

- layout intent;
- copy;
- imagery;
- field names;
- interaction requirements;
- responsive behaviour notes.

Not allowed as Directus content:

- executable JavaScript;
- import paths;
- unreviewed dependencies;
- arbitrary CSS strings;
- secrets;
- database credentials;
- admin tokens.

### 5. Create the Directus Schema Plan

Before touching Directus, document:

- tenant name and domain;
- collections to create;
- fields to add;
- roles and permissions;
- public read surfaces;
- MCP user permissions;
- files/media policy;
- required seed data;
- rollback plan.

Minimum tenant identities:

| Identity | Purpose |
| --- | --- |
| Site runtime token | Read published tenant content only |
| Directus MCP user | Tenant-scoped content editing |
| Factory service user | Registry, brand, and proposal workflow |
| Human approver | Approves publishable component proposals |

### 6. Seed Content Progressively

Migrate in this order:

1. Brand settings and navigation.
2. Structured records: makers, products, posts, episodes.
3. Draft `site_pages` records.
4. Builder blocks for each page.
5. Optional slots for structured detail templates.
6. Enquiry/comment/podcast integration data.
7. SEO metadata and redirects.

Do not publish everything at once. Migrate route families in batches and retain
a rollback path.

### 7. Preview and Validate

Every migrated component/page should pass:

```bash
npm run components:test
npm run registry:validate
npm run build
```

When live Directus is configured:

```bash
npm run components:validate-live
npm run components:smoke
```

Use Storybook to inspect:

- isolated block stories;
- page sequence story;
- missing media states;
- mobile widths;
- reduced-motion behaviour;
- long copy and empty states.

### 8. Configure Client Codex

Generate a client-specific TOML from `handover/codex-mcp.example.toml`.

The client should receive:

- Directus MCP URL;
- Directus MCP tenant token or OAuth details;
- Component Factory MCP URL;
- Factory client token;
- project instructions;
- allowed actions and escalation rules;
- examples of safe prompts.

Example client prompts:

```text
Review the current home page blocks and suggest a tighter ordering.

Create a draft text block for the maker page using the approved brand voice.

Replace the object listing filter with an approved archive variant.

Propose a new component for a press quotes carousel, but do not publish it.
```

### 9. Handover

Client handover includes:

- Directus login;
- Codex MCP setup;
- owner capability guide;
- brand book URL;
- Storybook URL if exposed;
- list of editable content types;
- list of things that require approval;
- recovery process;
- support contact.

## Definition of Done

A migration is ready when:

- every migrated route has a Directus record or an intentional legacy fallback;
- approved components render through code-owned renderer maps;
- Storybook has stories for new registry components;
- Directus contains no executable code;
- tenant permissions are scoped;
- enquiry/comment/email flows are tested;
- build and component tests pass;
- the owner can complete one content edit and one draft component operation in
  Codex without developer intervention.

