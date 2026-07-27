import { BRAND_TENANT, DEFAULT_BRAND_RECORDS } from '../lib/brand-settings.mjs';

const directusUrl = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055';
const token = process.env.DIRECTUS_ADMIN_TOKEN;
const tenant = process.env.DIRECTUS_TENANT_VALUE || BRAND_TENANT;

if (!token) {
  console.error('DIRECTUS_ADMIN_TOKEN is required.');
  process.exit(1);
}

async function request(pathname, options = {}) {
  const response = await fetch(`${directusUrl}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
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

async function existingRecord(settingKey) {
  const filter = JSON.stringify({
    _and: [
      { tenant: { _eq: tenant } },
      { setting_key: { _eq: settingKey } },
    ],
  });
  const query = new URLSearchParams({ filter, fields: 'id,setting_key', limit: '1' });
  const result = await request(`/items/brand_settings?${query}`);
  return result.data?.[0] || null;
}

async function upsertRecord(record) {
  const existing = await existingRecord(record.setting_key);
  const payload = {
    tenant,
    setting_key: record.setting_key,
    value: record.value,
  };

  if (existing) {
    await request(`/items/brand_settings/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    console.log(`updated brand setting: ${record.setting_key}`);
    return;
  }

  await request('/items/brand_settings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  console.log(`created brand setting: ${record.setting_key}`);
}

for (const record of DEFAULT_BRAND_RECORDS) {
  await upsertRecord(record);
}
