#!/usr/bin/env node

import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  createComponentFactoryServer,
  ensureComponentFactoryStorage,
} from './index.mjs';

const modulePath = fileURLToPath(import.meta.url);

function commaList(value) {
  return String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function required(env, name) {
  const value = String(env[name] || '').trim();
  if (!value) throw new Error(`${name} is required for remote Component Factory hosting.`);
  return value;
}

function positiveInteger(value, fallback, name) {
  const parsed = Number(value ?? fallback);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return parsed;
}

function validatedUrl(value, name) {
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`${name} must use http or https.`);
  }
  return parsed.toString().replace(/\/$/, '');
}

export function parseRemoteConfig(env = process.env) {
  const clientId = required(env, 'COMPONENT_FACTORY_CLIENT_ID');
  if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(clientId)) {
    throw new Error('COMPONENT_FACTORY_CLIENT_ID must be a lowercase DNS-safe client slug.');
  }

  const allowedHosts = commaList(required(env, 'COMPONENT_FACTORY_ALLOWED_HOSTS'));
  const configuredHash = String(env.COMPONENT_FACTORY_BEARER_TOKEN_SHA256 || '').trim().toLowerCase();
  const plaintextToken = String(env.COMPONENT_FACTORY_BEARER_TOKEN || '');
  const bearerTokenHash = configuredHash || (plaintextToken ? sha256(plaintextToken) : '');
  if (!/^[a-f0-9]{64}$/.test(bearerTokenHash)) {
    throw new Error(
      'Set COMPONENT_FACTORY_BEARER_TOKEN_SHA256 to a SHA-256 token hash '
      + 'or COMPONENT_FACTORY_BEARER_TOKEN to a strong secret.',
    );
  }
  if (plaintextToken && plaintextToken.length < 32) {
    throw new Error('COMPONENT_FACTORY_BEARER_TOKEN must contain at least 32 characters.');
  }

  return {
    clientId,
    host: String(env.COMPONENT_FACTORY_HOST || '0.0.0.0'),
    port: positiveInteger(env.COMPONENT_FACTORY_PORT, 8787, 'COMPONENT_FACTORY_PORT'),
    allowedHosts,
    allowedOrigins: commaList(env.COMPONENT_FACTORY_ALLOWED_ORIGINS),
    bearerTokenHash,
    rateLimitPerMinute: positiveInteger(
      env.COMPONENT_FACTORY_RATE_LIMIT_PER_MINUTE,
      120,
      'COMPONENT_FACTORY_RATE_LIMIT_PER_MINUTE',
    ),
    directusUrl: validatedUrl(required(env, 'DIRECTUS_URL'), 'DIRECTUS_URL'),
    siteUrl: validatedUrl(required(env, 'COMPONENT_FACTORY_SITE_URL'), 'COMPONENT_FACTORY_SITE_URL'),
    directusTokenConfigured: Boolean(required(env, 'DIRECTUS_COMPONENT_FACTORY_TOKEN')),
  };
}

function secureEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length
    && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function jsonRpcError(res, status, code, message) {
  res.status(status).json({
    jsonrpc: '2.0',
    error: { code, message },
    id: null,
  });
}

export function createComponentFactoryHttpApp(config) {
  const app = createMcpExpressApp({
    host: config.host,
    allowedHosts: config.allowedHosts,
  });
  let rateWindowStartedAt = Date.now();
  let rateWindowCount = 0;

  app.get('/healthz', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      ok: true,
      service: 'component-factory-mcp',
      version: '1.1.0',
      transport: 'streamable-http',
    });
  });

  app.use('/mcp', (req, res, next) => {
    const origin = req.get('origin');
    if (origin && !config.allowedOrigins.includes(origin)) {
      jsonRpcError(res, 403, -32003, 'Origin is not permitted.');
      return;
    }

    const authorization = req.get('authorization') || '';
    const match = authorization.match(/^Bearer (.+)$/i);
    const presentedHash = match ? sha256(match[1]) : '';
    if (!presentedHash || !secureEqual(presentedHash, config.bearerTokenHash)) {
      res.setHeader('WWW-Authenticate', 'Bearer realm="component-factory"');
      jsonRpcError(res, 401, -32001, 'Authentication required.');
      return;
    }

    const now = Date.now();
    if (now - rateWindowStartedAt >= 60_000) {
      rateWindowStartedAt = now;
      rateWindowCount = 0;
    }
    rateWindowCount += 1;
    if (rateWindowCount > config.rateLimitPerMinute) {
      res.setHeader('Retry-After', '60');
      jsonRpcError(res, 429, -32029, 'Component Factory request limit exceeded.');
      return;
    }

    next();
  });

  app.post('/mcp', async (req, res) => {
    const server = createComponentFactoryServer({ clientId: config.clientId });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    let closed = false;
    const close = async () => {
      if (closed) return;
      closed = true;
      await transport.close().catch(() => {});
      await server.close().catch(() => {});
    };

    res.once('close', close);
    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error(JSON.stringify({
        level: 'error',
        event: 'mcp_request_failed',
        client_id: config.clientId,
        message: error instanceof Error ? error.message : 'Unknown error',
      }));
      if (!res.headersSent) {
        jsonRpcError(res, 500, -32603, 'Internal Component Factory error.');
      }
    }
  });

  for (const method of ['get', 'delete']) {
    app[method]('/mcp', (_req, res) => {
      res.setHeader('Allow', 'POST');
      jsonRpcError(res, 405, -32000, 'Method not allowed.');
    });
  }

  return app;
}

export async function startComponentFactoryHttpServer(config = parseRemoteConfig()) {
  await ensureComponentFactoryStorage();
  const app = createComponentFactoryHttpApp(config);
  const httpServer = await new Promise((resolve, reject) => {
    const listener = app.listen(config.port, config.host, () => resolve(listener));
    listener.once('error', reject);
  });
  console.log(JSON.stringify({
    level: 'info',
    event: 'component_factory_started',
    client_id: config.clientId,
    host: config.host,
    port: config.port,
    allowed_hosts: config.allowedHosts,
  }));
  return httpServer;
}

const isEntrypoint = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(modulePath);

if (isEntrypoint) {
  const config = parseRemoteConfig();
  const httpServer = await startComponentFactoryHttpServer(config);
  const shutdown = (signal) => {
    console.log(JSON.stringify({
      level: 'info',
      event: 'component_factory_stopping',
      signal,
    }));
    httpServer.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}
