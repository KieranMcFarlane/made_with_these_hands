import crypto from 'node:crypto';

const MAX_FUTURE_SECONDS = 60 * 60;

export function verifyDraftPreviewToken(pageId, token) {
  if (process.env.NODE_ENV !== 'production' && !token) return true;
  const secret = process.env.MWTH_PREVIEW_SECRET;
  if (!secret || typeof token !== 'string') return false;
  const [expiresRaw, signature] = token.split('.');
  const expires = Number(expiresRaw);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isInteger(expires) || expires <= now || expires > now + MAX_FUTURE_SECONDS || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${pageId}:${expires}`).digest('base64url');
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}
