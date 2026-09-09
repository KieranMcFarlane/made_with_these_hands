# Live Owner Demo

This is the five-minute practical segment to show Hugh what he can do himself.
Use draft records only. Do not edit a published page, maker, object, episode, or
journal post during the call.

## Before The Call

- Open Nakano Control at `/tenant/start`. Its proof links open the site, Brand
  Book, Storybook, and Directus Studio.
- Confirm the Nakano MCP connection is active in Codex.
- Use only the permanent draft page `/owner-acceptance` for edits and reordering.
- Do not show terminals, credentials, permission settings, or administration
  screens.

## The Live Segment

### 1. Change Content (45 seconds)

Copy **Change a title** from Control's Owner actions. Run it in Codex, then point
out the returned operation ID, draft status, preview link, and undo availability.

Say:

> You can update ordinary editorial content directly. The page is still made
> from approved building blocks, so changing copy does not compromise its design
> or mobile behaviour.

### 2. Change A Picture (45 seconds)

Copy **Change an image**. Codex first uses `site_list_assets`; choose one of the
existing images, then let Codex assign it with useful alt text through
`site_set_hero_image`.

Say:

> Photography lives in the CMS as a real asset with caption and alt text. You
> can change the story a page leads with without needing a developer to crop or
> re-code the layout.

Do not upload an unreviewed image during the recording. Use an existing media
asset so the focus stays on the workflow, not file preparation.

### 3. Reorder The Page (45 seconds)

Copy **Reorder blocks**. Codex reads the current composition and uses
`site_reorder_blocks`, which requires every current block exactly once.

Say:

> This is page composition: the same approved sections can be ordered to suit
> the story. It remains a draft until you decide to publish it.

### 4. Create A New Draft Page (60 seconds)

Copy **Create a page**, or use this prompt:

```text
Create a draft page for a Made With These Hands open studio weekend.
Use only approved Hero, Text, Listing, and CTA blocks. Add a title, URL path,
SEO title, meta description, and one enquiry CTA. Keep it in draft, do not add
it to navigation, and report the final block order.
```

Open the returned preview and, if useful, show the same draft record in
Directus. Do not publish it.

Say:

> Codex can do the administrative assembly work, but it is using this site’s
> content model, approved components, and brand rules. It cannot make a random
> page outside those boundaries.

### 5. Undo Or Reset (45 seconds)

Copy **Undo my last change** and run it. Show the undo receipt and restored
content. If the demo page needs to be returned to its known starting state, use
**Reset the demo** instead.

Say:

> Every owner change has an audit receipt and a snapshot. Delete is presented
> as recoverable archive, and an accidental change can be undone without
> exposing backups or administrator controls.

## What To Show If Time Allows

- Change an object CTA from an availability message to an enquiry action.
- Edit a maker biography and show the linked podcast episode and objects.
- Create a structured draft journal post in Directus and show its SEO, image,
  author, and related-content fields.
- Open the Component Factory and show that a genuinely new interaction starts as
  a proposal and preview, rather than silently changing the live site.

## What The Demo Proves

- Hugh can change content and media.
- Hugh can reorder approved page sections.
- Hugh can create a new draft page with SEO.
- Hugh receives a receipt and undo route for each owner change.
- Hugh can archive and restore content without permanent deletion.
- Codex has useful autonomy but remains tenant-scoped, brand-aware, and
  draft-first.

## Close The Demo

> The day-to-day work is now yours: update content, assemble pages, preview the
> result, undo mistakes, and publish when you are ready. The system protects the
> quality of the site while leaving specialist component work as a separate,
> reviewable path.

Do not make the demonstration page public. Archive or retain any newly created
draft only after Hugh decides whether it is a useful editorial starting point.
