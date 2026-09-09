import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import { verifyDraftPreviewToken } from '../../lib/draft-preview-token.js';

test('production draft previews require a live page-bound signature', () => {
  const priorNodeEnv = process.env.NODE_ENV;
  const priorSecret = process.env.MWTH_PREVIEW_SECRET;
  process.env.NODE_ENV = 'production';
  process.env.MWTH_PREVIEW_SECRET = 'test-preview-secret';
  const expires = Math.floor(Date.now() / 1000) + 300;
  const signature = crypto.createHmac('sha256', process.env.MWTH_PREVIEW_SECRET).update(`12:${expires}`).digest('base64url');

  assert.equal(verifyDraftPreviewToken('12', `${expires}.${signature}`), true);
  assert.equal(verifyDraftPreviewToken('13', `${expires}.${signature}`), false);
  assert.equal(verifyDraftPreviewToken('12', `${Math.floor(Date.now() / 1000) - 1}.${signature}`), false);
  assert.equal(verifyDraftPreviewToken('12', 'invalid'), false);

  if (priorNodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = priorNodeEnv;
  if (priorSecret === undefined) delete process.env.MWTH_PREVIEW_SECRET; else process.env.MWTH_PREVIEW_SECRET = priorSecret;
});
