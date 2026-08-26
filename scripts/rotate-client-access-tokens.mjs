#!/usr/bin/env node

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const directusUrl = process.env.DIRECTUS_URL || 'https://cms.nakanodigital.com';
const adminToken = process.env.DIRECTUS_ADMIN_TOKEN;
const root = process.cwd();

assert.ok(adminToken, 'DIRECTUS_ADMIN_TOKEN is required.');

function parseEnvironment(source) {
  const values = {};
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }
  return values;
}

function replaceEnvironmentValue(source, name, value) {
  const escaped = String(value).replaceAll('\\', '\\\\').replaceAll('"', '\\"');
  const line = `${name}="${escaped}"`;
  const pattern = new RegExp(`^\\s*${name}=.*$`, 'm');
  return pattern.test(source) ? source.replace(pattern, line) : `${source.trimEnd()}\n${line}\n`;
}

async function updateEnvironment(filePath, changes) {
  let source = await fs.readFile(filePath, 'utf8');
  for (const [name, value] of Object.entries(changes)) source = replaceEnvironmentValue(source, name, value);
  await fs.writeFile(filePath, source, { mode: 0o600 });
  await fs.chmod(filePath, 0o600);
}

async function directus(pathname, options = {}) {
  const response = await fetch(`${directusUrl}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  assert.ok(response.ok, body?.errors?.[0]?.message || `${options.method || 'GET'} ${pathname} failed.`);
  return body.data;
}

const projectPath = path.join(root, '.env.local');
const factoryPath = path.join(root, 'deploy/component-factory/.env.client');
const clientPath = path.join(root, 'deploy/component-factory/.env.client-access');
const [projectSource, factorySource] = await Promise.all([
  fs.readFile(projectPath, 'utf8'),
  fs.readFile(factoryPath, 'utf8'),
]);
const projectEnvironment = parseEnvironment(projectSource);
const factoryEnvironment = parseEnvironment(factorySource);

const userQuery = new URLSearchParams({
  'filter[email][_eq]': 'directus-mwth-mcp@nakanodigital.com',
  fields: 'id',
  limit: '1',
});
const [mcpUser] = await directus(`/users?${userQuery}`);
assert.ok(mcpUser, 'MWTH Directus MCP user was not found.');

const directusMcpToken = crypto.randomBytes(32).toString('hex');
const factoryBearerToken = crypto.randomBytes(32).toString('hex');
const factoryBearerHash = crypto.createHash('sha256').update(factoryBearerToken).digest('hex');

await directus(`/users/${mcpUser.id}`, {
  method: 'PATCH',
  body: JSON.stringify({ token: directusMcpToken }),
});

const projectChanges = { DIRECTUS_MCP_TOKEN: directusMcpToken };
if (projectEnvironment.DIRECTUS_COMPONENT_FACTORY_TOKEN !== undefined) {
  projectChanges.DIRECTUS_COMPONENT_FACTORY_TOKEN = directusMcpToken;
}
await Promise.all([
  updateEnvironment(projectPath, projectChanges),
  updateEnvironment(factoryPath, {
    DIRECTUS_COMPONENT_FACTORY_TOKEN: directusMcpToken,
    COMPONENT_FACTORY_BEARER_TOKEN_SHA256: factoryBearerHash,
  }),
  updateEnvironment(clientPath, { CLIENT_COMPONENT_FACTORY_TOKEN: factoryBearerToken }),
]);

assert.ok(factoryEnvironment.COMPONENT_FACTORY_CLIENT_ID === 'made-with-these-hands', 'Factory environment belongs to another client.');
console.log(JSON.stringify({
  ok: true,
  client_id: 'made-with-these-hands',
  directus_token_rotated: true,
  factory_token_rotated: true,
  secrets_printed: false,
}, null, 2));
