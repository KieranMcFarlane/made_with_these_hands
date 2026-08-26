import fs from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';
import { APPROVED_COMPONENT_COLLECTIONS } from '../component-system/components.mjs';

const root = new URL('../', import.meta.url);
const schema = JSON.parse(await fs.readFile(new URL('component-system/schemas/migration-intake.schema.json', root), 'utf8'));
const target = process.argv[2] || 'handover/migration-intake.example.json';
const intakeUrl = new URL(target, root);
const intake = JSON.parse(await fs.readFile(intakeUrl, 'utf8'));
const validate = new Ajv2020({ allErrors: true }).compile(schema);
const errors = [];

if (!validate(intake)) {
  for (const error of validate.errors || []) {
    errors.push(`${error.instancePath || '/'} ${error.message}`);
  }
}

const approved = new Set(APPROVED_COMPONENT_COLLECTIONS);
for (const mapping of intake.component_mapping || []) {
  if (!approved.has(mapping.approved_component)) {
    errors.push(`${mapping.source_section} maps to unapproved component ${mapping.approved_component}.`);
  }
  if (mapping.new_proposal_needed && !intake.proposed_new_components?.length) {
    errors.push(`${mapping.source_section} needs a proposal but proposed_new_components is empty.`);
  }
}

const paths = new Set((intake.routes || []).map((route) => route.path));
if (!paths.has('/')) errors.push('Route inventory must include the home route `/`.');
if (![...paths].some((path) => path.includes('[slug]') || path.includes(':slug'))) {
  errors.push('Route inventory should include at least one structured detail route.');
}

const collections = new Set((intake.structured_content || []).map((entry) => entry.collection));
for (const required of ['site_pages', 'brand_settings']) {
  if (!collections.has(required) && required === 'site_pages') {
    errors.push('Structured content must include site_pages.');
  }
}

const roles = new Set((intake.permissions || []).map((entry) => entry.role.toLowerCase()));
for (const requiredRole of ['site runtime', 'directus mcp user', 'factory service']) {
  if (!roles.has(requiredRole)) errors.push(`Permissions must include ${requiredRole}.`);
}

const acceptance = intake.acceptance || {};
const incomplete = Object.entries(acceptance)
  .filter(([, value]) => value !== true)
  .map(([key]) => key);
if (incomplete.length) {
  errors.push(`Acceptance checklist has incomplete items: ${incomplete.join(', ')}.`);
}

if (errors.length) {
  console.error(`Migration intake validation failed for ${target}:`);
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Migration intake is valid: ${target}`);
