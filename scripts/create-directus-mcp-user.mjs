import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const directusUrl = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055';
const adminToken = process.env.DIRECTUS_ADMIN_TOKEN;
const tenant = process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands';

if (!adminToken) {
  console.error('DIRECTUS_ADMIN_TOKEN is required.');
  process.exit(1);
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
  const role = await ensureRole();
  const policy = await ensurePolicy();
  await ensureAccess(role.id, policy.id);

  for (const collection of ['directus_collections', 'directus_fields', 'directus_relations', 'directus_files', 'directus_folders']) {
    await ensurePermission(policy.id, collection, 'read', {
      permissions: {},
      fields: ['*'],
    });
  }

  for (const collection of ['tenants', 'site_pages', 'navigation_items']) {
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

  await ensurePermission(policy.id, 'site_pages_blocks', 'read', {
    permissions: {},
    fields: ['*'],
  });
  await ensurePermission(policy.id, 'site_pages_blocks', 'update', {
    permissions: {},
    fields: ['site_pages_id', 'collection', 'item', 'sort'],
  });
  await ensurePermission(policy.id, 'site_pages_blocks', 'create', {
    permissions: {},
    fields: ['site_pages_id', 'collection', 'item', 'sort'],
  });

  for (const collection of ['block_hero', 'block_text', 'block_media', 'block_quote', 'block_listing', 'block_cta']) {
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

  const user = await ensureUser(role.id);
  await writeMcpToken(user.token);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
