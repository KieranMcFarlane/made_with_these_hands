# Nakano Mission Control Client Demo

Use this as an eight-to-twelve-minute walkthrough. The purpose is to show one
governed operating system, not a collection of disconnected tools.

## Before Recording

Verify the local proof:

```bash
cd /home/em9/repos/made_with_these_hands
npm run components:validate-live
DIRECTUS_ADMIN_TOKEN="$(docker exec nakano-directus printenv ADMIN_TOKEN)" npm run components:validate-policy
npm run client-access:verify
npm run directus:content-audit
npm run component-factory:verify-local
npm run components:smoke
```

Open:

- site: `http://localhost:3038`;
- owner dashboard: `http://localhost:3038/dashboard`;
- living brand book: `http://localhost:3038/brand`;
- Storybook page sequence: `http://localhost:6006/?path=/story/mwth-directus-blocks--page-sequence`;
- Storybook component inventory: `http://localhost:6006/?path=/story/mwth-brand-book-component-inventory--inventory`;
- Directus Studio: `https://cms.nakanodigital.com/admin`.

Do not display tokens, environment files, Directus administration settings, or
server terminals containing credentials during the recording.

## Walkthrough

### 1. The Result

Show the homepage, maker page, object page, podcast episode, journal, and contact
page.

Say:

> This is not a generic page-builder site. Makers, objects, episodes, guests,
> journal entries, comments, and enquiries are connected records. The object
> journey is personal enquiry rather than automated checkout.

### 2. The Living Brand Contract

Open `/brand` and show identity, colour, typography, voice, imagery, approved
components, and their current usage.

Say:

> The Claude Design output established the creative direction. We converted
> that direction into a versioned contract that both people and Codex can read.
> The contract now controls spacing, motion, accessibility, image ratios,
> component sources, and CMS safety as well as colour and type.

### 3. Storybook as Proof

Open the page-sequence story, then show one component in several states.

Say:

> Storybook is the component workshop and proof surface. These are the same
> React renderers and Directus-shaped records used by the site. Every approved
> block is represented, including missing-data and behavioural states, and
> accessibility findings are configured to fail rather than remain advisory.

### 4. Directus Composition

In Directus, open the draft `/owner-acceptance` `site_pages` record and its
ordered Builder blocks.
Move one approved block, save it as draft, and refresh the corresponding preview.

Say:

> Directus owns content, relations, ordering, SEO, and approved variants. It
> does not contain JavaScript, renderer paths, or arbitrary CSS. Hugh can edit
> and reorder the page without becoming responsible for implementation code.

Keep the record in draft. It was prepared specifically for owner acceptance, so
Hugh can keep the accepted order and wording.

### 5. Codex as Mission Control

Use a read-only prompt first:

```text
Read the Made With These Hands brand contract and list the approved page blocks.
Then explain which Directus records build the podcast page. Do not edit anything.
```

Then show a safe composition prompt:

```text
Create a draft journal landing page using approved Hero, Listing, and CTA blocks.
Follow the brand contract, include SEO metadata, and do not publish it.
```

Say:

> Codex is useful here because it receives the business context, brand rules,
> content model, component catalogue, and scoped permissions. Codex alone would
> not possess those things.

### 6. Extending the System

Ask the Factory to inspect or propose a component:

```text
Check whether an audio chapter player is already approved. If it is missing,
classify the request against the tenant guardrails and create a proposal only.
Do not publish or deploy it.
```

Say:

> A safe tenant component can progress through validation and preview without a
> developer permission ceremony. Unknown packages, executable CMS content,
> schema or permission changes, shared registry publication, and deployment
> still cross a human approval boundary.

### 7. Enquiry and Follow-up

Open an object page and show the enquiry action.

Say:

> This keeps the useful product catalogue without imposing a checkout workflow.
> The enquiry is stored in Directus and can notify Hugh through Resend. Hugh can
> then follow it up personally. External replies remain reviewable actions.

### 8. Nakano

Finish on `/dashboard`.

Say:

> Made With These Hands is the canonical Nakano editorial tenant. Nakano defines
> the tenant, permissions, services, approvals, and operating surfaces. Directus
> holds structured state, Storybook proves the components, the Factory governs
> extensions, and Codex operates the whole system within those boundaries.

## Production State

The public host is `https://hands.nakanodigital.com`. Cloudflare already routes
it to the enabled production service on port `3009`. The service is isolated
from Nakano's estate-wide focus-profile pause and uses its own safety marker:

```text
/home/em9/ops/watchdog/mwth-service.paused
```

Creating that marker prevents MWTH from starting after the next service stop or
reboot. It does not alter the global Nakano pause or enable any legacy module.

Verify the production route before recording:

```bash
systemctl --user start made-with-these-hands.service
systemctl --user status made-with-these-hands.service --no-pager
curl --fail https://hands.nakanodigital.com
```

## Acceptance Proof

- Directus 12.0.2 exposes its native MCP over HTTPS.
- Directus reports seven deployed block collections and one governed pending
  Podcast Player component; Core is at `25/25` custom collections.
- Storybook exposes all eight approved block types and 14 stories.
- The shadcn registry contains nine validated installable items.
- Unauthenticated Factory MCP calls return `401`.
- Authenticated Factory discovery reports client id `made-with-these-hands` and
  isolation `single-client`.
- Production smoke testing passes all published site paths and component
  proposal previews.
- Directus MCP and site runtime credentials are separate.
- The restricted Directus token passes the policy validator across 64
  collection-level permissions, can resolve only `made-with-these-hands`
  records, and cannot delete.
- The current Directus Core boundary is a single-tenant database. Do not add a
  second tenant to this database without licensed row filters or a separate
  instance.
- The real Podbean RSS catalogue is synchronized into Directus as 36 drafts;
  none are auto-published.
- No tenant workflow exposes delete, role, permission, or secret access; schema
  metadata is readable for composition, but schema mutation is not granted.
