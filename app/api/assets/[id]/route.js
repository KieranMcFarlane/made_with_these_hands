const DIRECTUS_FILE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!DIRECTUS_FILE_ID.test(id)) {
    return new Response('Invalid asset ID', { status: 400 });
  }

  const base = process.env.DIRECTUS_URL?.replace(/\/$/, '');
  const token = process.env.DIRECTUS_STATIC_TOKEN;
  if (!base || !token) {
    return new Response('Asset service is not configured', { status: 503 });
  }

  const asset = await fetch(`${base}/assets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!asset.ok) {
    return new Response('Asset unavailable', { status: asset.status });
  }

  const headers = new Headers();
  for (const name of ['content-type', 'content-length', 'content-disposition', 'etag', 'last-modified']) {
    const value = asset.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');

  return new Response(asset.body, {
    status: 200,
    headers,
  });
}
