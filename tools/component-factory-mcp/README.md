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
- validation commands are fixed by the server;
- validation checks repository schemas, the live Directus schema/registry, unit behaviour, dependency advisories, the production build, and every published route;
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
check_component_guardrails
start_component_proposal
scaffold_component
validate_component
create_preview
prepare_tenant_release OR prepare_component_release
human approval in Directus when platform risk is present
publish_approved_component
```

The same complete gate can be run outside an MCP client:

```bash
npm run components:verify
```

`validate_component` runs that gate as individually reported steps. Any failure returns the proposal to `testing`; a successful run moves it to `awaiting_approval`.

## Guardrail Model

Tenant mode is the default. A tenant can use trusted components and trusted
open-source packages, such as `media-chrome`, when the request stores only safe
data in Directus and passes validation.

Platform review is still required for unknown packages, executable JavaScript,
renderer paths in CMS content, unsafe embeds, secrets, admin roles, destructive
schema changes, and shared component-registry publication.
