const capabilityPatterns = {
  audio_playback: /\b(?:audio|player|playback|autoplay)\b/i,
  scripts: /\b(?:scripts?|javascript|eval|iframe|embeds?)\b/i,
  schema_changes: /\b(?:schema|collection|field|migration)\s+(?:change|changes|edit|edits|update|updates|create|delete)/i,
  permissions: /\b(?:admin|permissions?|roles?|secrets?|tokens?|billing)\b/i,
  pagination: /\b(?:pagination|paginate|page size|pages?)\b/i,
  portrait_images: /\b(?:portrait|maker image|thumbnail)\b/i,
  internal_links: /\b(?:internal links?|ordinary links?|episode links?)\b/i,
};

const negation = /\b(?:no|not|never|without|do not|don't|must not|forbid|forbidden|exclude|excluding)\b/i;

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function clauses(request) {
  return String(request || '').split(/(?<=[.!?;])\s+|\n+/).map((part) => part.trim()).filter(Boolean);
}

const presentationLanguage = [
  [/(?:make it |go )?darker|dark section/i, { surface: 'ink' }],
  [/softer|less prominent/i, { surface: 'muted', tone: 'restrained' }],
  [/feature(?:d)?|hero treatment|stand out/i, { tone: 'feature' }],
  [/quieter|more restrained/i, { tone: 'restrained' }],
  [/high(?:er)? contrast|easier to read/i, { contrast: 'high' }],
  [/more (?:breathing room|space)|roomier/i, { spacing: 'generous' }],
  [/tighter|more compact|less space/i, { spacing: 'compact' }],
  [/keep (?:the )?faces? visible|portrait(?: image)?/i, { image_focus: 'top' }],
  [/cent(?:er|re)(?: the)? image|image.*cent(?:er|re)/i, { image_focus: 'center' }],
];

export function resolvePresentation(request, supplied = {}) {
  const inferred = {};
  for (const [pattern, values] of presentationLanguage) {
    if (pattern.test(String(request || ''))) Object.assign(inferred, values);
  }
  return { ...inferred, ...supplied };
}

export function resolveSemanticIntent(input = {}) {
  const request = String(input.request || '').trim();
  const requested = [...(input.requested_capabilities || [])];
  const forbidden = [...(input.explicitly_forbidden || [])];

  for (const clause of clauses(request)) {
    for (const [capability, pattern] of Object.entries(capabilityPatterns)) {
      if (!pattern.test(clause)) continue;
      (negation.test(clause) ? forbidden : requested).push(capability);
    }
  }

  const explicitlyForbidden = unique(forbidden);
  return {
    operation: input.operation || 'extend_component',
    target: input.target || {},
    requested_capabilities: unique(requested).filter((entry) => !explicitlyForbidden.includes(entry)),
    explicitly_forbidden: explicitlyForbidden,
    lifecycle: {
      content_status: input.lifecycle?.content_status || 'draft',
      publish: input.lifecycle?.publish === true,
      deploy: input.lifecycle?.deploy === true,
    },
    presentation: resolvePresentation(request, input.presentation || {}),
    source_request: request,
    policy_text: clauses(request).filter((clause) => !negation.test(clause)).join(' '),
    confidence: Number.isFinite(input.confidence) ? input.confidence : 1,
  };
}

export function semanticDiff(before = {}, after = {}) {
  const keys = unique([...Object.keys(before), ...Object.keys(after)]).sort();
  return keys.flatMap((field) => {
    const from = before[field];
    const to = after[field];
    return JSON.stringify(from) === JSON.stringify(to) ? [] : [{ field, from: from ?? null, to: to ?? null }];
  });
}

export function lifecycleGuidance(proposal = {}) {
  const validated = proposal.validation_summary?.ok === true;
  const approved = proposal.status === 'approved' && proposal.approval?.approved === true;
  const preview = proposal.preview || {};
  const next_allowed_actions = [];
  const blocking_actions = [];

  if (!proposal.proposal) next_allowed_actions.push('scaffold_component');
  else if (!validated) next_allowed_actions.push('start_component_validation');
  else if (preview.reachable !== true) next_allowed_actions.push('create_preview');
  else if (proposal.guardrail?.mode === 'tenant' && proposal.guardrail?.allowed) next_allowed_actions.push('prepare_tenant_release');
  else if (!approved) next_allowed_actions.push('request_human_approval');
  else next_allowed_actions.push('prepare_component_release', 'publish_approved_component');

  if (!validated) blocking_actions.push({ action: 'release', reason: 'Validation has not passed.' });
  if (proposal.guardrail?.mode === 'platform' && !approved) blocking_actions.push({ action: 'publish', reason: 'A separate human approval is required.' });
  if (proposal.lifecycle?.publish !== true) blocking_actions.push({ action: 'publish_content', reason: 'The recorded lifecycle intent is draft-only.' });
  if (proposal.lifecycle?.deploy !== true) blocking_actions.push({ action: 'deploy', reason: 'Deployment was not requested in the recorded lifecycle intent.' });

  return { next_allowed_actions, blocking_actions };
}

export function humanLabel(proposal = {}) {
  return proposal.proposal?.label || String(proposal.component_key || '')
    .replace(/^block_/, '').split('_').filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}
