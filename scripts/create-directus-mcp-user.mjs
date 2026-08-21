import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { APPROVED_COMPONENT_COLLECTIONS } from '../component-system/components.mjs';

const directusUrl = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055';
let adminToken = process.env.DIRECTUS_ADMIN_TOKEN;
const tenant = process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands';

async function resolveAdminToken() {
  if (adminToken) {
    const response = await fetch(`${directusUrl}/users/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (response.ok) return adminToken;
  }

  const email = process.env.DIRECTUS_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const password = process.env.DIRECTUS_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('A valid DIRECTUS_ADMIN_TOKEN or Directus admin email/password is required.');
  }
  const response = await fetch(`${directusUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.data?.access_token) {
    throw new Error(body?.errors?.[0]?.message || 'Directus admin login failed.');
  }
  return body.data.access_token;
}

async function request(pathname, options = {}) {
  const response = await fetch(`${directusUrl}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = body?.errors?.[0]?.message || body?.message || response.statusText;
    throw new Error(`${options.method || 'GET'} ${pathname}: ${message}`);
  }
  return body;
}

function qs(params) {
  return new URLSearchParams(params).toString();
}

async function findOne(endpoint, filter) {
  const result = await request(`/${endpoint}?${qs({ filter: JSON.stringify(filter), limit: '1' })}`);
  return result.data?.[0] || null;
}

async function collectionExists(collection) {
  const result = await request('/collections');
  return result.data.some((item) => item.collection === collection);
}

async function ensureRole() {
  const existing = await findOne('roles', { name: { _eq: 'Made With These Hands MCP' } });
  if (existing) {
    console.log('role exists: Made With These Hands MCP');
    return existing;
  }

  const result = await request('/roles', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Made With These Hands MCP',
      icon: 'smart_toy',
      description: 'Scoped role for AI-assisted content editing through Directus MCP. Deletes are intentionally not permitted.',
    }),
  });
  console.log('created role: Made With These Hands MCP');
  return result.data;
}

async function ensurePolicy() {
  const existing = await findOne('policies', { name: { _eq: 'Made With These Hands MCP Policy' } });
  if (existing) {
    console.log('policy exists: Made With These Hands MCP Policy');
    return existing;
  }

  const result = await request('/policies', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Made With These Hands MCP Policy',
      icon: 'smart_toy',
      description: 'Read schema and create/update MWTH content blocks and editorial content. No delete permissions.',
      admin_access: false,
      app_access: false,
      enforce_tfa: false,
    }),
  });
  console.log('created policy: Made With These Hands MCP Policy');
  return result.data;
}

async function lockPolicy(policyId) {
  await request(`/policies/${policyId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: 'Made With These Hands MCP Policy',
      icon: 'smart_toy',
      description: 'Read schema and create/update MWTH content blocks and editorial content. No delete permissions.',
      admin_access: false,
      app_access: false,
      enforce_tfa: false,
    }),
  });
  console.log('locked MCP policy: admin access disabled');
}

async function ensureAccess(roleId, policyId) {
  const existing = await findOne('access', {
    _and: [
      { role: { _eq: roleId } },
      { policy: { _eq: policyId } },
    ],
  });
  if (existing) {
    console.log('access exists: role -> policy');
    return existing;
  }

  const result = await request('/access', {
    method: 'POST',
    body: JSON.stringify({
      role: roleId,
      policy: policyId,
    }),
  });
  console.log('created access: role -> policy');
  return result.data;
}

async function ensurePermission(policyId, collection, action, permission = {}) {
  if (!(await collectionExists(collection))) {
    console.log(`skipping missing collection: ${collection}`);
    return;
  }

  const existing = await findOne('permissions', {
    _and: [
      { policy: { _eq: policyId } },
      { collection: { _eq: collection } },
      { action: { _eq: action } },
    ],
  });

  const payload = {
    collection,
    action,
    policy: policyId,
    permissions: permission.permissions ?? {},
    validation: permission.validation ?? null,
    presets: permission.presets ?? null,
    fields: permission.fields ?? ['*'],
  };

  async function savePermission(pathname, method, body) {
    try {
      return await request(pathname, {
        method,
        body: JSON.stringify(body),
      });
    } catch (error) {
      if (!String(error.message).includes('custom_permission_rules_enabled')) throw error;
      if (method === 'PATCH') return null;
      const unrestricted = { ...body };
      delete unrestricted.permissions;
      delete unrestricted.validation;
      delete unrestricted.presets;
      unrestricted.fields = ['*'];
      return request(pathname, {
        method,
        body: JSON.stringify(unrestricted),
      });
    }
  }

  if (existing) {
    await savePermission(`/permissions/${existing.id}`, 'PATCH', payload);
    console.log(`updated permission: ${collection}.${action}`);
    return;
  }

  await savePermission('/permissions', 'POST', payload);
  console.log(`created permission: ${collection}.${action}`);
}

async function removePermission(policyId, collection, action) {
  const existing = await findOne('permissions', {
    _and: [
      { policy: { _eq: policyId } },
      { collection: { _eq: collection } },
      { action: { _eq: action } },
    ],
  });
  if (!existing) return;
  await request(`/permissions/${existing.id}`, { method: 'DELETE' });
  console.log(`removed permission: ${collection}.${action}`);
}

async function removeDeletePermissions(policyId) {
  const result = await request(`/permissions?${qs({
    filter: JSON.stringify({
      _and: [
        { policy: { _eq: policyId } },
        { action: { _eq: 'delete' } },
      ],
    }),
    limit: '-1',
  })}`);

  for (const permission of result.data || []) {
    await request(`/permissions/${permission.id}`, { method: 'DELETE' });
    console.log(`removed permission: ${permission.collection}.delete`);
  }
}

async function ensureUser(roleId) {
  const existing = await findOne('users', {
    email: { _eq: 'directus-mwth-mcp@nakanodigital.com' },
  });

  const envToken = readEnvValue('DIRECTUS_MCP_TOKEN');
  const visibleExistingToken = existing?.token && !String(existing.token).includes('*') ? existing.token : '';
  const token = envToken || visibleExistingToken || crypto.randomBytes(32).toString('hex');
  const body = {
    first_name: 'Made With These Hands',
    last_name: 'MCP',
    email: 'directus-mwth-mcp@nakanodigital.com',
    status: 'active',
    role: roleId,
  };

  if (existing) {
    await request(`/users/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...body,
        ...(envToken || visibleExistingToken ? {} : { token }),
      }),
    });
    console.log('updated user: directus-mwth-mcp@nakanodigital.com');
    return { ...existing, token };
  }

  const result = await request('/users', {
    method: 'POST',
    body: JSON.stringify({
      ...body,
      token,
      password: crypto.randomBytes(24).toString('base64url'),
    }),
  });
  console.log('created user: directus-mwth-mcp@nakanodigital.com');
  return { ...result.data, token };
}

function readEnvValue(key) {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return '';
  const current = fs.readFileSync(envPath, 'utf8');
  return current.match(new RegExp(`^${key}="?([^"\\r\\n]+)"?`, 'm'))?.[1] || '';
}

function tenantFilter(extra = {}) {
  return {
    _and: [
      { tenant: { _eq: tenant } },
      extra,
    ].filter((item) => Object.keys(item).length),
  };
}

function tenantRecordFilter() {
  return { slug: { _eq: tenant } };
}

function pageJunctionFilter() {
  return { site_pages_id: { tenant: { _eq: tenant } } };
}

async function ensureTenantFolder() {
  const name = `nakano-${tenant}`;
  const existing = await findOne('folders', { name: { _eq: name } });
  if (existing) return existing;
  const result = await request('/folders', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  console.log(`created folder: ${name}`);
  return result.data;
}

async function writeMcpToken(token) {
  const envPath = path.join(process.cwd(), '.env.local');
  const additions = {
    DIRECTUS_MCP_TOKEN: token,
  };

  const current = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const lines = current.split(/\r?\n/).filter(Boolean);
  const keys = new Set(Object.keys(additions));
  const kept = lines.filter((line) => !keys.has(line.split('=')[0]));
  const next = [
    ...kept,
    ...Object.entries(additions).map(([key, value]) => `${key}="${String(value).replaceAll('"', '\\"')}"`),
  ].join('\n');

  fs.writeFileSync(envPath, `${next}\n`);
  console.log('updated .env.local with Directus MCP token');
}

async function main() {
  adminToken = await resolveAdminToken();
  const role = await ensureRole();
  const policy = await ensurePolicy();
  await ensureAccess(role.id, policy.id);

  for (const collection of ['directus_collections', 'directus_fields', 'directus_relations']) {
    await ensurePermission(policy.id, collection, 'read', {
      permissions: {},
      fields: ['*'],
    });
  }

  await ensurePermission(policy.id, 'tenants', 'read', {
    permissions: tenantRecordFilter(),
    fields: ['id', 'slug', 'status', 'name', 'site_url', 'description', 'phone', 'email', 'location', 'logo', 'footer_logo', 'footer_tagline'],
  });
  await removePermission(policy.id, 'tenants', 'create');
  await removePermission(policy.id, 'tenants', 'update');

  for (const collection of ['site_pages', 'navigation_items']) {
    await ensurePermission(policy.id, collection, 'read', {
      permissions: tenantFilter(),
      fields: ['*'],
    });
    await ensurePermission(policy.id, collection, 'update', {
      permissions: tenantFilter(),
      validation: tenantFilter(),
      fields: ['*'],
    });
    await ensurePermission(policy.id, collection, 'create', {
      permissions: {},
      validation: tenantFilter(),
      presets: { tenant },
      fields: ['*'],
    });
  }

  await ensurePermission(policy.id, 'brand_settings', 'read', {
    permissions: tenantFilter(),
    fields: ['id', 'tenant', 'setting_key', 'value', 'source'],
  });
  await ensurePermission(policy.id, 'brand_settings', 'update', {
    permissions: tenantFilter(),
    validation: tenantFilter(),
    fields: ['setting_key', 'value', 'source'],
  });
  await ensurePermission(policy.id, 'brand_settings', 'create', {
    permissions: {},
    validation: tenantFilter(),
    presets: { tenant },
    fields: ['tenant', 'setting_key', 'value', 'source'],
  });

  await ensurePermission(policy.id, 'component_registry', 'read', {
    permissions: {},
    fields: ['*'],
  });
  await ensurePermission(policy.id, 'component_proposals', 'read', {
    permissions: tenantFilter(),
    fields: ['*'],
  });
  await ensurePermission(policy.id, 'component_proposals', 'create', {
    permissions: {},
    validation: tenantFilter(),
    presets: { tenant, status: 'proposed' },
    fields: ['tenant', 'request', 'component_key', 'requested_by', 'proposal', 'brand_contract_version'],
  });
  await ensurePermission(policy.id, 'component_proposals', 'update', {
    permissions: tenantFilter({
      status: { _in: ['proposed', 'testing', 'awaiting_approval', 'ready_for_tenant_install', 'approved'] },
    }),
    validation: tenantFilter({
      status: { _in: ['proposed', 'testing', 'awaiting_approval', 'ready_for_tenant_install', 'published'] },
    }),
    fields: [
      'proposal',
      'guardrail',
      'tenant_release',
      'brand_contract_version',
      'branch_or_change_id',
      'validation_summary',
      'preview_url',
      'status',
    ],
  });

  await ensurePermission(policy.id, 'site_pages_blocks', 'read', {
    permissions: pageJunctionFilter(),
    fields: ['*'],
  });
  await ensurePermission(policy.id, 'site_pages_blocks', 'update', {
    permissions: pageJunctionFilter(),
    validation: pageJunctionFilter(),
    fields: ['site_pages_id', 'collection', 'item', 'sort', 'slot'],
  });
  await ensurePermission(policy.id, 'site_pages_blocks', 'create', {
    permissions: {},
    validation: pageJunctionFilter(),
    fields: ['site_pages_id', 'collection', 'item', 'sort', 'slot'],
  });

  for (const collection of APPROVED_COMPONENT_COLLECTIONS) {
    await ensurePermission(policy.id, collection, 'read', {
      permissions: tenantFilter(),
      fields: ['*'],
    });
    await ensurePermission(policy.id, collection, 'update', {
      permissions: tenantFilter(),
      validation: tenantFilter(),
      fields: ['*'],
    });
    await ensurePermission(policy.id, collection, 'create', {
      permissions: {},
      validation: tenantFilter(),
      presets: { tenant, status: 'published' },
      fields: ['*'],
    });
  }

  for (const collection of ['makers', 'products', 'episodes', 'posts', 'site_sections']) {
    await ensurePermission(policy.id, collection, 'read', {
      permissions: tenantFilter(),
      fields: ['*'],
    });
    await ensurePermission(policy.id, collection, 'update', {
      permissions: tenantFilter(),
      validation: tenantFilter(),
      fields: ['*'],
    });
    await ensurePermission(policy.id, collection, 'create', {
      permissions: {},
      validation: tenantFilter(),
      presets: { tenant, status: 'published' },
      fields: ['*'],
    });
  }

  await ensurePermission(policy.id, 'comments', 'read', {
    permissions: tenantFilter(),
    fields: ['id', 'tenant', 'episode', 'name', 'body', 'status', 'date_created'],
  });
  await ensurePermission(policy.id, 'comments', 'update', {
    permissions: tenantFilter(),
    validation: tenantFilter(),
    fields: ['status'],
  });

  await ensurePermission(policy.id, 'enquiries', 'read', {
    permissions: tenantFilter(),
    fields: ['*'],
  });
  await ensurePermission(policy.id, 'enquiries', 'update', {
    permissions: tenantFilter(),
    validation: tenantFilter(),
    fields: ['status'],
  });

  const tenantFolder = await ensureTenantFolder();
  const folderFilter = { folder: { _eq: tenantFolder.id } };
  await ensurePermission(policy.id, 'directus_folders', 'read', {
    permissions: { id: { _eq: tenantFolder.id } },
    fields: ['id', 'name', 'parent'],
  });
  await ensurePermission(policy.id, 'directus_files', 'read', {
    permissions: folderFilter,
    fields: ['*'],
  });
  await ensurePermission(policy.id, 'directus_files', 'create', {
    permissions: {},
    validation: folderFilter,
    presets: { folder: tenantFolder.id },
    fields: ['*'],
  });
  await ensurePermission(policy.id, 'directus_files', 'update', {
    permissions: folderFilter,
    validation: folderFilter,
    fields: ['title', 'description', 'tags', 'focal_point_x', 'focal_point_y'],
  });

  await removeDeletePermissions(policy.id);
  const user = await ensureUser(role.id);
  await writeMcpToken(user.token);
  await lockPolicy(policy.id);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
