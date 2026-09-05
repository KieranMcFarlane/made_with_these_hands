# Component creation policy

When a requested page component is not already approved, use the Component Factory MCP workflow instead of adding arbitrary production code.

1. Read `component-factory://workflow`, the brand contract, and the approved registry.
2. Prefer existing shadcn components. Bespoke primitives require a documented capability gap.
3. Create and validate a proposal before touching production source or Directus schema.
4. Before requesting human approval for a new component, generate a representative visual preview of the expected component, verify that its governed preview URL renders successfully, and give the client the preview to review. A contract, raw component key, or written description alone is not sufficient approval evidence.
5. Never store executable JavaScript or renderer paths in Directus content.
6. Do not publish or deploy without a human-approved `component_proposals` record.

# Nakano MCP access

Guarded CMS and component work requires the `nakano` remote MCP connection. Use
OAuth through `https://mcp.nakanodigital.com/mcp`; never request or store the
internal Directus or Component Factory bearer credentials. If Nakano is not
connected, explain that authentication is required and continue with work that
does not require tenant tools. The server is intentionally `required = false` so
an expired grant cannot prevent the project from opening.

When Nakano tools disappear or reconnection fails, explain the distinction to
the client before asking them to act. Report the observed failure, whether the
public gateway and OAuth metadata are healthy, and whether the grant is actually
invalid. Do not describe every connection failure as an authentication problem.
If a transient MCP startup or discovery failure has been cached by the current
Codex task, explain that no content was changed, reauthentication is unnecessary,
and reopening the task forces fresh tool discovery while reusing the OAuth grant.
