# Owner Acceptance

**Current gate:** awaiting Hugh McNeill's final sign-off. Automation may prepare and
verify the draft, but only Hugh can complete this acceptance from his scoped Codex
installation. Record his name, date, decision, and any exceptions below after he
has completed the prompts.

| Owner | Decision | Date | Exceptions |
| --- | --- | --- | --- |
| Hugh McNeill | Awaiting owner action | - | - |

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

## Hermes Owner Workspace

Open Nakano Control at
`/owner/hermes?tenantId=made-with-these-hands`, then ask:

```text
Explain what needs my attention on Made With These Hands. Use the approved
tenant context and inspect the Directus and Component Factory capabilities.
Do not edit, publish, send, deploy, or approve anything.
```

Hermes acceptance passes when the response identifies Made With These Hands,
distinguishes approved content from proposed work, and explains that Codex is
the separate implementation surface. Directus and Factory should both be
available, while schema, permission, deployment, deletion, shared publication,
and external-send actions remain approval-gated.

From the Nakano repository, `npm run mwth:hermes:verify` must report
`ready-for-owner-acceptance` before this prompt is used for sign-off.

## Automated Release Gate

After completing the prompts above, run `npm run production:readiness`. The report must show `ownerEditDetected: true` and `ownerReorderDetected: true`; the page must remain `draft`, the public URL must remain unavailable, and no other tenant content may change.

The same scoped operations can be exercised automatically with `npm run owner-acceptance:run`. This proves the remote bundle and permission boundary, but Hugh should still connect from his own Codex installation before final sign-off.

The acceptance edit proves scoped read/write access, page composition, and brand-aware component selection. It does not authorize schema changes or production publication.

## Capacity Migration

The generic block proposal is Directus record `3` and local proposal `798a588a-a69c-44e9-abae-f03a164856bb`. A human platform owner must set its status to `approved` and record `approval.approved: true`.

Run `npm run directus:generic-blocks` first. After approval and a current backup, run `npm run directus:generic-blocks:apply`. The migration preserves legacy collections and records; it only creates validated generic records and repoints page junctions.

## Content And Enquiries

Run `npm run directus:content-audit` for editorial detail and `npm run production:readiness` for the release gate. Imported podcast episodes, maker biographies, object copy, photography, and SEO remain drafts until Hugh approves them.

Production requires `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`, and `ENQUIRY_TO_EMAIL`. The sender domain must be verified in Resend. Once Hugh confirms the masked recipient shown by the readiness report, run `npm run enquiries:send-test` exactly once.
