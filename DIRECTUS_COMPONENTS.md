# Directus Component Model

This is the repeatable content structure for Made With These Hands. It is designed so Directus, the Directus MCP, and the frontend all work from predictable collections and field names.

## Primary Collections

```text
makers
products
episodes
posts
comments
pages
page_blocks
enquiries
```

## Core Relationships

```text
maker 1--many products
maker 1--many episodes
episode many--many products
post many--many makers
post many--many products
post many--many episodes
episode 1--many comments
page 1--many page_blocks
```

## Makers

Used for maker pages and podcast guest pages.

```text
slug
name
craft
place
established
dek
bio
portrait
hero_image
hero_label
practice_title
practice_body
seo_title
seo_description
```

## Products / Objects

Used for the object archive and product detail pages.

```text
slug
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
status
enquiry_enabled
seo_title
seo_description
```

## Episodes

Used for the podcast archive and individual podcast pages.

```text
number
slug
title
maker
guest
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

## Posts

Used for the journal/blog index and article pages.

```text
slug
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

## Comments

Used under podcast episode pages.

```text
episode
name
email
body
status
date_created
tenant
```

Recommended statuses:

```text
pending
approved
rejected
```

## Enquiries

Optional Directus record of product enquiries. Email is sent through Resend, but storing a Directus record gives Hugh an admin trail.

```text
product
product_name
maker_name
name
email
phone
message
status
date_created
tenant
```

Recommended statuses:

```text
new
replied
closed
```

## Pages

Used when non-model pages need flexible content.

```text
slug
title
page_type
seo_title
seo_description
blocks
```

Recommended page types:

```text
home
about
objects_index
podcast_index
journal_index
contact
craft_index
custom
```

## Repeatable Blocks

Use one `page_blocks` collection with a `block_type` field and type-specific fields. This keeps the MCP workflow predictable.

```text
id
page
sort
block_type
eyebrow
title
dek
body
image
images
quote
quote_attribution
cta_label
cta_url
maker
product
episode
post
craft
items_limit
theme
```

Recommended block types:

```text
hero
text
image
gallery
quote
maker_bio
product_grid
episode_list
post_list
related_objects
related_episodes
comments
enquiry_cta
contact_form
newsletter
```

## Page Mapping

```text
Home
  pages.slug = home
  blocks: hero, text, episode_list, maker_bio, product_grid, post_list, enquiry_cta

Objects
  products collection
  optional pages.slug = objects

Product Page
  products.slug
  maker relation
  related episodes by maker
  enquiry_cta block

Hugh Bio
  pages.slug = about
  or makers.slug = hugh-mcneill

Maker / Guest Page
  makers.slug
  related products
  related episodes

Podcast Archive
  episodes collection
  optional pages.slug = podcast

Podcast Episode Page
  episodes.slug or episodes.number
  maker relation
  related products
  comments

Journal
  posts collection
  optional pages.slug = journal

Journal Article
  posts.slug
  related makers/products/episodes

Contact / Commissions
  pages.slug = contact
  blocks: hero, text, contact_form
```

## MCP Rules

For reliable Directus MCP usage:

```text
Use stable slugs for all public records.
Use relation fields instead of copying names where possible.
Keep block_type values from the approved list.
Keep comments moderated by status.
Keep products enquiry-first, not checkout-first.
Store SEO title/description per public record.
Use tenant filtering or tenant-scoped Directus roles.
```
