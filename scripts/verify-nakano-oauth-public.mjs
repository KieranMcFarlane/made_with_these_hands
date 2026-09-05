#!/usr/bin/env node

const gatewayUrl = process.env.NAKANO_MCP_URL || 'https://mcp.nakanodigital.com/mcp';
const issuerUrl = process.env.NAKANO_IDENTITY_ISSUER || 'https://id.nakanodigital.com';
const requiredScopes = ['cms:archive', 'cms:restore'];

async function readJson(url, label) {
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  } catch (error) {
    throw new Error(`${label} is unreachable at ${url}: ${error.cause?.code || error.message}`);
  }

  if (!response.ok) throw new Error(`${label} returned HTTP ${response.status} at ${url}.`);
  return response.json();
}

const resourceMetadataUrl = new URL('/.well-known/oauth-protected-resource/mcp', gatewayUrl);
const issuerMetadataUrl = new URL('/.well-known/oauth-authorization-server', issuerUrl);

const [resource, issuer] = await Promise.all([
  readJson(resourceMetadataUrl, 'Nakano MCP protected-resource metadata'),
  readJson(issuerMetadataUrl, 'Nakano OAuth authorization-server metadata'),
]);

if (resource.resource !== gatewayUrl) {
  throw new Error(`Protected-resource metadata identifies ${resource.resource || 'no resource'}, expected ${gatewayUrl}.`);
}
if (!resource.authorization_servers?.includes(issuerUrl)) {
  throw new Error(`Protected-resource metadata does not identify ${issuerUrl} as its authorization server.`);
}
if (issuer.issuer !== issuerUrl) {
  throw new Error(`Authorization-server metadata identifies ${issuer.issuer || 'no issuer'}, expected ${issuerUrl}.`);
}

for (const scope of requiredScopes) {
  if (!resource.scopes_supported?.includes(scope)) {
    throw new Error(`Protected-resource metadata is missing required scope ${scope}.`);
  }
  if (!issuer.scopes_supported?.includes(scope)) {
    throw new Error(`Authorization-server metadata is missing required scope ${scope}.`);
  }
}

console.log(JSON.stringify({
  ok: true,
  gateway: gatewayUrl,
  issuer: issuerUrl,
  scopes: requiredScopes,
  client_ready_for_oauth: true,
}, null, 2));
