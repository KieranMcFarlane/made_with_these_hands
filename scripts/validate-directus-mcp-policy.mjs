import assert from 'node:assert/strict';
import { APPROVED_COMPONENT_COLLECTIONS } from '../component-system/components.mjs';

const directusUrl = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055';
const tenant = process.env.DIRECTUS_TENANT_VALUE || 'made-with-these-hands';
const mcpToken = process.env.DIRECTUS_MCP_TOKEN;

assert.ok(mcpToken, 'DIRECTUS_MCP_TOKEN is required.');

async function jsonRequest(pathname, token, options = {}) {
  const response = await fetch(`${directusUrl}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  return { response, body };
}

async function adminAccessToken() {
  const candidate = process.env.DIRECTUS_ADMIN_TOKEN;
  if (candidate) {
    const { response } = await jsonRequest('/users/me', candidate);
    if (response.ok) return candidate;
  }
  const email = process.env.DIRECTUS_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const password = process.env.DIRECTUS_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  assert.ok(email && password, 'A valid admin token or Directus admin email/password is required.');
  const response = await fetch(`${directusUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => null);
  assert.ok(response.ok && body?.data?.access_token, body?.errors?.[0]?.message || 'Directus admin login failed.');
  return body.data.access_token;
}

async function adminData(pathname, token) {
  const { response, body } = await jsonRequest(pathname, token);
  assert.ok(response.ok, body?.errors?.[0]?.message || `GET ${pathname} failed.`);
  return body.data;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, entry]) => [key, stable(entry)]));
}

function permissionBy(perms, collection, action) {
  return perms.find((permission) => permission.collection === collection && permission.action === action);
}

function assertRule(actual, expected, label) {
  assert.deepEqual(stable(actual), stable(expected), `${label} is not tenant scoped.`);
}

const adminToken = await adminAccessToken();
const license = await adminData('/license', adminToken);
const customPermissionRulesEnabled = license?.custom_permission_rules_enabled === true;
const availableCollections = new Set((await adminData('/collections?limit=-1', adminToken))
  .map(({ collection }) => collection));
const deployedComponentCollections = APPROVED_COMPONENT_COLLECTIONS
  .filter((collection) => availableCollections.has(collection));
const pendingComponentCollections = APPROVED_COMPONENT_COLLECTIONS
  .filter((collection) => !availableCollections.has(collection));
const roleQuery = new URLSearchParams({ 'filter[name][_eq]': 'Made With These Hands MCP', limit: '1' });
const policyQuery = new URLSearchParams({ 'filter[name][_eq]': 'Made With These Hands MCP Policy', limit: '1' });
const [role] = await adminData(`/roles?${roleQuery}`, adminToken);
const [policy] = await adminData(`/policies?${policyQuery}`, adminToken);
assert.ok(role && policy, 'The MWTH MCP role and policy must exist.');
assert.equal(policy.admin_access, false, 'MCP policy must not have admin access.');
assert.equal(policy.app_access, false, 'MCP policy must not have Directus app access.');

const accessQuery = new URLSearchParams({
  filter: JSON.stringify({ _and: [{ role: { _eq: role.id } }, { policy: { _eq: policy.id } }] }),
  limit: '1',
});
assert.equal((await adminData(`/access?${accessQuery}`, adminToken)).length, 1, 'Role must be attached to exactly one MWTH policy access record.');

const permissionsQuery = new URLSearchParams({ 'filter[policy][_eq]': policy.id, limit: '-1' });
const permissions = await adminData(`/permissions?${permissionsQuery}`, adminToken);
assert.equal(permissions.some(({ action }) => action === 'delete'), false, 'MCP policy must not contain delete permissions.');
for (const systemCollection of ['directus_users', 'directus_roles', 'directus_policies', 'directus_permissions']) {
  assert.equal(permissions.some(({ collection }) => collection === systemCollection), false, `${systemCollection} must not be exposed.`);
}

const tenantRule = { _and: [{ tenant: { _eq: tenant } }] };
if (customPermissionRulesEnabled) {
  assertRule(permissionBy(permissions, 'tenants', 'read')?.permissions, { slug: { _eq: tenant } }, 'tenants.read');
} else {
  assert.ok(permissionBy(permissions, 'tenants', 'read'), 'tenants.read permission is required.');
}
assert.equal(permissionBy(permissions, 'tenants', 'create'), undefined, 'The MCP user must not create tenants.');
assert.equal(permissionBy(permissions, 'tenants', 'update'), undefined, 'The MCP user must not update tenants.');

const tenantCrudCollections = [
  'site_pages',
  'navigation_items',
  'brand_settings',
  ...deployedComponentCollections,
  'makers',
  'products',
  'episodes',
  'posts',
  'site_sections',
];
for (const collection of tenantCrudCollections) {
  if (customPermissionRulesEnabled) {
    assertRule(permissionBy(permissions, collection, 'read')?.permissions, tenantRule, `${collection}.read`);
    assertRule(permissionBy(permissions, collection, 'update')?.permissions, tenantRule, `${collection}.update`);
    assert.equal(permissionBy(permissions, collection, 'create')?.presets?.tenant, tenant, `${collection}.create must preset the tenant.`);
  } else {
    for (const action of ['read', 'update', 'create']) {
      assert.ok(permissionBy(permissions, collection, action), `${collection}.${action} permission is required.`);
    }
  }
}

for (const collection of ['comments', 'enquiries']) {
  if (customPermissionRulesEnabled) {
    assertRule(permissionBy(permissions, collection, 'read')?.permissions, tenantRule, `${collection}.read`);
    assertRule(permissionBy(permissions, collection, 'update')?.permissions, tenantRule, `${collection}.update`);
  } else {
    assert.ok(permissionBy(permissions, collection, 'read'), `${collection}.read permission is required.`);
    assert.ok(permissionBy(permissions, collection, 'update'), `${collection}.update permission is required.`);
  }
  assert.equal(permissionBy(permissions, collection, 'create'), undefined, `${collection}.create belongs to the public runtime, not MCP.`);
}

const junctionRule = { site_pages_id: { tenant: { _eq: tenant } } };
if (customPermissionRulesEnabled) {
  assertRule(permissionBy(permissions, 'site_pages_blocks', 'read')?.permissions, junctionRule, 'site_pages_blocks.read');
  assertRule(permissionBy(permissions, 'site_pages_blocks', 'update')?.permissions, junctionRule, 'site_pages_blocks.update');
  assertRule(permissionBy(permissions, 'site_pages_blocks', 'create')?.validation, junctionRule, 'site_pages_blocks.create');
} else {
  for (const action of ['read', 'update', 'create']) {
    assert.ok(permissionBy(permissions, 'site_pages_blocks', action), `site_pages_blocks.${action} permission is required.`);
  }
}

const proposalFields = await adminData('/fields/component_proposals', adminToken);
assert.ok(proposalFields.some(({ field }) => field === 'tenant'), 'component_proposals.tenant is required.');
if (customPermissionRulesEnabled) {
  assertRule(permissionBy(permissions, 'component_proposals', 'read')?.permissions, tenantRule, 'component_proposals.read');
  assert.equal(permissionBy(permissions, 'component_proposals', 'create')?.presets?.tenant, tenant, 'component_proposals.create must preset the tenant.');
} else {
  assert.ok(permissionBy(permissions, 'component_proposals', 'read'), 'component_proposals.read permission is required.');
  assert.ok(permissionBy(permissions, 'component_proposals', 'create'), 'component_proposals.create permission is required.');
}

const folderPermission = permissionBy(permissions, 'directus_folders', 'read');
if (customPermissionRulesEnabled) {
  const folderId = folderPermission?.permissions?.id?._eq;
  assert.ok(folderId, 'The MCP policy must restrict folder access to one tenant folder.');
  const fileRule = { folder: { _eq: folderId } };
  assertRule(permissionBy(permissions, 'directus_files', 'read')?.permissions, fileRule, 'directus_files.read');
  assertRule(permissionBy(permissions, 'directus_files', 'update')?.permissions, fileRule, 'directus_files.update');
  assert.equal(permissionBy(permissions, 'directus_files', 'create')?.presets?.folder, folderId, 'directus_files.create must preset the tenant folder.');
} else {
  assert.ok(folderPermission, 'directus_folders.read permission is required.');
  assert.ok(permissionBy(permissions, 'directus_files', 'read'), 'directus_files.read permission is required.');
  assert.ok(permissionBy(permissions, 'directus_files', 'create'), 'directus_files.create permission is required.');
  assert.ok(permissionBy(permissions, 'directus_files', 'update'), 'directus_files.update permission is required.');
}

const userQuery = new URLSearchParams({
  'filter[email][_eq]': 'directus-mwth-mcp@nakanodigital.com',
  fields: 'id,role',
  limit: '1',
});
const [mcpUser] = await adminData(`/users?${userQuery}`, adminToken);
assert.equal(mcpUser?.role, role.id, 'MCP user is attached to the wrong role.');

const { response: meResponse, body: meBody } = await jsonRequest('/users/me?fields=id', mcpToken);
assert.ok(meResponse.ok, meBody?.errors?.[0]?.message || 'MCP token cannot resolve its identity.');
assert.equal(meBody.data.id, mcpUser.id, 'MCP token resolves to the wrong user.');

const { response: tenantsResponse, body: tenantsBody } = await jsonRequest('/items/tenants?fields=slug&limit=-1', mcpToken);
assert.ok(tenantsResponse.ok, tenantsBody?.errors?.[0]?.message || 'MCP token cannot read its tenant.');
assert.deepEqual(tenantsBody.data.map(({ slug }) => slug), [tenant], 'MCP token can see another tenant.');
if (!customPermissionRulesEnabled) {
  const allTenants = await adminData('/items/tenants?fields=slug&limit=-1', adminToken);
  assert.deepEqual(allTenants.map(({ slug }) => slug), [tenant], 'Directus Core isolation requires this database to remain single tenant.');
}

for (const collection of ['site_pages', ...deployedComponentCollections, 'makers', 'products', 'episodes', 'posts']) {
  const { response, body } = await jsonRequest(`/items/${collection}?fields=tenant&limit=-1`, mcpToken);
  assert.ok(response.ok, body?.errors?.[0]?.message || `MCP token cannot read ${collection}.`);
  assert.ok(body.data.every((item) => item.tenant === tenant), `MCP token can see another tenant in ${collection}.`);
}

const { response: deleteResponse } = await jsonRequest('/items/posts/2147483647', mcpToken, { method: 'DELETE' });
assert.equal(deleteResponse.status, 403, 'MCP token must receive 403 for delete attempts.');

console.log(JSON.stringify({
  ok: true,
  tenant,
  directus_core_custom_permission_rules: customPermissionRulesEnabled,
  isolation_mode: customPermissionRulesEnabled ? 'row-filtered-policy' : 'single-tenant-database',
  permissions: permissions.length,
  deployed_component_collections: deployedComponentCollections,
  pending_component_collections: pendingComponentCollections,
  deletes_denied: true,
}, null, 2));
