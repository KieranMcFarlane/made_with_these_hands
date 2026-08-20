# Directus and Component Factory Client Handover

## Purpose

This document explains how the current site became a client-composable Directus
system, what must be adapted for another website, and how to install the two MCP
connections for each client.

The system has two distinct MCP services:

| Service | Responsibility |
| --- | --- |
| Directus MCP | Edit content, compose pages, select approved variants, reorder blocks, upload media, and publish records |
| Component Factory MCP | Govern requests for component types or behaviours that do not yet exist |

The client does not need the private frontend repository. They receive access to
their Directus project and their isolated Component Factory endpoint. The source
owner retains the frontend implementation, Factory deployment, validation gate,
and production release pipeline.

## Does Every Existing Site Need Converting?

Not all at once.

Every site needs an initial integration and mapping exercise because its routes,
data collections, visual rules, and existing components are different. After
that, migration can be progressive:

| Existing site area | Required treatment |
| --- | --- |
| Pages the client must freely compose | Move to `site_pages` and the approved Builder block model |
| Existing structured detail routes | Keep the structured template and add controlled Builder slots |
| Stable legacy routes the client does not need to rearrange | Leave in place until there is a reason to migrate |
| Existing reusable visual components | Index them in the component inventory and expose safe fields or variants |
| One-off layout fragments | Map them to compositions of approved blocks where possible |
| New interaction or behaviour | Send it through the Component Factory proposal workflow |

The target is therefore not a wholesale rewrite. It is a compatibility layer:
Directus owns structured content and composition, while the frontend retains
safe rendering and behaviour.

## Current Made With These Hands Baseline

The current implementation provides:

- a tenant-aware `site_pages` collection;
- an ordered Directus v12 Builder field at `site_pages.blocks`;
- seven approved block collections: Hero, Text, Media, Quote, Listing, Call to
  action, and Slideshow;
- controlled layout variants rather than arbitrary CSS;
- `main`, `before-content`, `after-content`, and `related-content` slots;
- hybrid product, maker, episode, and article templates;
- a catch-all renderer for published `site_pages` paths;
- a Brand Book at `/brand` that indexes the available component vocabulary;
- `brand_settings` containing identity, palette, typography, imagery, and the
  machine-readable component contract;
- a versioned component manifest and Directus `component_registry`;
- approval records in `component_proposals`;
- validation of schemas, live Directus configuration, behaviour, dependencies,
  production build, and published routes;
- a private single-client Component Factory MCP deployment.

The authoritative implementation references are:

- `component-system/components.mjs`
- `component-system/schemas/brand-contract.schema.json`
- `lib/brand-settings.mjs`
- `DIRECTUS_COMPONENTS.md`
- `COMPONENT_INVENTORY.md`
- `tools/component-factory-mcp/README.md`
- `deploy/component-factory/README.md`

## Architecture and Responsibility Boundary

```text
Client using Codex or Claude
        |
        +-- Directus MCP ----------------> Client Directus project
        |                                  content, pages, media, ordering
        |
        +-- isolated Factory MCP --------> Private Factory deployment
                                           proposal, validation, preview,
                                           approval-gated release record
                                                        |
                                                        v
                                             Private source and CI release
                                                        |
                                                        v
                                                 Client website
```

Directus stores declarative data only. It must never store executable
JavaScript, arbitrary renderer paths, source patches, or unrestricted CSS.

## Per-Client Onboarding Runbook

### 1. Discovery and Inventory

Record the existing site before changing its content model:

1. List every public route and route family.
2. List global chrome such as navigation, footer, search, consent, and display
   controls.
3. List structured entities such as products, people, articles, events, or
   episodes.
4. List visual sections, cards, forms, galleries, and interactive modules.
5. Record the data source and renderer currently used by each item.
6. Classify each item as:
   - Builder block;
   - structured template;
   - listing or card;
   - interactive module;
   - site chrome;
   - implementation primitive.
7. Mark which routes the client needs to compose or rearrange.
8. Identify duplicate layouts that can become variants of one component.

Create a project-specific component inventory equivalent to
`COMPONENT_INVENTORY.md`. Do not assume the Made With These Hands inventory fits
another client.

### 2. Define the Brand and Component Contract

Capture the rules the agent and renderer must enforce:

- palette and semantic colour roles;
- typography scale and font roles;
- spacing and container rules;
- approved image ratios;
- motion and reduced-motion rules;
- focus, contrast, heading, and alternative-text requirements;
- preferred component source, currently shadcn first;
- approved variants and nesting rules;
- field limits such as actions, slides, cards, and body items.

Store the client-specific records in `brand_settings` and validate the assembled
contract against the JSON schema. Version the contract whenever a breaking rule
changes.

### 3. Design the Directus Content Model

Use the following base model, adapting structured collections to the client:

```text
tenants
site_pages
site_pages_blocks
brand_settings
component_registry
component_proposals
navigation_items
block_*
client-specific structured collections
```

`site_pages.blocks` should be a Builder / Many-to-Any field. Its allowlist must
contain only approved block collections. The junction table carries ordering and
the controlled template slot.

Keep three concerns separate:

- page metadata belongs to `site_pages`;
- structured editorial records belong to their domain collections;
- flexible visual sections belong to typed `block_*` collections.

Create and test the model in staging first. Back up the Directus database and
file storage before schema or migration work.

The current bootstrap script is project-specific. For a new client, copy its
idempotent pattern but replace tenant names, domain collections, page types,
block fields, and migration seeds. Do not run the Made With These Hands seed
unchanged against another project.

### 4. Add the Frontend Rendering Contract

This is the one-time source integration required for an existing website:

1. Add a page lookup by tenant, canonical path, and published status.
2. Hydrate the Builder M2A relation and preserve its stored order.
3. Add an explicit collection-to-renderer map.
4. Normalize missing variants and slots to safe defaults.
5. Apply brand tokens through CSS variables or the site's equivalent theme
   layer.
6. Add safe image, link, heading, and rich-content handling.
7. Add a generic published-page route or integrate Builder output into the
   existing router.
8. Add controlled slots to structured detail templates that need optional
   sections.
9. Ensure drafts and unapproved component collections cannot render publicly.
10. Build a Brand Book or catalogue view from the same approved registry.

Do not let Directus choose arbitrary import paths. The renderer map remains
private source code.

### 5. Migrate Content Progressively

Use a route-by-route migration:

1. Create the `site_pages` record in draft.
2. Recreate the existing page using approved blocks.
3. For detail routes, create the matching page record and place only optional
   supporting sections in slots.
4. Compare the new output with the existing route.
5. Check mobile layout, accessibility, metadata, links, media, and forms.
6. Publish the new record only after acceptance.
7. Retain a rollback path until the route is proven.

Legacy content may coexist with Builder content. A missing `site_pages` record
should continue to use the known legacy path until its migration is scheduled.

### 6. Create Separate Directus Identities

Do not reuse an administrator token.

| Identity | Used by | Typical access |
| --- | --- | --- |
| Site runtime | Public frontend | Read published content and files only |
| Directus MCP user | Client's Codex or Claude | Tenant-scoped read/create/update; no delete |
| Factory service user | Private Factory deployment | Brand/registry read and proposal workflow access |
| Human approver | Directus application | Review and approve proposals |

For the Directus MCP policy:

- keep admin access disabled;
- keep Directus MCP “Allow Deletes” disabled;
- remove delete permissions at the policy level as a second safeguard;
- restrict records by tenant where the installation is shared;
- limit writable fields on junctions and proposals;
- prevent an agent from granting its own proposal approval.

The Made With These Hands `scripts/create-directus-mcp-user.mjs` is a reference,
but its email, tenant filter, collections, and fields must be adapted for every
client.

### 7. Connect the Client to Directus MCP

Enable MCP in the client's Directus project:

```text
Settings > AI > Model Context Protocol
```

Use the project's HTTPS MCP URL:

```text
https://cms.client.example/mcp
```

Prefer the authentication flow supported by Directus and the client. If a static
token is used, store it in the client secret manager or environment:

```text
DIRECTUS_MCP_TOKEN=secret-value
```

Example MCP connection shape:

```json
{
  "mcpServers": {
    "directus": {
      "url": "https://cms.client.example/mcp",
      "headers": {
        "Authorization": "Bearer ${DIRECTUS_MCP_TOKEN}"
      }
    }
  }
}
```

Test read, create, update, file upload, Builder ordering, and the expected denial
of delete and administration actions.

### 8. Deploy One Component Factory per Client

Each deployment needs its own:

- client ID;
- hostname and TLS certificate;
- Factory bearer token;
- tenant-scoped Directus service credential;
- proposal storage;
- logs and audit trail;
- preview/site URL;
- deployment identity and shutdown procedure.

Required server configuration:

```text
COMPONENT_FACTORY_CLIENT_ID
COMPONENT_FACTORY_HOST
COMPONENT_FACTORY_PORT
COMPONENT_FACTORY_ALLOWED_HOSTS
COMPONENT_FACTORY_ALLOWED_ORIGINS
COMPONENT_FACTORY_BEARER_TOKEN_SHA256
COMPONENT_FACTORY_RATE_LIMIT_PER_MINUTE
DIRECTUS_URL
DIRECTUS_COMPONENT_FACTORY_TOKEN
COMPONENT_FACTORY_SITE_URL
```

Store only the bearer token hash in the server environment. Give the plaintext
Factory bearer token to the client through a secret manager. Never give the
client the Factory's Directus service credential.

For a private local proof:

```bash
npm run component-factory:provision-local
systemctl --user link "$PWD/deploy/component-factory/mwth-component-factory.service"
systemctl --user enable --now mwth-component-factory.service
npm run component-factory:verify-local
```

Those local files are specifically configured for Made With These Hands. Before
using them for another client, change the client ID, paths, ports, URLs, and
service name.

For a remotely accessible client deployment:

1. Create the client-specific `.env.client` from
   `tools/component-factory-mcp/.env.client.example`.
2. Build and start the isolated service:

   ```bash
   docker compose -f deploy/component-factory/docker-compose.client.yml up -d --build
   ```

3. Put it behind an HTTPS reverse proxy.
4. Allow only the exact public hostname and required origins.
5. Keep the service container, source checkout, volume, and CI credentials
   inaccessible to the client.
6. Verify `/healthz`, unauthenticated rejection, authenticated MCP discovery,
   client identity, and a Directus-backed brand-contract read.

Arcade or another MCP gateway is not required for the first controlled
deployments. Add a gateway later only if centralized OAuth, billing, discovery,
policy enforcement, or multi-tenant operations justify the extra layer.

### 9. Connect Codex or Claude to the Factory

Store the client-facing Factory token in the client's environment:

```text
CLIENT_COMPONENT_FACTORY_TOKEN=secret-value
```

Codex connection:

```toml
[mcp_servers.component_factory]
url = "https://factory-client.example/mcp"
bearer_token_env_var = "CLIENT_COMPONENT_FACTORY_TOKEN"
required = true
enabled_tools = [
  "get_workflow_context",
  "read_brand_contract",
  "list_components",
  "get_guardrail_policy",
  "check_component_guardrails",
  "start_component_proposal",
  "scaffold_component",
  "validate_component",
  "create_preview",
  "prepare_tenant_release",
  "prepare_component_release",
  "publish_approved_component",
]
default_tools_approval_mode = "writes"
```

Give the client's coding agent a project instruction equivalent to:

```text
Use Directus MCP for content and composition.
Read the component registry before proposing UI.
Use an approved component or variant where possible.
When a capability is missing, use the Component Factory workflow.
Prefer shadcn components.
Use trusted open-source packages when the guardrail policy allows them.
Document a capability gap before using bespoke or non-shadcn behaviour.
Never store executable code or renderer paths in Directus.
Tenant-safe releases do not need human approval when guardrails pass.
Platform-risk releases require a human-approved proposal.
Verify the affected public route after every change.
```

### 10. Acceptance Test

Before handover, prove the complete story:

- Directus MCP can list only the intended collections;
- the client can create a draft page;
- approved blocks can be added and reordered;
- controlled variants and slots render correctly;
- files can be uploaded and assigned with alternative text;
- a page can be published and reached at its URL;
- site runtime access cannot read drafts;
- Directus MCP cannot delete or administer the project;
- Factory requests without a token return `401`;
- Factory reports the correct client ID and `single-client` isolation;
- Factory can read the client's live brand contract and approved registry;
- a tenant-safe proposal can reach `ready_for_tenant_install` without human approval;
- a platform-risk proposal can reach `awaiting_approval`;
- the agent cannot approve its own proposal;
- an approved proposal passes the complete verification gate;
- production deployment remains a separate authorized action;
- logs contain no plaintext tokens.

For this repository the complete implementation gate is:

```bash
npm run components:verify
```

## Client Operating Workflow

The client should use the following decision:

```text
Is this a content or ordering change?
  yes -> Directus MCP
  no
    Does an approved component/variant already provide it?
      yes -> Directus MCP using that approved option
      no  -> Component Factory MCP guardrail check
              Is it tenant-safe?
                yes -> scaffold -> validation and preview
                     -> prepare_tenant_release
                     -> private tenant install/deployment
                     -> component becomes reusable for the tenant
                no  -> platform proposal
                     -> validation and preview
                     -> human approval in Directus
                     -> release preparation
                     -> private CI/source deployment
                     -> component becomes reusable in Directus
```

Once a component is tenant-installed or platform-approved, implemented,
registered, and released, the client can reuse it across pages without another
code change.

## Ownership After Handover

| Client controls | Source owner controls | Joint decision |
| --- | --- | --- |
| Content and media | Private source repository | Brand contract changes |
| Page creation and ordering | Renderer allowlist | New component approval |
| Approved variants and slots | Factory infrastructure | Breaking schema changes |
| Proposal requests | Validation and release pipeline | Production rollout timing |
| Human approval account | Credential rotation mechanism | Component retirement |

Under the current design, a client can request and reuse extensions without
receiving source access. A genuinely new production component still passes
through the source owner's automated pipeline after human approval. Removing
that final owner-controlled release would require a deliberately designed
autonomous CI deployment policy, not broader Directus permissions.

## Operations and Offboarding

Maintain for each client:

- Directus database and file backups;
- Factory service health and logs;
- token issue and rotation dates;
- proposal and approval history;
- component contract and registry versions;
- preview and production release records;
- an incident and rollback procedure.

To disconnect a client:

1. Disable their Factory service.
2. Revoke the Factory bearer token.
3. Revoke or disable their Directus MCP identity.
4. Revoke the Factory Directus service identity.
5. Preserve proposal and audit records according to the contract.
6. Remove DNS, TLS, preview, and monitoring configuration.
7. Confirm that the public site continues using its read-only runtime identity.

## Reusable Work Versus Client-Specific Work

Reusable without redesign:

- Factory MCP protocol and authentication;
- proposal statuses and approval gate;
- validation pattern;
- shadcn-first sourcing policy;
- safe Directus/renderer separation;
- per-client deployment model;
- agent instruction template;
- acceptance and offboarding checklists.

Client-specific every time:

- component and route inventory;
- brand contract and tokens;
- structured Directus collections;
- Builder block vocabulary and fields;
- frontend renderer integration;
- legacy content migration;
- tenant policy and writable fields;
- URLs, credentials, deployment names, and monitoring;
- final acceptance criteria.

This is the repeatable product: a common governed control plane with a
site-specific adapter and migration, not one universal schema imposed on every
website.
