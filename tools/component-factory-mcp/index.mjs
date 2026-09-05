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
import { createValidationJobManager } from './validation-jobs.mjs';
import {
  humanLabel,
  lifecycleGuidance,
  resolveSemanticIntent,
  semanticDiff,
} from './semantics.mjs';

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
const approvedSpacingModes = ['compact', 'standard', 'generous'];
const defaultPresentationFields = brandFromRecords(DEFAULT_BRAND_RECORDS).component_contract.presentation.fields;
const rawPresentationField = /(?:^|_)(?:css|style|class_name|padding|margin|gap|inset)(?:$|_)/i;
const requiredValidationGates = [
  'contract',
  'live_contract',
  'behavior',
  'proposal_artifact',
  'storybook_accessibility',
  'dependencies',
  'production_build',
  'route_smoke',
];
const platformReviewSignals = [
  { pattern: /<script|javascript:|eval\(|new Function/i, reason: 'Executable script content is not allowed in CMS component contracts.' },
  { pattern: /\b(delete|drop|truncate)\b.*\b(collection|schema|table|field|permission)\b/i, reason: 'Destructive schema or permission changes need platform review.' },
  { pattern: /\b(env|secret|token|admin|permission|role)\b/i, reason: 'Secrets, roles, and admin permissions need platform review.' },
  { pattern: /\biframe|embed script|third-party script\b/i, reason: 'Embeds and third-party scripts need platform review unless explicitly allowlisted.' },
];

const workflow = {
  version: '1.3.0',
  componentManifestVersion: COMPONENT_MANIFEST_VERSION,
  policy: [
    'Tenant changes are permissionless when they stay inside approved guardrails.',
    'Use an approved shadcn primitive before proposing bespoke interaction code.',
    'Trusted open-source packages are allowed for documented capability gaps when license, audit, and accessibility checks pass.',
    'A bespoke primitive requires a documented capability gap.',
    'Proposal tools write only inside component-system/proposals.',
    'CMS records never contain executable JavaScript or component paths.',
    'CMS presentation fields use approved semantic tokens; raw CSS and numeric spacing are forbidden.',
    'Every component exposes compact, standard, and generous spacing states in Storybook.',
    'A proposal remains in testing until contract, live registry, behaviour, accessibility, Storybook, dependency, build, and route checks pass.',
    'Policy consumes structured semantic intent; explicit prohibitions are never treated as requested capabilities.',
    'Every mutation can provide an idempotency key and a dry-run semantic diff.',
    'Preview state distinguishes URL assignment, artifact verification, and HTTP reachability.',
    'Every new component must have a representative, reachable visual preview shown to the client before human approval is requested.',
    'Tenant releases require a passing guardrail check; platform releases require a human-approved Directus proposal.',
    'Production deployment remains a separate CI/release action.',
    'Client connection errors must distinguish invalid OAuth from transient gateway, discovery, or task-cache failures and give the minimum recovery step.',
  ],
  sequence: [
    'read_brand_contract',
    'list_components',
    'get_guardrail_policy',
    'resolve_semantic_intent',
    'check_component_guardrails',
    'start_component_proposal',
    'scaffold_component',
    'start_component_validation',
    'get_component_validation until complete',
    'create_preview',
    'show the reachable visual preview to the client and collect review feedback',
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

function clientProposal(proposal) {
  return {
    ...proposal,
    label: humanLabel(proposal),
    ...lifecycleGuidance(proposal),
  };
}

async function proposalDecisions(id) {
  try {
    return await readJson(proposalPath(id, 'decisions.json'));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function recordDecision(id, decision) {
  const decisions = await proposalDecisions(id);
  const entry = { id: crypto.randomUUID(), recorded_at: new Date().toISOString(), ...decision };
  await writeJson(proposalPath(id, 'decisions.json'), [...decisions, entry]);
  return entry;
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

async function runComponentValidation(proposalId) {
  const proposal = await localProposal(proposalId);
  let recordedApproval = null;
  if (directusToken && proposal.directus_id) {
    const directusProposal = await directusRequest(
      `/items/component_proposals/${proposal.directus_id}?fields=status,approval`,
    );
    if (directusProposal.status === 'approved' && directusProposal.approval?.approved === true) {
      recordedApproval = directusProposal.approval;
    }
  }
  const commands = [
    { gate: 'contract', command: 'npm', args: ['run', 'components:validate'] },
    { gate: 'live_contract', command: 'npm', args: ['run', 'components:validate-live'] },
    { gate: 'behavior', command: 'npm', args: ['run', 'components:test'] },
    { gate: 'proposal_artifact', command: 'node', args: ['scripts/validate-component-proposal.mjs', proposalId] },
    { gate: 'storybook_accessibility', command: 'npm', args: ['run', 'storybook:verify'] },
    { gate: 'dependencies', command: 'npm', args: ['audit', '--audit-level=high'] },
    { gate: 'production_build', command: 'npm', args: ['run', 'build'] },
    { gate: 'route_smoke', command: 'npm', args: ['run', 'components:smoke'] },
  ];
  const results = [];
  for (const { gate, command, args } of commands) {
    try {
      const { stdout, stderr } = await execFileAsync(command, args, {
        cwd: root,
        timeout: 120000,
        windowsHide: true,
      });
      results.push({ gate, command: `${command} ${args.join(' ')}`, ok: true, output: `${stdout}${stderr}`.trim() });
    } catch (error) {
      results.push({ gate, command: `${command} ${args.join(' ')}`, ok: false, output: `${error.stdout || ''}${error.stderr || error.message}`.trim() });
    }
  }
  const ok = results.every((result) => result.ok);
  const gates = Object.fromEntries(results.map(({ gate, ok: passed }) => [gate, passed]));
  const status = ok ? (recordedApproval ? 'approved' : 'awaiting_approval') : 'testing';
  const brandContractVersion = (await liveBrandContract()).component_contract.version;
  const validationSummary = { ok, gates, results, checked_at: new Date().toISOString() };
  const updated = await updateProposal(
    proposalId,
    {
      status,
      approval: recordedApproval || proposal.approval,
      brand_contract_version: brandContractVersion,
      validation_summary: validationSummary,
    },
    {
      ...(!recordedApproval || !ok ? { status } : {}),
      brand_contract_version: brandContractVersion,
      validation_summary: validationSummary,
    },
  );
  return updated.validation_summary;
}

const validationJobs = createValidationJobManager({
  proposalsRoot,
  runValidation: runComponentValidation,
});

function assertValidationProof(proposal) {
  if (!proposal.validation_summary?.ok) {
    throw new Error('Successful validation is required before release preparation.');
  }
  const missing = requiredValidationGates.filter((gate) => proposal.validation_summary?.gates?.[gate] !== true);
  if (missing.length) {
    throw new Error(`Validation proof is incomplete: ${missing.join(', ')}.`);
  }
}

function assertVisualPreviewProof(proposal) {
  if (!proposal.preview_url || proposal.preview?.artifact_verified !== true || proposal.preview?.reachable !== true) {
    throw new Error('A representative, reachable visual preview must be generated and reviewed before approval or release preparation.');
  }
}

function normalizePackageName(value) {
  return String(value || '').trim().replace(/^npm:/, '').toLowerCase();
}

function classifyGuardrails(input = {}) {
  const intent = resolveSemanticIntent(input.intent || input);
  const request = intent.policy_text;
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
      || /(^|_)renderer($|_)|component_path|(^|_)scripts?($|_)|(^|_)code($|_)/i.test(String(name || ''))
      || rawPresentationField.test(String(name || ''));
  });
  checks.push({
    ok: invalidFields.length === 0,
    scope: 'fields',
    reason: invalidFields.length
      ? `Fields include unsafe names or executable field types: ${invalidFields.map((field) => field?.name || String(field)).join(', ')}`
      : 'Fields are data-only and CMS-safe.',
  });
  if (invalidFields.length) risk = 'platform';

  const spacingField = fields.find((field) => field?.name === 'spacing');
  const spacingChoices = spacingField?.choices?.map((choice) => Array.isArray(choice) ? choice.at(-1) : choice);
  const spacingIsValid = !spacingField || (
    spacingField.type === 'string'
    && JSON.stringify(spacingChoices) === JSON.stringify(approvedSpacingModes)
  );
  checks.push({
    ok: spacingIsValid,
    scope: 'composition',
    reason: spacingIsValid
      ? 'Composition uses the approved semantic spacing vocabulary.'
      : 'The spacing field must expose compact, standard, and generous choices only.',
  });
  if (!spacingIsValid) risk = 'platform';
  for (const [name, rule] of Object.entries(defaultPresentationFields)) {
    if (name === 'spacing') continue;
    const field = fields.find((entry) => entry?.name === name);
    if (!field) continue;
    const choices = field.choices?.map((choice) => Array.isArray(choice) ? choice.at(-1) : choice);
    const valid = field.type === 'string' && JSON.stringify(choices) === JSON.stringify(rule.choices);
    checks.push({
      ok: valid,
      scope: 'presentation',
      reason: valid
        ? `${name} uses the approved semantic vocabulary.`
        : `${name} must expose only: ${rule.choices.join(', ')}.`,
    });
    if (!valid) risk = 'platform';
  }

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

  const hasAudio = intent.requested_capabilities.includes('audio_playback')
    || fields.some((field) => /audio_url/i.test(typeof field === 'string' ? field : field?.name));
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
    intent,
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
    version: '1.3.0',
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
        text: `Follow component-factory://workflow for this request:\n\n${request}\n\nGenerate and show the client a representative visual preview before requesting approval. Do not publish without recorded human approval.`,
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
  'resolve_semantic_intent',
  {
    title: 'Resolve semantic request intent',
    description: 'Separates requested capabilities, explicit prohibitions, lifecycle intent, targets, and presentation decisions before policy evaluation.',
    inputSchema: {
      request: z.string().min(1),
      operation: z.string().optional(),
      target: z.record(z.string(), z.unknown()).default({}),
      requested_capabilities: z.array(z.string()).default([]),
      explicitly_forbidden: z.array(z.string()).default([]),
      lifecycle: z.record(z.string(), z.unknown()).default({}),
      presentation: z.record(z.string(), z.unknown()).default({}),
      confidence: z.number().min(0).max(1).optional(),
    },
    annotations: { readOnlyHint: true, idempotentHint: true },
  },
  async (input) => textResult(resolveSemanticIntent(input)),
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
      intent: z.record(z.string(), z.unknown()).optional(),
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
      intent: z.record(z.string(), z.unknown()).optional(),
      idempotency_key: z.string().min(8).max(200).optional(),
      dry_run: z.boolean().default(false),
    },
    annotations: { destructiveHint: false, idempotentHint: false },
  },
  async ({ request, component_key, requested_by, guardrail_mode, intent: suppliedIntent, idempotency_key, dry_run }) => {
    const intent = resolveSemanticIntent({ request, ...(suppliedIntent || {}), target: { ...(suppliedIntent?.target || {}), component_key } });
    const id = idempotency_key
      ? `idem-${crypto.createHash('sha256').update(`${clientId}:${idempotency_key}`).digest('hex').slice(0, 24)}`
      : crypto.randomUUID();
    if (idempotency_key) {
      try {
        return textResult({ ...clientProposal(await localProposal(id)), idempotent_replay: true });
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
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
      intent,
      lifecycle: intent.lifecycle,
      idempotency_key: idempotency_key || null,
    };
    if (dry_run) {
      return textResult({ dry_run: true, would_create: clientProposal(proposal), semantic_diff: semanticDiff({}, proposal) });
    }
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
    await recordDecision(id, { type: 'intent_captured', summary: 'Initial structured request intent recorded.', intent });
    return textResult(clientProposal(proposal));
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
      expected_updated_at: z.string().optional(),
      dry_run: z.boolean().default(false),
    },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  async (input) => {
    const proposal = await localProposal(input.proposal_id);
    if (input.expected_updated_at && input.expected_updated_at !== proposal.updated_at) {
      throw new Error('Proposal changed since it was read. Refresh context before updating.');
    }
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
    const contract = await liveBrandContract();
    const presentationFields = contract.component_contract.presentation.fields;
    const semanticNames = Object.keys(presentationFields);
    const fields = input.fields.filter(({ name }) => !semanticNames.includes(name));
    fields.unshift(...semanticNames.map((name) => ({
      name,
      type: 'string',
      default: presentationFields[name].default,
      choices: presentationFields[name].choices.map((value) => [value.replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase()), value]),
      note: 'Approved semantic presentation choice. Raw CSS and arbitrary values are forbidden.',
    })));
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
      fields,
      accessibility: input.accessibility,
      limits: input.limits,
      bespoke_gap: input.bespoke_gap || null,
      guardrail,
    };
    const diff = semanticDiff(proposal.proposal || {}, definition);
    if (input.dry_run) {
      return textResult({
        dry_run: true,
        proposal_id: input.proposal_id,
        label: definition.label,
        semantic_diff: diff,
        would_set_status: 'testing',
        ...lifecycleGuidance({ ...proposal, proposal: definition, guardrail }),
      });
    }
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
    await recordDecision(input.proposal_id, {
      type: 'component_scaffolded',
      summary: `${definition.label} declarative contract recorded.`,
      semantic_diff: diff,
    });
    return textResult(clientProposal(updated));
  },
);

server.registerTool(
  'validate_component',
  {
    title: 'Validate component',
    description: 'Legacy synchronous validation. Prefer start_component_validation and poll get_component_validation to avoid client timeouts.',
    inputSchema: {
      proposal_id: z.string().min(1),
    },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  async ({ proposal_id }) => textResult(await runComponentValidation(proposal_id)),
);

server.registerTool(
  'start_component_validation',
  {
    title: 'Start component validation',
    description: 'Starts the fixed validation suite in the background and returns immediately with a durable job id.',
    inputSchema: {
      proposal_id: z.string().min(1),
    },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  async ({ proposal_id }) => {
    await localProposal(proposal_id);
    const job = await validationJobs.start(proposal_id);
    return textResult({
      ...job,
      poll_with: 'get_component_validation',
    });
  },
);

server.registerTool(
  'get_component_validation',
  {
    title: 'Get component validation',
    description: 'Returns the durable state and compact gate summary for a background validation job.',
    inputSchema: {
      proposal_id: z.string().min(1),
      job_id: z.string().min(1),
    },
    annotations: { readOnlyHint: true, idempotentHint: true },
  },
  async ({ proposal_id, job_id }) => textResult(await validationJobs.get(proposal_id, job_id)),
);

server.registerTool(
  'get_proposal_context',
  {
    title: 'Get proposal semantic context',
    description: 'Returns the active entity, structured intent, decisions, lifecycle, preview state, and permitted next actions.',
    inputSchema: { proposal_id: z.string().min(1) },
    annotations: { readOnlyHint: true, idempotentHint: true },
  },
  async ({ proposal_id }) => {
    const proposal = await localProposal(proposal_id);
    return textResult({ proposal: clientProposal(proposal), decisions: await proposalDecisions(proposal_id) });
  },
);

server.registerTool(
  'record_proposal_decision',
  {
    title: 'Record proposal decision',
    description: 'Appends a durable semantic decision such as pagination, crop behavior, responsive layout, or an explicit exclusion.',
    inputSchema: {
      proposal_id: z.string().min(1),
      type: z.enum(['content', 'presentation', 'accessibility', 'lifecycle', 'constraint']),
      summary: z.string().min(3),
      value: z.record(z.string(), z.unknown()).default({}),
      source: z.enum(['conversation', 'design_review', 'validation', 'owner']).default('conversation'),
      idempotency_key: z.string().min(8).max(200).optional(),
      dry_run: z.boolean().default(false),
    },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  async ({ proposal_id, idempotency_key, dry_run, ...decision }) => {
    const proposal = await localProposal(proposal_id);
    const decisions = await proposalDecisions(proposal_id);
    if (idempotency_key) {
      const existing = decisions.find((entry) => entry.idempotency_key === idempotency_key);
      if (existing) return textResult({ decision: existing, idempotent_replay: true, ...lifecycleGuidance(proposal) });
    }
    const candidate = { ...decision, idempotency_key: idempotency_key || null };
    if (dry_run) return textResult({ dry_run: true, would_append: candidate, semantic_diff: [{ field: 'decisions', from: decisions.length, to: decisions.length + 1 }] });
    const recorded = await recordDecision(proposal_id, candidate);
    return textResult({ decision: recorded, ...lifecycleGuidance(proposal) });
  },
);

server.registerTool(
  'preview_semantic_change',
  {
    title: 'Preview semantic change',
    description: 'Returns a dry-run field-level semantic diff without changing the proposal or CMS.',
    inputSchema: {
      proposal_id: z.string().min(1),
      before: z.record(z.string(), z.unknown()).default({}),
      after: z.record(z.string(), z.unknown()),
    },
    annotations: { readOnlyHint: true, idempotentHint: true },
  },
  async ({ proposal_id, before, after }) => {
    const proposal = await localProposal(proposal_id);
    return textResult({ dry_run: true, proposal_id, label: humanLabel(proposal), semantic_diff: semanticDiff(before, after), ...lifecycleGuidance(proposal) });
  },
);

server.registerTool(
  'create_preview',
  {
    title: 'Create component preview',
    description: 'Verifies the proposal artifact, assigns its preview URL, and checks HTTP reachability; it does not deploy.',
    inputSchema: {
      proposal_id: z.string().min(1),
    },
    annotations: { destructiveHint: false, idempotentHint: true },
  },
  async ({ proposal_id }) => {
    const proposal = await localProposal(proposal_id);
    assertValidationProof(proposal);
    await fs.access(proposalPath(proposal_id, 'preview.jsx'));
    const preview_url = `${siteUrl}/brand/proposals/${proposal_id}`;
    let responseStatus = null;
    let reachable = false;
    let error = null;
    try {
      const response = await fetch(preview_url, { signal: AbortSignal.timeout(5000) });
      const body = await response.text();
      responseStatus = response.status;
      reachable = response.ok && !body.includes('Component proposal not found');
      if (!reachable) error = response.ok ? 'The route did not render the proposal artifact.' : `HTTP ${response.status}`;
    } catch (caught) {
      error = caught instanceof Error ? caught.message : String(caught);
    }
    const preview = {
      status: reachable ? 'reachable' : 'unreachable',
      url_assigned: true,
      artifact_verified: true,
      reachable,
      http_status: responseStatus,
      checked_at: new Date().toISOString(),
      error,
    };
    const updated = await updateProposal(proposal_id, { preview_url, preview }, { preview_url });
    await recordDecision(proposal_id, { type: 'preview_checked', summary: reachable ? 'Proposal preview is reachable.' : 'Proposal preview is not reachable.', preview });
    return textResult({ proposal_id, label: humanLabel(updated), preview_url, preview, ...lifecycleGuidance(updated) });
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
    assertValidationProof(proposal);
    assertVisualPreviewProof(proposal);
    const approvalRecorded = proposal.status === 'approved' && proposal.approval?.approved === true;
    const release = {
      proposal_id,
      component_key: proposal.component_key,
      status: approvalRecorded ? 'approved_for_release' : 'awaiting_human_approval',
      approval: approvalRecorded ? proposal.approval : null,
      requiredGates: [
        ...(approvalRecorded ? [] : ['Directus approval']),
        'reviewed source change',
        'production build',
        'CI deployment',
      ],
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
    assertValidationProof(proposal);
    assertVisualPreviewProof(proposal);
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
    assertValidationProof(local);
    assertVisualPreviewProof(local);
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
