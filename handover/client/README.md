# Hugh's Codex Project Bundle

This directory is the project-scoped Codex handover for Made With These Hands.
It contains no credentials.

1. Put `config.toml` at `.codex/config.toml` in Hugh's trusted project.
2. Put `AGENTS.md` at the project root.
3. Provide `DIRECTUS_MCP_TOKEN` and `CLIENT_COMPONENT_FACTORY_TOKEN` through the
   client machine's environment or secret store.
4. Restart Codex and use `/mcp` to confirm both required servers are connected.
5. Run the prompts in `OWNER_ACCEPTANCE.md` in order.

The hosted CMS is Directus 12.0.2 with native MCP. Its database is dedicated to
Made With These Hands. Hugh receives a restricted content identity, never the
server administrator credential.

The remote MCP syntax follows the official Codex Streamable HTTP configuration:
`bearer_token_env_var` names the local environment variable whose value becomes
the bearer credential. Token values never belong in TOML or this repository.
