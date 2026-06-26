# Directus Setup

This project can read content from Directus, while keeping the local prototype data in `public/mwth-data.jsx` as a fallback.

## Local Server

On this server, Directus is already running in Docker:

```text
container: nakano-directus
local URL: http://127.0.0.1:8055
published port: 8055
```

The Made With These Hands tenant has been bootstrapped into this Directus instance:

```text
tenant slug: made-with-these-hands
```

The setup scripts are:

```bash
npm run directus:bootstrap
npm run directus:seed
npm run directus:site-token
```

They require admin access in the environment:

```bash
DIRECTUS_URL="http://127.0.0.1:8055"
DIRECTUS_ADMIN_TOKEN="..."
```

Do not use the admin token as the long-term website token. It is only for schema/bootstrap work.

`npm run directus:site-token` creates/updates:

```text
role: Made With These Hands Site
policy: Made With These Hands Site Policy
user: directus-mwth-site@nakanodigital.com
```

It writes the restricted static token into `.env.local`.

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
DIRECTUS_URL="http://127.0.0.1:8055"
DIRECTUS_STATIC_TOKEN="site-read-and-submit-token"
```

If the collections are publicly readable, `DIRECTUS_STATIC_TOKEN` can stay empty. If reads require auth, create a Directus static token for a user or role with read access to the content collections.

For the existing self-hosted server, point `DIRECTUS_URL` at that server's base Directus URL. This app is tenant-scoped by configuration; it does not need a separate Directus install.

## Collections

The default collection names are:

```text
makers
products
episodes
posts
site_sections
comments
```

You can override them with:

```bash
DIRECTUS_MAKERS_COLLECTION="makers"
DIRECTUS_PRODUCTS_COLLECTION="products"
DIRECTUS_EPISODES_COLLECTION="episodes"
DIRECTUS_POSTS_COLLECTION="posts"
DIRECTUS_SECTIONS_COLLECTION="site_sections"
DIRECTUS_COMMENTS_COLLECTION="comments"
```

## Tenant Scoping

For a shared Directus instance, use one of these patterns:

1. Give this app a static token whose Directus role/policies can only read this tenant's content.
2. Set a tenant filter if the collections contain multiple tenants:

```bash
DIRECTUS_TENANT_FIELD="tenant"
DIRECTUS_TENANT_VALUE="made-with-these-hands"
```

The filter is applied to `makers`, `products`, `episodes`, optional `posts`, and `comments`. Leave both values empty if the tenant is isolated by collection name or token permissions.

## Field Mapping

The integration accepts these fields, with fallbacks for common naming variants.

`makers`:

```text
slug
name or title
craft or craft_name or category
place or location
established or year_established
image or hero_image or portrait
heroLabel or hero_label or image_alt
dek or description or summary
practiceTitle or practice_title
practice or body
```

`products`:

```text
slug
name or title
maker or maker_slug
craft or craft_name or category
price or formatted_price
place or location
image or product_image
meta or subtitle or description
```

`episodes`:

```text
number or episode_number
maker or maker_slug
guest or name or title
title or name
craft or craft_name or category
place or location
duration
date or published_date or publish_date
audioUrl or audio_url or audio
transcriptUrl or transcript_url
body or description or summary
chapters
```

Directus file fields may be raw file IDs or expanded file objects. Relational `maker` fields may be a maker object, slug, or ID.

`posts`:

```text
slug
title or name
dek or description or summary
date or published_date or publish_date
author or byline
category or section
image or hero_image
body or content
```

`site_sections`:

```text
key
status
label
eyebrow
title or heading
dek or description or summary
body or content
image or hero_image
image_alt or image_label
image_caption
quote
cta_label
cta_href
secondary_cta_label
secondary_cta_href
meta
extra
```

Use `site_sections` for page-level content that is not a maker, product, episode, or post. Current keys include homepage sections, shop/blog/podcast headers, the Hugh page, commissions page, shared episode imagery, and footer content. The `extra` JSON field holds structured repeaters such as footer columns, metrics, process steps, past commissions, timeline items, and commission type options.

`comments`:

```text
episode
name
email
body
status
```

The episode reference field is configurable:

```bash
DIRECTUS_COMMENTS_EPISODE_FIELD="episode"
DIRECTUS_COMMENTS_STATUS_FIELD="status"
DIRECTUS_COMMENTS_STATUS_VALUE="approved"
DIRECTUS_COMMENTS_DEFAULT_STATUS="pending"
```

Episode pages read approved comments and create new comments as pending. If you use a Directus moderation workflow, map those values to your real status field.

## Runtime

The browser fetches `/api/mwth-data`. If Directus is not configured or the request fails, the site uses the local data file.

## Enquiries

Products do not use checkout or Vendure. Product pages open an enquiry form and post to `/api/enquiries`, which sends an email through Resend.

Set these environment variables:

```bash
RESEND_API_KEY=""
ENQUIRY_FROM_EMAIL="Made With These Hands <enquiries@your-domain.example>"
ENQUIRY_TO_EMAIL="hugh@your-domain.example"
```

`ENQUIRY_FROM_EMAIL` must use a domain verified in Resend. The visitor's email is set as `replyTo`, so Hugh can reply directly.
