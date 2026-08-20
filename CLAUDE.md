# Component creation policy

When a requested page component is not already approved, use the Component Factory MCP workflow instead of adding arbitrary production code.

1. Read `component-factory://workflow`, the brand contract, and the approved registry.
2. Prefer existing shadcn components. Bespoke primitives require a documented capability gap.
3. Create and validate a proposal before touching production source or Directus schema.
4. Never store executable JavaScript or renderer paths in Directus content.
5. Do not publish or deploy without a human-approved `component_proposals` record.
