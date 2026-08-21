#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod/v4';
import {
  APPROVED_COMPONENTS,
  COMPONENT_MANIFEST_VERSION,
  componentByCollection,
} from '../../component-system/components.mjs';
import {
  DEFAULT_BRAND_RECORDS,
  brandFromRecords,
} from '../../lib/brand-settings.mjs';

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const proposalsRoot = path.join(root, 'component-system', 'proposals');
const directusUrl = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055';
const directusToken = process.env.DIRECTUS_COMPONENT_FACTORY_TOKEN || process.env.DIRECTUS_MCP_TOKEN;
const siteUrl = process.env.COMPONENT_FACTORY_SITE_URL || 'http://localhost:3000';
const allowedPrimitives = new Set([
  'accordion',
  'alert',
  'alert-dialog',
  'badge',
  'button',
  'card',
  'carousel',
  'dialog',
  'input',
  'label',
  'popover',
  'scroll-area',
  'select',
  'separator',
  'sheet',
  'skeleton',
  'tabs',
  'textarea',
  'tooltip',
]);
const trustedOpenSourcePackages = {
  'media-chrome': {
    package: 'media-chrome',
    source: 'github:muxinc/media-chrome',
    license: 'MIT',
    purpose: 'Accessible, brandable native media controls for audio and video playback.',
    allowedFor: ['audio-playback', 'video-playback', 'podcast-player'],
  },
};

const tenantSafeSlots = new Set(['main', 'before-content', 'after-content', 'related-content']);
const tenantSafeFieldTypes = new Set(['string', 'text', 'json', 'uuid', 'boolean', 'integer', 'decimal', 'date', 'datetime']);
const platformReviewSignals = [
  { pattern: /<script|javascript:|eval\(|new Function/i, reason: 'Executable script content is not allowed in CMS component contracts.' },
  { pattern: /\b(delete|drop|truncate)\b.*\b(collection|schema|table|field|permission)\b/i, reason: 'Destructive schema or permission changes need platform review.' },
  { pattern: /\b(env|secret|token|admin|permission|role)\b/i, reason: 'Secrets, roles, and admin permissions need platform review.' },
  { pattern: /\biframe|embed script|third-party script\b/i, reason: 'Embeds and third-party scripts need platform review unless explicitly allowlisted.' },
];

const workflow = {
  version: '1.0.0',
  componentManifestVersion: COMPONENT_MANIFEST_VERSION,
  policy: [
    'Tenant changes are permissionless when they stay inside approved guardrails.',
    'Use an approved shadcn primitive before proposing bespoke interaction code.',
    'Trusted open-source packages are allowed for documented capability gaps when license, audit, and accessibility checks pass.',
    'A bespoke primitive requires a documented capability gap.',
    'Proposal tools write only inside component-system/proposals.',
    'CMS records never contain executable JavaScript or component paths.',
    'Tenant releases require a passing guardrail check; platform releases require a human-approved Directus proposal.',
    'Production deployment remains a separate CI/release action.',
  ],
  sequence: [
    'read_brand_contract',
    'list_components',
    'get_guardrail_policy',
    'check_component_guardrails',
    'start_component_proposal',
    'scaffold_component',
    'validate_component',
    'create_preview',
    'prepare_tenant_release or prepare_component_release',
    'human approval in Directus when platform risk is present',
    'publish_approved_component',
  ],
};

function textResult(value) {
  return {
    content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
  };
}

function proposalPath(id, filename = 'proposal.json') {
  if (!/^[a-zA-Z0-9_-]+$/.test(String(id))) throw new Error('Invalid proposal id.');
  const proposalDirectory = path.resolve(proposalsRoot, String(id));
  if (!proposalDirectory.startsWith(`${path.resolve(proposalsRoot)}${path.sep}`)) {
    throw new Error('Proposal path escapes the allowed workspace.');
  }
  return path.join(proposalDirectory, filename);
}

async function readJson(filename) {
  return JSON.parse(await fs.readFile(filename, 'utf8'));
}

async function writeJson(filename, value) {
  await fs.mkdir(path.dirname(filename), { recursive: true });
  await fs.writeFile(filename, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function directusRequest(pathname, options = {}) {
  if (!directusToken) throw new Error('Directus component-factory credentials are not configured.');
  const response = await fetch(`${directusUrl}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${directusToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.errors?.[0]?.message || response.statusText);
  }
  return body?.data;
}

async function liveBrandContract() {
  if (!directusToken) return brandFromRecords(DEFAULT_BRAND_RECORDS);
  const query = new URLSearchParams({
    fields: 'setting_key,value',
    limit: '-1',
  });
  const records = await directusRequest(`/items/brand_settings?${query}`);
  return brandFromRecords(records);
}

async function localProposal(id) {
  return readJson(proposalPath(id));
}

async function updateProposal(id, changes, directusChanges = changes) {
  const current = await localProposal(id);
  const next = { ...current, ...changes, updated_at: new Date().toISOString() };
  if (directusToken && current.directus_id) {
    await directusRequest(`/items/component_proposals/${current.directus_id}`, {
      method: 'PATCH',
      body: JSON.stringify(directusChanges),
    });
  }
  await writeJson(proposalPath(id), next);
  return next;
}

function normalizePackageName(value) {
  return String(value || '').trim().replace(/^npm:/, '').toLowerCase();
}

function classifyGuardrails(input = {}) {
  const request = String(input.request || '');
  const fields = Array.isArray(input.fields) ? input.fields : [];
  const slots = Array.isArray(input.slots) ? input.slots : [];
  const trusted_packages = Array.isArray(input.trusted_packages) ? input.trusted_packages.map(normalizePackageName).filter(Boolean) : [];
  const checks = [];
  let risk = 'tenant';

  for (const signal of platformReviewSignals) {
    if (signal.pattern.test(request)) {
      risk = 'platform';
      checks.push({ ok: false, scope: 'request', reason: signal.reason });
    }
  }

  const invalidSlots = slots.filter((slot) => !tenantSafeSlots.has(slot));
  checks.push({
    ok: invalidSlots.length === 0,
    scope: 'slots',
    reason: invalidSlots.length ? `Unsupported slots: ${invalidSlots.join(', ')}` : 'Slots are inside the tenant page-slot contract.',
  });
  if (invalidSlots.length) risk = 'platform';

  const invalidFields = fields.filter((field) => {
    const name = typeof field === 'string' ? field : field?.name;
    const type = String(typeof field === 'string' ? 'string' : field?.type || '').toLowerCase();
    return !/^[a-z][a-z0-9_]*$/.test(String(name || ''))
      || !tenantSafeFieldTypes.has(type)
      || /(^|_)renderer($|_)|component_path|(^|_)scripts?($|_)|(^|_)code($|_)/i.test(String(name || ''));
  });
  checks.push({
    ok: invalidFields.length === 0,
    scope: 'fields',
    reason: invalidFields.length
      ? `Fields include unsafe names or executable field types: ${invalidFields.map((field) => field?.name || String(field)).join(', ')}`
      : 'Fields are data-only and CMS-safe.',
  });
  if (invalidFields.length) risk = 'platform';

  const unknownPackages = trusted_packages.filter((pkg) => !trustedOpenSourcePackages[pkg]);
  checks.push({
    ok: unknownPackages.length === 0,
    scope: 'open_source',
    reason: unknownPackages.length
      ? `Packages need review before tenant use: ${unknownPackages.join(', ')}`
      : trusted_packages.length
        ? `Trusted package allowlist matched: ${trusted_packages.join(', ')}`
        : 'No external open-source package requested.',
  });
  if (unknownPackages.length) risk = 'platform';

  const hasAudio = /audio|podcast|player|playback/i.test(request)
    || fields.some((field) => /audio_url|episode|transcript/i.test(typeof field === 'string' ? field : field?.name));
  const hasMediaChrome = trusted_packages.includes('media-chrome');
  if (hasAudio) {
    checks.push({
      ok: hasMediaChrome,
      scope: 'media',
      reason: hasMediaChrome
        ? 'Podcast/audio playback uses the trusted Media Chrome package rather than arbitrary embeds.'
        : 'Podcast/audio playback needs a trusted media-control package or platform review.',
    });
    if (!hasMediaChrome) risk = 'platform';
  }

  return {
    mode: risk,
    allowed: checks.every((check) => check.ok) && risk === 'tenant',
    checks,
    trusted_packages: trusted_packages.map((pkg) => trustedOpenSourcePackages[pkg]).filter(Boolean),
  };
}

export function createComponentFactoryServer({
  clientId = process.env.COMPONENT_FACTORY_CLIENT_ID || 'local',
} = {}) {
  const workflowContext = {
    ...workflow,
    deployment: {
      client_id: clientId,
      isolation: clientId === 'local' ? 'local-development' : 'single-client',
    },
  };
  const server = new McpServer({
    name: 'made-with-these-hands-component-factory',
    version: '1.1.0',
  }, {
    instructions: [
      'Read component-factory://workflow before proposing a component.',
      'Use approved shadcn primitives first.',
      'Tenant-safe changes are permissionless after guardrail validation.',
      'Platform-risk changes require a human-approved Directus proposal.',
      `This deployment is restricted to client ${clientId}.`,
    ].join(' '),
  });

server.registerResource(
  'component-factory-workflow',
  'component-factory://workflow',
  {
    title: 'Governed component creation workflow',
    description: 'Portable instructions and safety boundaries for Claude, Codex, and other MCP clients.',
    mimeType: 'application/json',
  },
  async (uri) => ({
    contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(workflowContext, null, 2) }],
  }),
);

server.registerPrompt(
  'create-governed-component',
  {
    title: 'Create a governed website component',
    description: 'Initializes the proposal, validation, preview, and approval workflow.',
    argsSchema: {
      request: z.string().min(10),
    },
  },
  async ({ request }) => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `Follow component-factory://workflow for this request:\n\n${request}\n\nDo not publish without recorded human approval.`,
      },
    }],
  }),
);

server.registerTool(
  'get_workflow_context',
  {
    title: 'Get component workflow context',
    description: 'Returns the required sequence, shadcn-first policy, and release boundaries.',
    annotations: { readOnlyHint: true },
  },
  async () => textResult(workflowContext),
);

server.registerTool(
  'read_brand_contract',
  {
    title: 'Read brand contract',
    description: 'Returns the current machine-readable brand and component rules.',
    annotations: { readOnlyHint: true },
  },
  async () => textResult(await liveBrandContract()),
);

server.registerTool(
  'list_components',
  {
    title: 'List approved components',
    description: 'Returns the compile-time component registry and approved shadcn primitives.',
    annotations: { readOnlyHint: true },
  },
  async () => textResult(APPROVED_COMPONENTS),
);

server.registerTool(
  'get_guardrail_policy',
  {
    title: 'Get tenant guardrail policy',
    description: 'Returns permissionless tenant rules, trusted open-source packages, and platform-review boundaries.',
    annotations: { readOnlyHint: true },
  },
  async () => textResult({
    model: 'permissionless-inside-guardrails',
    tenantSafe: [
      'Use approved components and variants.',
      'Create and reorder page blocks inside tenant-owned Directus records.',
      'Use trusted open-source packages for documented capability gaps.',
      'Store only data, URLs, relations, and presentation variants in Directus.',
      'Publish tenant-owned content when the Directus role permits it.',
    ],
    platformReview: [
      'Unknown third-party packages.',
      'Executable JavaScript, renderer paths, iframes, or script embeds in CMS data.',
      'Secrets, environment variables, admin roles, billing, and permission changes.',
      'Destructive schema or collection changes.',
      'Shared component-registry publishing across tenants.',
    ],
    trustedOpenSourcePackages,
  }),
);

server.registerTool(
  'check_component_guardrails',
  {
    title: 'Check component guardrails',
    description: 'Classifies a component request as tenant-safe or platform-review before scaffolding or release.',
    inputSchema: {
      request: z.string().min(1),
      component_key: z.string().regex(/^block_[a-z0-9_]+$/).optional(),
      slots: z.array(z.enum(['main', 'before-content', 'after-content', 'related-content'])).default([]),
      fields: z.array(z.record(z.string(), z.unknown())).default([]),
      trusted_packages: z.array(z.string()).default([]),
    },
    annotations: { readOnlyHint: true },
  },
  async (input) => textResult(classifyGuardrails(input)),
);

server.registerTool(
  'start_component_proposal',
  {
    title: 'Start component proposal',
    description: 'Creates a non-production proposal locally and, when configured, in Directus.',
    inputSchema: {
      request: z.string().min(10),
      component_key: z.string().regex(/^block_[a-z0-9_]+$/),
      requested_by: z.string().optional(),
      guardrail_mode: z.enum(['tenant', 'platform']).optional(),
    },
    annotations: { destructiveHint: false, idempotentHint: false },
  },
  async ({ request, component_key, requested_by, guardrail_mode }) => {
    const id = crypto.randomUUID();
    const proposal = {
      id,
      client_id: clientId,
      request,
      component_key,
      requested_by: requested_by || 'MCP client',
      guardrail_mode: guardrail_mode || 'tenant',
      status: 'proposed',
      brand_contract_version: (await liveBrandContract()).component_contract.version,
      created_at: new Date().toISOString(),
    };
    if (directusToken) {
      const created = await directusRequest('/items/component_proposals', {
        method: 'POST',
        body: JSON.stringify({
          tenant: clientId,
          request,
          component_key,
          requested_by: proposal.requested_by,
          brand_contract_version: proposal.brand_contract_version,
        }),
      });
      proposal.directus_id = created.id;
    }
    await writeJson(proposalPath(id), proposal);
    return textResult(proposal);
  },
);

server.registerTool(
  'scaffold_component',
  {
    title: 'Scaffold proposed component',
    description: 'Writes a declarative component contract into the proposal workspace; it cannot edit production source.',
    inputSchema: {
      proposal_id: z.string().min(1),
      label: z.string().min(1),
      description: z.string().min(1),
      variants: z.array(z.string()).default([]),
      slots: z.array(z.enum(['main', 'before-content', 'after-content', 'related-content'])).min(1),
      primitives: z.array(z.string()).min(1),
      trusted_packages: z.array(z.string()).default([]),
      fields: z.array(z.record(z.string(), z.unknown())).min(1),
      accessibility: z.array(z.string()).min(1),
      limits: z.record(z.string(), z.unknown()).default({}),
      bespoke_gap: z.string().optional(),
    },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  async (input) => {
    const proposal = await localProposal(input.proposal_id);
    const primitives = input.primitives.map((entry) => entry.replace(/^shadcn:/, ''));
    const unsupported = primitives.filter((primitive) => !allowedPrimitives.has(primitive));
    if (unsupported.length) throw new Error(`Unsupported shadcn primitives: ${unsupported.join(', ')}`);
    const guardrail = classifyGuardrails({
      request: proposal.request,
      component_key: proposal.component_key,
      slots: input.slots,
      fields: input.fields,
      trusted_packages: input.trusted_packages,
    });
    if (guardrail.mode === 'platform' && proposal.guardrail_mode !== 'platform') {
      throw new Error('This component request crosses tenant guardrails and must be started in platform mode.');
    }
    if (!primitives.length && !input.bespoke_gap) {
      throw new Error('A documented shadcn capability gap is required for bespoke interaction code.');
    }
    const definition = {
      collection: proposal.component_key,
      label: input.label,
      description: input.description,
      status: 'proposed',
      version: '0.1.0',
      renderer: `${input.label.replace(/[^a-zA-Z0-9]/g, '')}Block`,
      primitives: primitives.map((primitive) => `shadcn:${primitive}`),
      trustedOpenSource: guardrail.trusted_packages,
      variants: input.variants,
      slots: input.slots,
      fields: input.fields,
      accessibility: input.accessibility,
      limits: input.limits,
      bespoke_gap: input.bespoke_gap || null,
      guardrail,
    };
    await writeJson(proposalPath(input.proposal_id, 'component.json'), definition);
    await writeJson(proposalPath(input.proposal_id, 'renderer-plan.json'), {
      imports: [...definition.primitives, ...definition.trustedOpenSource.map((entry) => `npm:${entry.package}`)],
      sourceBoundary: `component-system/proposals/${input.proposal_id}`,
      cmsExecutableContent: false,
      nextStep: 'Implement and review the renderer inside this proposal workspace.',
    });
    const updated = await updateProposal(input.proposal_id, {
      status: 'testing',
      proposal: definition,
      guardrail,
    });
    return textResult(updated);
  },
);

server.registerTool(
  'validate_component',
  {
    title: 'Validate component',
    description: 'Runs fixed brand, manifest, and component test commands. No user-supplied command is executed.',
    inputSchema: {
      proposal_id: z.string().min(1),
    },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  async ({ proposal_id }) => {
    await localProposal(proposal_id);
    const commands = [
      ['npm', ['run', 'components:validate']],
      ['npm', ['run', 'components:validate-live']],
      ['npm', ['run', 'components:test']],
      ['npm', ['audit', '--audit-level=high']],
      ['npm', ['run', 'build']],
      ['npm', ['run', 'components:smoke']],
    ];
    const results = [];
    for (const [command, args] of commands) {
      try {
        const { stdout, stderr } = await execFileAsync(command, args, {
          cwd: root,
          timeout: 120000,
          windowsHide: true,
        });
        results.push({ command: `${command} ${args.join(' ')}`, ok: true, output: `${stdout}${stderr}`.trim() });
      } catch (error) {
        results.push({ command: `${command} ${args.join(' ')}`, ok: false, output: `${error.stdout || ''}${error.stderr || error.message}`.trim() });
      }
    }
    const ok = results.every((result) => result.ok);
    const updated = await updateProposal(proposal_id, {
      status: ok ? 'awaiting_approval' : 'testing',
      validation_summary: { ok, results, checked_at: new Date().toISOString() },
    });
    return textResult(updated.validation_summary);
  },
);

server.registerTool(
  'create_preview',
  {
    title: 'Create component preview',
    description: 'Assigns the safe local proposal preview URL; it does not deploy.',
    inputSchema: {
      proposal_id: z.string().min(1),
    },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  async ({ proposal_id }) => {
    const preview_url = `${siteUrl}/brand/proposals/${proposal_id}`;
    await updateProposal(proposal_id, { preview_url });
    return textResult({ proposal_id, preview_url });
  },
);

server.registerTool(
  'prepare_component_release',
  {
    title: 'Prepare component release',
    description: 'Creates a reviewable release manifest after validation; it does not publish or deploy.',
    inputSchema: {
      proposal_id: z.string().min(1),
    },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  async ({ proposal_id }) => {
    const proposal = await localProposal(proposal_id);
    if (!proposal.validation_summary?.ok) throw new Error('Successful validation is required before release preparation.');
    const release = {
      proposal_id,
      component_key: proposal.component_key,
      status: 'awaiting_human_approval',
      requiredGates: ['Directus approval', 'reviewed source change', 'production build', 'CI deployment'],
      prepared_at: new Date().toISOString(),
    };
    await writeJson(proposalPath(proposal_id, 'release.json'), release);
    return textResult(release);
  },
);

server.registerTool(
  'prepare_tenant_release',
  {
    title: 'Prepare tenant release',
    description: 'Creates a tenant-scoped release manifest without human approval when validation and guardrails pass.',
    inputSchema: {
      proposal_id: z.string().min(1),
    },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  async ({ proposal_id }) => {
    const proposal = await localProposal(proposal_id);
    if (!proposal.validation_summary?.ok) throw new Error('Successful validation is required before tenant release preparation.');
    if (proposal.guardrail?.mode !== 'tenant' || proposal.guardrail?.allowed !== true) {
      throw new Error('Tenant release requires a passing tenant guardrail check.');
    }
    const release = {
      proposal_id,
      component_key: proposal.component_key,
      status: 'ready_for_tenant_install',
      approval: 'not_required_inside_guardrails',
      guardrail_mode: 'tenant',
      requiredGates: ['guardrail check', 'reviewed source change', 'production build', 'tenant deployment'],
      prepared_at: new Date().toISOString(),
    };
    await writeJson(proposalPath(proposal_id, 'tenant-release.json'), release);
    await updateProposal(
      proposal_id,
      {
        status: 'ready_for_tenant_install',
        tenant_release: release,
      },
      { status: 'ready_for_tenant_install' },
    );
    return textResult(release);
  },
);

server.registerTool(
  'publish_approved_component',
  {
    title: 'Publish approved component',
    description: 'Marks an already-compiled component release as publishable only after Directus human approval. Deployment remains in CI.',
    inputSchema: {
      proposal_id: z.string().min(1),
    },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  async ({ proposal_id }) => {
    if (!directusToken) throw new Error('Directus approval cannot be verified without component-factory credentials.');
    const local = await localProposal(proposal_id);
    if (!local.directus_id) throw new Error('This proposal has no Directus approval record.');
    const proposal = await directusRequest(`/items/component_proposals/${local.directus_id}?fields=*`);
    if (proposal.status !== 'approved' || proposal.approval?.approved !== true) {
      throw new Error('Directus proposal is not human-approved.');
    }
    const component = componentByCollection(proposal.component_key);
    if (!component || component.status !== 'approved') {
      throw new Error('The component is not present in the compile-time approved manifest.');
    }
    const published = await updateProposal(
      proposal_id,
      {
        status: 'published',
        published_at: new Date().toISOString(),
      },
      { status: 'published' },
    );
    return textResult({
      proposal_id,
      component: component.collection,
      status: published.status,
      deployment: 'Ready for the configured CI/release workflow.',
    });
  },
);

  return server;
}

export async function ensureComponentFactoryStorage() {
  await fs.mkdir(proposalsRoot, { recursive: true });
}

const isEntrypoint = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isEntrypoint) {
  await ensureComponentFactoryStorage();
  const server = createComponentFactoryServer();
  await server.connect(new StdioServerTransport());
}
