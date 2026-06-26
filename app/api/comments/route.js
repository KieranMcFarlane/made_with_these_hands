import { NextResponse } from 'next/server';

import { createEpisodeComment, getEpisodeComments, hasDirectusConfig } from '../../../lib/directus';

function validateComment(payload) {
  const errors = {};
  const episode = String(payload?.episode || '').trim();
  const name = String(payload?.name || '').trim();
  const email = String(payload?.email || '').trim();
  const body = String(payload?.body || '').trim();

  if (!episode) errors.episode = 'Episode is required';
  if (!name) errors.name = 'Name is required';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'A valid email is required';
  if (!body) errors.body = 'Comment is required';

  return { errors, isValid: Object.keys(errors).length === 0 };
}

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const episode = searchParams.get('episode');

  if (!hasDirectusConfig() || !episode) {
    return NextResponse.json({ configured: hasDirectusConfig(), comments: [] });
  }

  try {
    const comments = await getEpisodeComments(episode);
    return NextResponse.json({ configured: true, comments });
  } catch (error) {
    console.error('Failed to load comments', error);
    return NextResponse.json({ configured: true, comments: [], error: 'Failed to load comments' }, { status: 502 });
  }
}

export async function POST(request) {
  if (!hasDirectusConfig()) {
    return NextResponse.json({ ok: false, error: 'Comments are not configured' }, { status: 503 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const validation = validateComment(payload);
  if (!validation.isValid) {
    return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  try {
    await createEpisodeComment(payload);
    return NextResponse.json({ ok: true, pending: true });
  } catch (error) {
    console.error('Failed to save comment', error);
    return NextResponse.json({ ok: false, error: 'Failed to save comment' }, { status: 502 });
  }
}
