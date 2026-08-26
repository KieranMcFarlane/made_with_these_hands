# Directus Content Block Model

This is the canonical content structure for Made With These Hands. It is
currently verified against Directus 12.0.2 and its native Streamable HTTP MCP.
Directus MCP and the frontend work from this one predictable model.

## Primary Collections

```text
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
```

`site_sections` remains a legacy fallback for existing keyed content. New flexible page content should use `site_pages.blocks`.

## Page Builder

Use a Directus Builder field on `site_pages`:

```text
collection: site_pages
field: blocks
type: alias
interface: Builder (M2A)
allowed collections:
  block_hero
  block_text
  block_media
  block_quote
  block_listing
  block_cta
  block_slideshow
```

`block_podcast_player` is implemented in the frontend, represented in Storybook,
and held in `component_proposals` as `awaiting_approval`. The Directus Core
instance is at its `25/25` custom-collection limit, so the dedicated collection
is not deployed. It must remain proposed until collections are consolidated or
the Directus entitlement changes.

This creates a Many-to-Any relationship from a page to ordered block items. Agents should edit the target block item, not duplicate whole pages.

## Frontend Rendering Contract

Every published `site_pages` record is addressable by its `path`. The Next.js catch-all route reads that record, keeps the Builder order, and dispatches each item by its collection:

```text
block_hero    -> Hero
block_text    -> Text
block_media   -> Media
block_quote   -> Quote
block_listing -> Listing
block_cta     -> Call to action
block_slideshow -> Slideshow
block_podcast_player -> Podcast player (frontend ready; CMS collection pending)
```

This means a client can create, compose, reorder, edit, and publish pages in Directus without changing frontend code. Directus MCP operates on the same records and relationships.

The Brand Book at `/brand` is the visual catalogue for these supported components. It is not the renderer for ordinary pages.

Frontend code is only required when introducing a new block collection, new component behaviour, or a field that an existing component does not yet render.

New component work is governed by `component-system/components.mjs` and the Component Factory MCP server. The manifest is the single source for Directus bootstrap, Builder collections, permissions, hydration, the frontend catalogue, and the Brand Book. Component proposals prefer shadcn primitives and require validation plus human approval before release.

## Controlled Variants and Template Slots

Variants are dropdowns, not freeform style values. They increase composition options while keeping the approved design system:

```text
block_hero.variant     split | cover | minimal
block_text.variant     left | centered | two-column
block_media.variant    full-width | figure | gallery
block_listing.variant  grid | featured | archive
block_cta.variant      panel | band
block_slideshow.variant editorial | full-width | thumbnail-rail
```

Each `site_pages_blocks` junction item also has a controlled `slot`:

```text
main
before-content
after-content
related-content
```

The generic page renderer consumes these slots in that order. Existing junction rows without a stored slot safely fall back to `main`, and existing blocks without a stored variant use their original layout.

The core archive, static, and detail routes are hybrid `site_pages` templates. Their structured records and legacy layouts remain the source of core content; Builder blocks provide optional supporting sections around them:

```text
about
contact
objects_index
makers_index
podcast_index
journal_index
product_detail
maker_detail
episode_detail
post_detail
```

```text
before-content   after the masthead, before the structured record
main             safe fallback; rendered after the structured record
after-content    after the structured record
related-content  after supporting content, before the footer
```

Published index/static pages, products, makers, episodes, and posts have corresponding published `site_pages` records. New editorial records should receive the same detail-page record as part of their publishing workflow.

## Client Page Workflow

```text
1. Create a site_pages record with a unique path.
2. Keep the page in draft while composing.
3. Add blocks through the Builder field.
4. Edit block content and accessible image text.
5. Drag blocks into the intended order.
6. Change the page status to published.
7. Visit the configured path on the website.
```

## Core Page Fields

```text
tenant
path
canonical_path
status
page_type
title
seo_title
description
priority
change_frequency
sort
blocks
```

Recommended page types:

```text
home
about
objects_index
product_detail
makers_index
maker_detail
podcast_index
episode_detail
journal_index
post_detail
contact
commissions
craft_index
custom
```

## Block Collections

All block collections share these fields:

```text
tenant
status
key
eyebrow
title
dek
theme
```

Use `key` only when the block should also feed an existing keyed frontend section such as `hero`, `mission`, `shop_index`, `blog_index`, `podcast_index`, `hugh`, or `commissions`.

### block_hero

```text
variant
image
image_alt
cta_label
cta_href
secondary_cta_label
secondary_cta_href
```

### block_text

```text
variant
body
alignment
```

`body` is JSON so it can hold paragraphs, notes, or small repeaters.

### block_media

```text
variant
image
image_alt
images
caption
```

Use `images` JSON only for lightweight galleries. If galleries become large, move them to a proper related collection.

### block_quote

```text
quote
quote_attribution
```

### block_listing

```text
variant
listing_type
craft
maker
items_limit
```

Recommended listing types:

```text
products
makers
episodes
posts
related_objects
related_episodes
related_posts
```

### block_cta

```text
variant
cta_label
cta_href
secondary_cta_label
secondary_cta_href
```

### block_slideshow

```text
variant
slides
  image
  image_alt
  caption
  credit
show_captions
show_counter
autoplay
interval
```

The slideshow uses the approved shadcn Carousel and Button primitives. It supports swipe and keyboard navigation, visible focus, reduced-motion preferences, a maximum of 12 slides, and an autoplay interval of at least four seconds.

## Editorial Collections

### makers

```text
tenant
slug
status
name
craft
place
established
dek
bio
image
hero_image
hero_label
practice_title
practice
seo_title
seo_description
```

### products

Products are enquiry-led objects, not checkout SKUs.

```text
tenant
slug
status
name
maker
craft
place
price
meta
summary
description
image
gallery
enquiry_enabled
seo_title
seo_description
```

### episodes

```text
tenant
number
slug
status
maker
guest
title
craft
place
duration
date
summary
body
audio_url
transcript
transcript_url
chapters
related_products
related_posts
seo_title
seo_description
```

### posts

```text
tenant
slug
status
title
dek
author
date
category
image
body
related_makers
related_products
related_episodes
seo_title
seo_description
```

### comments

```text
tenant
episode
name
email
body
status
date_created
```

Recommended statuses:

```text
pending
approved
rejected
```

### enquiries

```text
tenant
product
product_name
maker_name
name
email
phone
message
status
date_created
```

Recommended statuses:

```text
new
replied
closed
```

## MCP Editing Rules

```text
Inspect schema before editing.
Use stable slugs and page paths.
Find the page, then find the specific block in site_pages.blocks.
Edit the existing block item when possible.
Create a new block only when a new visual/content section is required.
Keep products enquiry-first, never checkout-first.
Keep comments moderated by status.
Store SEO title and description on public records.
Use tenant filtering or tenant-scoped Directus roles.
```
