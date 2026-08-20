#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const deploymentDirectory = path.join(rootDirectory, 'deploy/component-factory');
const serverEnvironmentPath = path.join(deploymentDirectory, '.env.client');
const clientAccessPath = path.join(deploymentDirectory, '.env.client-access');
const projectEnvironmentPath = path.join(rootDirectory, '.env.local');

function parseEnvironment(source) {
  const values = {};
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }
  return values;
}

function environmentLine(name, value) {
  const escaped = String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"');
  return `${name}="${escaped}"`;
}

async function readEnvironmentFile(filePath) {
  try {
    return parseEnvironment(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return {};
    throw error;
  }
}

const projectEnvironment = await readEnvironmentFile(projectEnvironmentPath);
const existingClientAccess = await readEnvironmentFile(clientAccessPath);
const directusToken = projectEnvironment.DIRECTUS_COMPONENT_FACTORY_TOKEN
  || projectEnvironment.DIRECTUS_MCP_TOKEN;

if (!directusToken) {
  throw new Error(
    'Set DIRECTUS_COMPONENT_FACTORY_TOKEN or DIRECTUS_MCP_TOKEN in .env.local before provisioning.',
  );
}

const bearerToken = existingClientAccess.CLIENT_COMPONENT_FACTORY_TOKEN
  || crypto.randomBytes(32).toString('hex');
const bearerTokenHash = crypto
  .createHash('sha256')
  .update(bearerToken)
  .digest('hex');
const endpoint = 'http://127.0.0.1:8787/mcp';

const serverEnvironment = [
  environmentLine('COMPONENT_FACTORY_CLIENT_ID', 'made-with-these-hands'),
  environmentLine('COMPONENT_FACTORY_HOST', '127.0.0.1'),
  environmentLine('COMPONENT_FACTORY_PORT', '8787'),
  environmentLine('COMPONENT_FACTORY_ALLOWED_HOSTS', '127.0.0.1,localhost'),
  environmentLine('COMPONENT_FACTORY_ALLOWED_ORIGINS', ''),
  environmentLine('COMPONENT_FACTORY_BEARER_TOKEN_SHA256', bearerTokenHash),
  environmentLine('COMPONENT_FACTORY_RATE_LIMIT_PER_MINUTE', '120'),
  '',
  environmentLine('DIRECTUS_URL', projectEnvironment.DIRECTUS_URL || 'http://127.0.0.1:8055'),
  environmentLine('DIRECTUS_COMPONENT_FACTORY_TOKEN', directusToken),
  environmentLine('COMPONENT_FACTORY_SITE_URL', 'http://127.0.0.1:3000'),
  '',
].join('\n');

const clientAccess = [
  environmentLine('COMPONENT_FACTORY_MCP_URL', endpoint),
  environmentLine('CLIENT_COMPONENT_FACTORY_TOKEN', bearerToken),
  '',
].join('\n');

await fs.mkdir(deploymentDirectory, { recursive: true });
await fs.writeFile(serverEnvironmentPath, serverEnvironment, { mode: 0o600 });
await fs.chmod(serverEnvironmentPath, 0o600);
await fs.writeFile(clientAccessPath, clientAccess, { mode: 0o600 });
await fs.chmod(clientAccessPath, 0o600);

console.log(JSON.stringify({
  ok: true,
  client_id: 'made-with-these-hands',
  endpoint,
  server_environment: path.relative(rootDirectory, serverEnvironmentPath),
  client_access: path.relative(rootDirectory, clientAccessPath),
  token_reused: Boolean(existingClientAccess.CLIENT_COMPONENT_FACTORY_TOKEN),
  secrets_printed: false,
}, null, 2));
