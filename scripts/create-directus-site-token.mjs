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

async function ensureRole() {
  const existing = await findOne('roles', { name: { _eq: 'Made With These Hands Site' } });
  if (existing) {
    console.log('role exists: Made With These Hands Site');
    return existing;
  }

  const result = await request('/roles', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Made With These Hands Site',
      icon: 'web',
      description: 'Restricted website role for Made With These Hands',
    }),
  });
  console.log('created role: Made With These Hands Site');
  return result.data;
}

async function ensurePolicy() {
  const existing = await findOne('policies', { name: { _eq: 'Made With These Hands Site Policy' } });
  if (existing) {
    console.log('policy exists: Made With These Hands Site Policy');
    return existing;
  }

  const result = await request('/policies', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Made With These Hands Site Policy',
      icon: 'web',
      description: 'Read published MWTH content and submit comments/enquiries only',
      admin_access: false,
      app_access: false,
      enforce_tfa: false,
    }),
  });
  console.log('created policy: Made With These Hands Site Policy');
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

async function ensurePermission(policyId, collection, action, permission) {
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
    email: { _eq: 'directus-mwth-site@nakanodigital.com' },
  });

  const token = existing?.token || crypto.randomBytes(32).toString('hex');
  const body = {
    first_name: 'Made With These Hands',
    last_name: 'Site',
    email: 'directus-mwth-site@nakanodigital.com',
    status: 'active',
    role: roleId,
    token,
  };

  if (existing) {
    await request(`/users/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    console.log('updated user: directus-mwth-site@nakanodigital.com');
    return { ...existing, token };
  }

  const result = await request('/users', {
    method: 'POST',
    body: JSON.stringify({
      ...body,
      password: crypto.randomBytes(24).toString('base64url'),
    }),
  });
  console.log('created user: directus-mwth-site@nakanodigital.com');
  return { ...result.data, token };
}

function tenantReadFilter(extra = {}) {
  return {
    _and: [
      { tenant: { _eq: tenant } },
      extra,
    ].filter((item) => Object.keys(item).length),
  };
}

async function writeEnvToken(token) {
  const envPath = path.join(process.cwd(), '.env.local');
  const additions = {
    DIRECTUS_URL: directusUrl,
    DIRECTUS_STATIC_TOKEN: token,
    DIRECTUS_TENANT_FIELD: 'tenant',
    DIRECTUS_TENANT_VALUE: tenant,
    DIRECTUS_MAKERS_COLLECTION: 'makers',
    DIRECTUS_PRODUCTS_COLLECTION: 'products',
    DIRECTUS_EPISODES_COLLECTION: 'episodes',
    DIRECTUS_POSTS_COLLECTION: 'posts',
    DIRECTUS_SECTIONS_COLLECTION: 'site_sections',
    DIRECTUS_COMMENTS_COLLECTION: 'comments',
    DIRECTUS_COMMENTS_EPISODE_FIELD: 'episode',
    DIRECTUS_COMMENTS_STATUS_FIELD: 'status',
    DIRECTUS_COMMENTS_STATUS_VALUE: 'approved',
    DIRECTUS_COMMENTS_DEFAULT_STATUS: 'pending',
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
  console.log('updated .env.local with restricted Directus site token');
}

async function main() {
  const role = await ensureRole();
  const policy = await ensurePolicy();
  await ensureAccess(role.id, policy.id);

  const published = { status: { _eq: 'published' } };
  const tenantOnly = tenantReadFilter();

  for (const collection of ['tenants', 'site_pages', 'page_sections', 'navigation_items', 'brand_settings']) {
    await ensurePermission(policy.id, collection, 'read', {
      permissions: tenantOnly,
      fields: ['*'],
    });
  }

  for (const collection of ['makers', 'products', 'episodes', 'posts', 'site_sections']) {
    await ensurePermission(policy.id, collection, 'read', {
      permissions: tenantReadFilter(published),
      fields: ['*'],
    });
  }

  await ensurePermission(policy.id, 'comments', 'read', {
    permissions: tenantReadFilter({ status: { _eq: 'approved' } }),
    fields: ['id', 'episode', 'name', 'body', 'status', 'date_created', 'tenant'],
  });

  await ensurePermission(policy.id, 'comments', 'create', {
    permissions: {},
    validation: tenantReadFilter({ status: { _eq: 'pending' } }),
    presets: { tenant, status: 'pending' },
    fields: ['episode', 'name', 'email', 'body', 'tenant', 'status'],
  });

  await ensurePermission(policy.id, 'enquiries', 'create', {
    permissions: {},
    validation: { tenant: { _eq: tenant } },
    presets: { tenant, status: 'new' },
    fields: ['product', 'product_name', 'maker_name', 'name', 'email', 'phone', 'message', 'tenant', 'status'],
  });

  await ensurePermission(policy.id, 'directus_files', 'read', {
    permissions: {},
    fields: ['*'],
  });

  const user = await ensureUser(role.id);
  await writeEnvToken(user.token);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
