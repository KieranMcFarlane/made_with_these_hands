# Owner Capability Guide

This is the simple version of what the owner can do from Codex once Directus MCP and Component Factory MCP are installed.

## Content

The owner can ask Codex to:

- update the homepage copy;
- edit Hugh's bio;
- add or revise a maker/guest bio;
- add a product-style object page;
- change an object from available to enquiry-led;
- add a podcast episode;
- add show notes, transcript links, guest context, and related objects;
- moderate or summarise comments;
- create or edit a blog post;
- update contact page copy;
- update SEO titles, descriptions, slugs, and image alt text.

## Pages

The owner can ask Codex to:

- create a new page;
- add approved sections to a page;
- reorder page sections;
- move a section into a controlled slot such as `before-content`, `main`, `after-content`, or `related-content`;
- update CTA labels and links;
- change navigation labels, destinations, and ordering.

Pages are built from approved Directus block types:

```text
block_hero
block_text
block_media
block_quote
block_listing
block_cta
block_slideshow
block_podcast_player
```

## Brand

The owner can ask Codex to:

- read the brand book;
- update approved brand settings;
- adjust colour tokens that are exposed through Directus;
- revise voice/tone guidance;
- check whether a page follows the brand rules;
- explain which components are approved and where they are used.

Brand changes should be reviewed before production if they affect the public look of the whole site.

## New Components

The owner can ask for a new reusable component, for example:

```text
Create a proposal for an audio chapter player for podcast episodes.
```

Codex should not add that component straight into production. It should:

1. Read the brand contract.
2. Read the approved component registry.
3. Prefer existing shadcn/Radix primitives.
4. Document why existing blocks are not enough.
5. Create a component proposal.
6. Validate the proposal.
7. Prepare a preview.
8. Wait for human approval in Directus before publication.

## Good Prompts

```text
Add a new journal post about the latest podcast recording. Use the existing brand voice and include SEO metadata.
```

```text
Create a new landing page for a glass engraving workshop. Use only approved blocks and leave it as draft.
```

```text
Move the podcast listing above the journal listing on the dashboard page.
```

```text
Update the CTA on the product page so it says "Enquire about this object" and links to the contact form.
```

```text
Check whether the homepage uses any unapproved component types.
```

## Boundaries

Codex should not:

- delete live content without explicit human approval;
- use admin Directus credentials;
- bypass tenant filters;
- store JavaScript or renderer paths inside Directus content;
- create unapproved production components;
- ignore the brand book;
- make broad CSS/source changes when an approved Directus setting or component proposal is the right route.

The point is not to lock the owner out. The point is to make the site editable without letting it drift into a pile of one-off sections.
