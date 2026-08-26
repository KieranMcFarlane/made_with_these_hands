# ChatGPT Handover: Made With These Hands and NakanoOS

Updated: 22 August 2026
Primary application: `/home/em9/repos/made_with_these_hands`
Nakano control plane: `/home/em9/repos/nakano-rebuild`

## Read This First

Made With These Hands (MWTH) is the canonical working NakanoOS tenant on this
server. It is a governed editorial, podcast, maker, object, and enquiry system.
It is not a Vendure shop and has no checkout or payment journey.

Signal Noise and Estate Planning are separate projects that happen to be hosted
or represented on the same machine. They are not currently NakanoOS tenants,
do not use the MWTH Component Factory, and must not be presented as part of this
implementation.

Do not print or copy tokens from environment files. Do not reset either dirty
Git worktree. Do not publish, deploy, change schema or permissions, delete
content, or send external email without the relevant human approval.

## Product Model

```text
Hugh / owner
  |
  +-- Directus Studio
  |     content, relations, SEO, media, navigation, page ordering
  |
  +-- Agent Hermes
  |     owner conversation, live context, diagnosis, drafts, approvals
  |
  +-- Codex
        repository implementation, tests, Storybook, migrations, deployment

Nakano Control
  tenants, packages, entitlements, rooms, policies, approvals, audit
        |
        +-- Directus MCP
        +-- Component Factory MCP
        +-- Agent Hermes profile and governed memory

MWTH application
  approved React renderers + brand contract + Directus records
```

Hermes and Codex are different surfaces. Hermes is the tenant owner/operator
agent. Codex is the engineering and implementation environment. Hermes may use
an OpenAI Codex model/authentication provider, but that does not make the two
surfaces interchangeable.

## Public Services

| Service | Public address | Origin | State |
| --- | --- | --- | --- |
| MWTH site | `https://hands.nakanodigital.com` | Next.js on port `3009` | Healthy |
| Directus Studio | `https://cms.nakanodigital.com/admin` | Directus 12.0.2 on `8055` | Healthy |
| Directus MCP | `https://cms.nakanodigital.com/mcp` | Same Directus runtime | Healthy, bearer protected |
| Component Factory MCP | `https://factory.nakanodigital.com/mcp` | Node service on `8787` | Healthy, bearer protected |

The Factory root and `/health` currently return `404` by design; `/mcp` is the
authenticated protocol endpoint. An unauthenticated `/mcp` request returns
`401`.

The Nakano marketing site at `nakanodigital.com` is hosted on Vercel, not on
this server.

## Local Operator Services

| Service | Address | State |
| --- | --- | --- |
| Nakano Control owner console | `http://127.0.0.1:4104` | Standalone production build running locally; durable public hosting still pending |
| MWTH Hermes gateway | `http://127.0.0.1:8700` | Healthy, supervised |
| MWTH Hermes dashboard | `http://127.0.0.1:8701` | Healthy, supervised |
| MWTH Hermes workspace | `http://127.0.0.1:8702` | Healthy, supervised |
| Storybook | `http://127.0.0.1:6006` | Development proof surface |
| MWTH secondary dev app | `http://localhost:3038` | Development process |

The owner Hermes route is:

```text
http://127.0.0.1:4104/owner/hermes?tenantId=made-with-these-hands
```

Unauthenticated users are redirected to sign-in and the MWTH tenant query is
preserved in the callback URL.

## Nakano Service Catalogue

NakanoOS has a broader service library than the subset currently activated for
MWTH. Treat package availability, installation on this server, and tenant
activation as three different facts.

| Capability | Purpose | Server state | MWTH state |
| --- | --- | --- | --- |
| Nakano Control | Tenant packages, rooms, permissions, approvals, audit, onboarding, and health | Standalone build, Control database, real health probes, audit, recovery evidence, and Create Tenant journey are running locally | Active control-plane registration |
| Agent Hermes | Owner-facing AI operator with tenant profile, tools, memory, and supervised actions | Dedicated MWTH gateway/dashboard/workspace healthy on `8700-8702` | Active |
| Honcho memory | Tenant-scoped durable memory for Hermes | MWTH memory profile reports ready | Active through Hermes |
| Directus 12 | Structured CMS, page composition, media, relations, SEO, comments, and enquiries | Healthy on `8055`, publicly routed through Cloudflare | Active and dedicated to MWTH |
| Directus MCP | Governed content operations for agents | Healthy, bearer protected, 7 tools verified | Active |
| Component Factory MCP | Brand-aware component proposals, validation, preview, and releases | Healthy on `8787`, bearer protected, 12 tools verified | Active and tenant-isolated |
| Storybook | Component proof, states, accessibility, and page-sequence review | Local development service on `6006` | Active proof surface |
| shadcn registry | Distribution of approved MWTH components and setup kits | Hosted from the MWTH application | Active |
| Resend | Owner notifications and approved email delivery | Integration code exists; production credentials are absent | Enquiry storage active, notification delivery pending |
| Twenty CRM | Contacts, leads, pipeline, outcomes, and CRM handoff | Repository/service definitions installed; public `crm.nakanodigital.com` origin is paused and returns `502` | Not activated |
| Cal.diy / Cal.com-compatible booking | Availability, booking links, event types, and booking webhooks | Repository/service definitions installed; public `cal.nakanodigital.com` origin is paused and returns `502` | Not activated |
| Postiz | Social drafting, scheduling, calendars, and publishing connectors | Installed service stack is paused; `social.nakanodigital.com` returns `502` | Not activated |
| Zero Mail | Tenant email workspace and OAuth-backed inbox operations | Repository and service unit exist but are paused | Not activated |
| Content Engine | Draft generation, campaign assets, branded video, and social handoff | Nakano module contracts exist; dependent services are not active for MWTH | Available package capability, not activated |
| Remotion / Hyperframes | Programmatic branded video preview and rendering | Represented in content-engine workflow contracts | Not activated |
| Higgsfield / image-video generation | Generated campaign imagery and video | Credential-gated integration in Nakano content workflows | Not activated |
| Paperclip governance | Goals, agent roles, budgets, approvals, and action routing | Nakano module contract exists | Not activated for MWTH |
| Backups | Database dumps, uploads, configuration inventory, encrypted restic/R2 backup, and restore evidence | Fresh R2/restic snapshot, retention run, restore drill, and ready MWTH Directus recovery point verified on 25 August 2026 | Active platform operation |
| Vendure | Optional commerce, catalogue, checkout, and payment foundation | Installed only as a gated historical/optional capability | Explicitly disabled; MWTH uses enquiries instead |

The intended wider Nakano package loop is:

```text
visitor or owner event
  -> Directus / form / inbox
  -> Twenty CRM contact and pipeline
  -> Hermes diagnosis or draft
  -> Nakano Control approval
  -> Resend / Cal.diy / Postiz / content executor
  -> audit event and outcome
```

That loop describes the service architecture available to NakanoOS. It must not
be described as fully live for MWTH until each module is explicitly entitled,
credentialled, provisioned, health-checked, and accepted by the owner.

### Service Activation Standard

A Nakano service counts as active for a tenant only when all relevant evidence
exists:

1. the module is present in the canonical tenant contract;
2. Nakano Control records an entitlement for that tenant;
3. the service has an isolated tenant identity or dedicated runtime;
4. credentials are supplied through the approved secret path;
5. health and permission probes pass;
6. risky actions route through approvals and audit;
7. owner acceptance is recorded.

Code, a Docker image, a systemd unit, an old hostname, a seed record, or an MCP
definition alone does not make a service active.

## Server Boundary

The active Cloudflare tunnel also contains old routes for CRM, Cal.diy, Postiz,
older admin surfaces, Fractional Delivery, and estate services. Most currently
return `502` because their origins are paused. Their presence in the tunnel
configuration does not make them active MWTH or NakanoOS capabilities.

The global marker below intentionally pauses the wider historical Nakano
estate:

```text
/home/em9/ops/watchdog/nakano-services.paused
```

MWTH has a separate production service condition and remains independently
operable.

Explicitly outside this handover:

- Signal Noise / Yellow Panther;
- Estate Planning / Pathway;
- Fractional Delivery;
- the discontinued Vendure/Stripe MWTH shop;
- paused CRM, booking, social, and email workspace services.

## Site Structure

```text
Home
├── Makers
│   └── Maker / guest biography
│       ├── related podcast episodes
│       └── related objects
├── Objects
│   └── Object detail
│       └── personal enquiry, not checkout
├── Podcast
│   └── Episode
│       ├── audio player
│       ├── transcript
│       ├── guest biography
│       ├── related objects
│       └── moderated comments
├── Journal
│   └── Article
├── About / Hugh biography
├── Contact
├── Brand book
└── Owner dashboard
```

The canonical journal route is `/journal`, not `/blog`.

## Current Content State

The automated production-readiness report currently passes as a technical gate
and reports the owner-acceptance page as ready for sign-off. Editorial records
still require substantial human completion:

- 41 maker records: 5 published and 36 drafts;
- 41 podcast records: 5 demo records and 36 RSS-imported drafts;
- all 36 imported podcast episodes are missing transcripts;
- 7 objects are published and enquiry-enabled but still need final copy,
  photography, and SEO;
- 2 journal posts are published but need final images and SEO;
- imported guest biographies generally need portraits and owner review;
- the tenant profile is complete apart from an optional phone number.

Hugh must approve real biographies, guest matching, craft categories, object
availability and pricing, photography, transcripts, enquiry wording, and SEO.

## Enquiries

Objects use a personal enquiry workflow instead of commerce:

```text
visitor selects object
  -> enquiry saved in Directus
  -> optional Resend notification to Hugh
  -> Hugh follows up personally
```

The storage path exists, but production email is not active. These environment
values still require real configuration:

```text
RESEND_API_KEY
ENQUIRY_FROM_EMAIL
ENQUIRY_TO_EMAIL
```

The sender domain must be verified before running the one-time send test.

## Directus

Directus is the structured source of truth for:

- pages and ordered approved blocks;
- makers and guest biographies;
- objects and enquiry settings;
- podcast episodes, audio, transcripts, guests, and related objects;
- journal posts;
- comments and moderation;
- navigation, media, SEO, and brand settings;
- component proposals and approval evidence.

The Directus database is dedicated to MWTH. Directus Core does not provide the
required row-level tenant boundary for safely mixing another client into this
database. A second client requires a separate Directus database/instance or an
appropriate licensed permission model.

Never store executable JavaScript, renderer import paths, arbitrary CSS,
package installation commands, or secrets in Directus records.

## Component System

The component system contains:

- a machine-readable brand contract;
- a living `/brand` page;
- approved React block renderers;
- Directus-shaped Storybook stories and edge states;
- a shadcn registry for distributing approved implementation;
- a tenant-isolated Component Factory MCP;
- proposal, validation, preview, release, approval, and publication states.

Component policy:

1. Inspect the existing registry first.
2. Read the Factory workflow and MWTH brand contract.
3. Prefer an existing approved component or shadcn primitive.
4. Create a proposal before changing production code for an unapproved type.
5. Add Storybook states and tests.
6. Keep the proposal in draft until validation passes.
7. Require human approval for platform-risk work or shared publication.

Tenant-safe proposals may be prepared without repeatedly asking permission.
Schema changes, permissions, secrets, unknown packages, executable CMS content,
shared registry publication, deployment, and destructive changes remain gated.

## Agent Hermes

The tracked MWTH profile template is in:

```text
/home/em9/repos/nakano-rebuild/blueprints/commerce/mwth/hermes-profile
```

Activation installs an isolated runtime profile, seeds its private auth store
from the current Codex session, registers the tenant under `ai_ops_starter`, and
provisions supervised runtime surfaces. Its MCP configuration references bearer
tokens by environment-variable name; token values are not stored in source.

Verified capabilities:

- Directus MCP: 7 tools;
- Component Factory MCP: 12 tools;
- Honcho tenant memory: ready;
- live Agent Hermes inference: identifies Made With These Hands correctly;
- Hermes explains that repository work moves to Codex.

## Permissions

Allowed within the tenant boundary:

- read and update tenant-owned content;
- create and reorder pages using approved blocks;
- update navigation and SEO;
- moderate comments;
- record enquiries and notify the owner;
- inspect the brand and approved registry;
- propose, validate, and preview tenant components;
- prepare approval records and tenant release manifests.

Human approval remains required for:

- deletion;
- schema, permission, role, or secret changes;
- unknown third-party packages;
- renderer changes;
- shared component publication;
- production deployment;
- external email or social sending.

The restricted Directus identity has passed tenant-read proof and delete denial.

## Known Operational Issues

1. Resend production credentials and the verified Hugh recipient are missing.
2. Published content remains incomplete: five maker biographies, seven objects,
   and two journal records are visibly blocked in Control until approved fields
   and photography are supplied.
3. Nakano Control runs from its standalone production build locally, but still
   needs durable supervised hosting and an HTTPS owner route.
4. Several databases and development listeners bind on all interfaces. Review
   host firewall rules and bind addresses before treating the machine as a
   hardened multi-client platform.
5. Both primary repositories have substantial intentional uncommitted work.
   Never reset or overwrite it.

## Verification Commands

MWTH application:

```bash
cd /home/em9/repos/made_with_these_hands
npm run client-access:verify
npm run directus:content-audit
npm run production:readiness
npm run components:validate
npm run components:test
npm run storybook:verify
```

Hermes and Nakano Control:

```bash
cd /home/em9/repos/nakano-rebuild
npm run validate:manifests
npm run mwth:hermes:activate
npm run mwth:hermes:verify
```

Do not run `npm run enquiries:send-test` until Hugh confirms the recipient and
the Resend sender has been verified.

## Recommended Next Order

1. Back up and commit the current demo branches without mixing unrelated dirty
   changes.
2. Configure and verify Resend, then run exactly one enquiry test.
3. Complete the five published maker records and seven published object records
   first, because incomplete published records are a greater risk than drafts.
4. Review and enrich the 36 imported podcast and guest drafts in batches.
5. Complete journal imagery and SEO.
6. Run the full component, Storybook, MCP, browser, and production-readiness
   suite.
7. Record Hugh's owner acceptance in Codex and Hermes.
8. Use the six-stage New Client journey for a genuinely different paid pilot,
   following `/home/em9/repos/nakano-rebuild/docs/SECOND_TENANT_PILOT.md`.
9. Only then package the production release and client walkthrough.

## Continuation Prompt for ChatGPT

```text
You are continuing the Made With These Hands NakanoOS implementation on the
same server. Read handover/CHATGPT_HANDOVER_2026-08-22.md, the repository
AGENTS.md, handover/client/OWNER_ACCEPTANCE.md, and the canonical Nakano tenant
manifest before proposing changes.

Treat MWTH as the only canonical integrated tenant in this scope. Signal Noise
and Estate Planning are separate server projects and are not part of this
NakanoOS/Component Factory implementation.

Preserve both dirty worktrees. Do not expose credentials. Use the Directus and
Component Factory MCP guardrails. Do not publish, deploy, delete, change schema
or permissions, or send external email without the required human approval.

Start by running the non-mutating readiness checks, report the exact current
state, and continue with the first unresolved item in the Recommended Next
Order. Keep owner-facing content in draft unless Hugh explicitly approves it.
```
