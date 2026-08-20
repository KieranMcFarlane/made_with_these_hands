import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const directusUrl = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055';
const directusToken = process.env.DIRECTUS_COMPONENT_FACTORY_TOKEN
  || process.env.DIRECTUS_MCP_TOKEN
  || process.env.DIRECTUS_STATIC_TOKEN;

async function availablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

async function publishedPagePaths() {
  if (!directusToken) return [];
  const query = new URLSearchParams({
    fields: 'path',
    'filter[status][_eq]': 'published',
    limit: '-1',
    sort: 'path',
  });
  const response = await fetch(`${directusUrl}/items/site_pages?${query}`, {
    headers: { Authorization: `Bearer ${directusToken}` },
  });
  if (!response.ok) throw new Error(`Unable to read published Directus pages: ${response.status}`);
  const body = await response.json();
  return body.data.map(({ path: pagePath }) => pagePath).filter(Boolean);
}

async function proposalPreviewPaths() {
  const proposalsRoot = path.join(root, 'component-system', 'proposals');
  const entries = await fs.readdir(proposalsRoot, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isDirectory() && /^[a-zA-Z0-9_-]+$/.test(entry.name))
    .map((entry) => `/brand/proposals/${entry.name}`);
}

async function waitUntilReady(baseUrl, child) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Next.js exited before smoke testing (code ${child.exitCode}).`);
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Timed out waiting for the production server.');
}

const port = await availablePort();
const baseUrl = `http://127.0.0.1:${port}`;
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
const child = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)], {
  cwd: root,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    NEXT_TELEMETRY_DISABLED: '1',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
});

let serverOutput = '';
child.stdout.on('data', (chunk) => { serverOutput += chunk; });
child.stderr.on('data', (chunk) => { serverOutput += chunk; });

try {
  await waitUntilReady(baseUrl, child);
  const routes = [...new Set([
    '/',
    '/brand',
    ...(await publishedPagePaths()),
    ...(await proposalPreviewPaths()),
  ])].sort();

  const results = [];
  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: 'manual' });
    const html = await response.text();
    assert.ok(
      response.status >= 200 && response.status < 400,
      `${route} returned ${response.status}`,
    );
    assert.ok(!html.includes('Application error'), `${route} rendered an application error`);
    results.push({ route, status: response.status });
  }

  console.log(`Production smoke test passed for ${results.length} routes.`);
  for (const { route, status } of results) console.log(`${status} ${route}`);
} catch (error) {
  if (serverOutput.trim()) console.error(serverOutput.trim());
  throw error;
} finally {
  child.kill('SIGTERM');
  await new Promise((resolve) => {
    if (child.exitCode !== null) resolve();
    else {
      child.once('exit', resolve);
      setTimeout(() => {
        if (child.exitCode === null) child.kill('SIGKILL');
        resolve();
      }, 5_000).unref();
    }
  });
}
