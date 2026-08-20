#!/usr/bin/env node

import crypto from 'node:crypto';

const token = crypto.randomBytes(32).toString('hex');
const hash = crypto.createHash('sha256').update(token).digest('hex');

console.log(JSON.stringify({
  bearer_token: token,
  bearer_token_sha256: hash,
  warning: 'Store the bearer token in the client secret manager and only the hash in the Factory deployment.',
}, null, 2));
