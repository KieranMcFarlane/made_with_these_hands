# Directus v12 Content Block Model

This is the canonical content structure for Made With These Hands. It is designed for Directus v12, Directus MCP, and the frontend to work from one predictable model.

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
```

This creates a Many-to-Any relationship from a page to ordered block items. Agents should edit the target block item, not duplicate whole pages.

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
image
image_alt
cta_label
cta_href
secondary_cta_label
secondary_cta_href
```

### block_text

```text
body
alignment
```

`body` is JSON so it can hold paragraphs, notes, or small repeaters.

### block_media

```text
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
cta_label
cta_href
secondary_cta_label
secondary_cta_href
```

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

