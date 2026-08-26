import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {
  createComponentFactoryHttpApp,
  parseRemoteConfig,
} from '../../tools/component-factory-mcp/remote.mjs';

test('remote component factory requires authentication and preserves client isolation context', async () => {
  const token = 'test-component-factory-token-that-is-long-enough';
  const config = parseRemoteConfig({
    COMPONENT_FACTORY_CLIENT_ID: 'kilkenny-client',
    COMPONENT_FACTORY_HOST: '127.0.0.1',
    COMPONENT_FACTORY_PORT: '8787',
    COMPONENT_FACTORY_ALLOWED_HOSTS: '127.0.0.1',
    COMPONENT_FACTORY_BEARER_TOKEN: token,
    COMPONENT_FACTORY_RATE_LIMIT_PER_MINUTE: '120',
    DIRECTUS_URL: 'http://127.0.0.1:8055',
    DIRECTUS_COMPONENT_FACTORY_TOKEN: 'test-directus-token',
    COMPONENT_FACTORY_SITE_URL: 'http://localhost:3000',
  });
  const app = createComponentFactoryHttpApp(config);
  const httpServer = http.createServer(app);
  await new Promise((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
  const address = httpServer.address();
  const endpoint = new URL(`http://127.0.0.1:${address.port}/mcp`);

  try {
    const unauthenticated = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-11-25',
          capabilities: {},
          clientInfo: { name: 'unauthenticated-test', version: '1.0.0' },
        },
      }),
    });
    assert.equal(unauthenticated.status, 401);
    assert.match(unauthenticated.headers.get('www-authenticate'), /^Bearer /);

    const rejectedOrigin = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Origin: 'https://untrusted.example',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'initialize',
        params: {
          protocolVersion: '2025-11-25',
          capabilities: {},
          clientInfo: { name: 'origin-test', version: '1.0.0' },
        },
      }),
    });
    assert.equal(rejectedOrigin.status, 403);

    const transport = new StreamableHTTPClientTransport(endpoint, {
      requestInit: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
    const client = new Client({ name: 'remote-component-factory-test', version: '1.0.0' });
    await client.connect(transport);
    try {
      const tools = await client.listTools();
      assert.ok(tools.tools.some(({ name }) => name === 'start_component_proposal'));
      assert.ok(tools.tools.some(({ name }) => name === 'publish_approved_component'));

      const result = await client.callTool({ name: 'get_workflow_context', arguments: {} });
      const workflow = JSON.parse(result.content[0].text);
      assert.deepEqual(workflow.deployment, {
        client_id: 'kilkenny-client',
        isolation: 'single-client',
      });
    } finally {
      await client.close();
    }
  } finally {
    await new Promise((resolve) => httpServer.close(resolve));
  }
});
