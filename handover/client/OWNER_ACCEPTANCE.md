# Owner Acceptance

Run these prompts in order after both MCP servers show as connected.

## 1. Read-only context

```text
Read the Made With These Hands tenant, brand contract, and approved component
registry. List the page records and component types you can access. Do not edit
anything.
```

## 2. Inspect the prepared draft

```text
Open the Directus draft page at /owner-acceptance. Explain its SEO metadata,
ordered blocks, slots, and variants. Do not publish it.
```

## 3. Safe content edit

```text
Change only the body copy in the Text block on /owner-acceptance so it says this
draft was reviewed by Hugh. Keep it a draft and preserve the block order.
```

## 4. Safe composition

```text
Move the Call to Action after the Text block on /owner-acceptance. Use only the
existing approved records. Keep the page unpublished and report the final order.
```

## 5. Component guardrail

```text
Check whether an audio chapter player is already approved. If it is not, classify
the request and create a Component Factory proposal only. Do not publish, deploy,
or change the Directus schema.
```

Acceptance passes when Codex can complete the tenant-owned draft operations,
cannot delete or access another tenant, and routes new behaviour through the
Factory rather than inserting executable content into Directus.
