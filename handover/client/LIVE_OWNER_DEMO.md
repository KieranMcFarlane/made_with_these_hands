# Live Owner Demo

This is the five-minute practical segment to show Hugh what he can do himself.
Use draft records only. Do not edit a published page, maker, object, episode, or
journal post during the call.

## Before The Call

- Open the site, Directus Studio, Codex, the Brand Book, and Storybook.
- Confirm the Nakano MCP connection is active in Codex.
- Open the existing draft page `/owner-acceptance` in Directus.
- Keep the site on a separate tab for the draft preview.
- Do not show terminals, credentials, permission settings, or administration
  screens.

## The Live Segment

### 1. Change Content (45 seconds)

Open the Text section on `/owner-acceptance` and revise its title or body. Save
it as a draft and refresh the preview.

Say:

> You can update ordinary editorial content directly. The page is still made
> from approved building blocks, so changing copy does not compromise its design
> or mobile behaviour.

### 2. Change A Picture (45 seconds)

Open the Hero or Media section on the same draft. Choose an existing approved
Directus asset, replace the image, write useful alt text, then save the draft.

Say:

> Photography lives in the CMS as a real asset with caption and alt text. You
> can change the story a page leads with without needing a developer to crop or
> re-code the layout.

Do not upload an unreviewed image during the recording. Use an existing media
asset so the focus stays on the workflow, not file preparation.

### 3. Reorder The Page (45 seconds)

Move the Call to Action below the Text section on `/owner-acceptance`. Save and
refresh the preview.

Say:

> This is page composition: the same approved sections can be ordered to suit
> the story. It remains a draft until you decide to publish it.

### 4. Create A New Draft Page (60 seconds)

In Codex, use this prompt:

```text
Create a draft page for a Made With These Hands open studio weekend.
Use only approved Hero, Text, Listing, and CTA blocks. Add a title, URL path,
SEO title, meta description, and one enquiry CTA. Keep it in draft, do not add
it to navigation, and report the final block order.
```

Show the resulting page record and its ordered blocks in Directus. Do not
publish it.

Say:

> Codex can do the administrative assembly work, but it is using this site’s
> content model, approved components, and brand rules. It cannot make a random
> page outside those boundaries.

### 5. Add A Journal Story (60 seconds)

In Codex, use this prompt:

```text
Create a draft journal post called "Notes from the workshop bench".
Use the Made With These Hands editorial voice. Add an SEO title, description,
slug, featured image alt text, a short introduction, and a related maker.
Keep it as a draft and do not publish or change existing posts.
```

Open the draft journal record in Directus and show the structured fields.

Say:

> A journal post is not just a page of text. It is structured content: it can
> carry its SEO, image accessibility, author/maker relationships, and future
> reuse in listings automatically.

## What To Show If Time Allows

- Change an object CTA from an availability message to an enquiry action.
- Edit a maker biography and show the linked podcast episode and objects.
- Open the Component Factory and show that a genuinely new interaction starts as
  a proposal and preview, rather than silently changing the live site.

## What The Demo Proves

- Hugh can change content and media.
- Hugh can reorder approved page sections.
- Hugh can create a new draft page with SEO.
- Hugh can create a structured draft journal post.
- Codex has useful autonomy but remains tenant-scoped, brand-aware, and
  draft-first.

## Close The Demo

> The day-to-day work is now yours: update content, assemble pages, and publish
> when you are ready. The system protects the quality of the site while leaving
> specialist component or platform work as a separate, reviewable path.

Do not make the open-studio page or journal post public during the demo. Delete
or retain the drafts only after Hugh has decided whether they are useful real
editorial starting points.
