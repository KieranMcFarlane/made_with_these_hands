# Component Factory MCP

This MCP server gives Claude, Codex, and other MCP clients the same governed
component-creation workflow. It supports local stdio operation and an
authenticated Streamable HTTP deployment for one isolated client.

It is deliberately narrower than general filesystem access, but it is not meant
to make tenant owners ask permission for normal site work:

- tenant-safe component work is permissionless after a passing guardrail check;
- proposals are written only beneath `component-system/proposals`;
- shadcn primitives are preferred and checked against an allowlist;
- trusted open-source packages can be used for documented capability gaps;
- no CMS field can contain executable frontend code;
- presentation fields use closed semantic choices; raw CSS and numeric spacing are rejected;
- every approved component carries `compact`, `standard`, and `generous` Storybook states;
- validation commands are fixed by the server;
- validation checks repository schemas, the live Directus schema/registry, unit behaviour, Storybook and accessibility states, dependency advisories, the production build, and every published route;
- tenant releases do not require human approval when guardrails pass;
- platform releases require a human-approved Directus proposal;
- deployment remains a separate CI/release action.

## Start

Local stdio:

```bash
npm run component-factory:mcp
```

Remote Streamable HTTP:

```bash
npm run component-factory:remote
```

Optional environment:

```text
DIRECTUS_URL
DIRECTUS_COMPONENT_FACTORY_TOKEN
COMPONENT_FACTORY_SITE_URL
```

Use a dedicated non-admin Directus token. Do not use `DIRECTUS_ADMIN_TOKEN`.

Remote mode additionally requires:

```text
COMPONENT_FACTORY_CLIENT_ID
COMPONENT_FACTORY_ALLOWED_HOSTS
COMPONENT_FACTORY_BEARER_TOKEN_SHA256
COMPONENT_FACTORY_RATE_LIMIT_PER_MINUTE
```

See [`deploy/component-factory/README.md`](../../deploy/component-factory/README.md)
for the isolated per-client container, authentication, and Codex configuration.

## Workflow

```text
get_workflow_context
read_brand_contract
list_components
get_guardrail_policy
resolve_semantic_intent
check_component_guardrails
start_component_proposal
scaffold_component
start_component_validation
get_component_validation until complete
get_proposal_context
record_proposal_decision
create_preview
prepare_tenant_release OR prepare_component_release
human approval in Directus when platform risk is present
publish_approved_component
```

The same complete gate can be run outside an MCP client:

```bash
npm run components:verify
```

`start_component_validation` returns immediately with a durable job id. Poll
`get_component_validation` with that job id until it reports `completed`,
`failed`, or `interrupted`. This keeps a complete validation run independent of
the MCP request timeout. Jobs survive as records under the proposal; a job that
was running when the Factory process restarted is marked `interrupted` and can
be started again. The legacy synchronous `validate_component` tool remains for
older clients.

Validation reports eight named gates: contract, live contract, behaviour,
the concrete proposal artifact, Storybook/accessibility, dependencies,
production build, and route smoke. Any
gate failure keeps the proposal in `testing`; only a complete proof set moves it
to `awaiting_approval`.

## Semantic intent and safe retries

`resolve_semantic_intent` separates requested capabilities from explicit
prohibitions before guardrail evaluation. Phrases such as “no scripts” and
“without audio playback” therefore reduce risk instead of triggering a false
platform classification. The envelope also records the active target,
draft/publish/deploy intent, presentation decisions, and confidence.

Proposal mutations accept dry-run inputs and return field-level semantic diffs.
Creation and decision-recording tools accept idempotency keys so a retried
conversation cannot create duplicate work. `get_proposal_context` returns the
human-readable label, durable decision ledger, preview state, allowed next
actions, and actions blocked by validation, approval, or lifecycle intent.

Preview creation has three distinct facts: URL assigned, artifact verified,
and HTTP reachable. `create_preview` checks all three and never reports an
unreachable or “proposal not found” page as a successful preview. It remains a
verification operation and does not deploy the site.

For every new component, the reachable preview is the client-facing visual
expectation. Codex must show that preview to the client and collect review
feedback before requesting human approval. A component contract, raw key, or
written description alone is not approval evidence. Release preparation and
publication reject proposals that do not contain verified visual preview proof.

Directus composition fields expose semantic decisions such as:

```text
spacing: compact | standard | generous
surface: paper | muted | ink
tone: editorial | feature | restrained
contrast: standard | high
image_focus: center | top
```

The semantic resolver translates phrases such as “make it darker,” “give it
more breathing room,” and “keep faces visible” into these closed values. The
renderer resolves them through the brand palette, type hierarchy, crop rules,
and versioned 4px scale. Raw colours, padding, margin, gap, class names, and CSS
remain outside CMS content.

## Client connection explanations

Do not treat every missing Nakano tool as expired authentication. Tell the
client which layer failed: OAuth grant, public gateway, OAuth metadata, tool
discovery, or the current Codex task's cached MCP startup. Confirm whether any
content changed and whether reauthentication is actually required. When the
grant and metadata remain healthy but the task cached a transient startup error,
the recovery instruction is to reopen the task so it performs fresh discovery
and reuses the existing OAuth grant.

## Guardrail Model

Tenant mode is the default. A tenant can use trusted components and trusted
open-source packages, such as `media-chrome`, when the request stores only safe
data in Directus and passes validation.

Platform review is still required for unknown packages, executable JavaScript,
renderer paths in CMS content, unsafe embeds, secrets, admin roles, destructive
schema changes, and shared component-registry publication.
