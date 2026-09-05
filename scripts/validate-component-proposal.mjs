#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const proposalId = process.argv[2];
assert.match(proposalId || '', /^[a-zA-Z0-9_-]+$/, 'A safe proposal id is required.');

const root = process.cwd();
const directory = path.join(root, 'component-system', 'proposals', proposalId);
const read = async (filename) => fs.readFile(path.join(directory, filename), 'utf8');
const proposal = JSON.parse(await read('proposal.json'));
const component = JSON.parse(await read('component.json'));
const rendererPlan = JSON.parse(await read('renderer-plan.json'));
const preview = await read('preview.jsx');
const styles = await read('preview.module.css');
const route = await fs.readFile(path.join(root, 'app', 'brand', 'proposals', '[id]', 'page.jsx'), 'utf8');

assert.equal(component.collection, proposal.component_key, 'Component key differs from proposal.');
assert.ok(component.label && !component.label.includes('_'), 'A human-readable component label is required.');
assert.equal(rendererPlan.cmsExecutableContent, false, 'Executable CMS content is forbidden.');
assert.match(rendererPlan.sourceBoundary, new RegExp(proposalId));
assert.match(route, new RegExp(proposal.component_key), 'The governed preview route is not wired to this proposal.');
assert.ok(preview.length > 100, 'The proposal preview is not implemented.');
assert.ok(styles.length > 100, 'The proposal preview styles are not implemented.');
assert.doesNotMatch(preview, /<script|<iframe|dangerouslySetInnerHTML|javascript:/i, 'Unsafe executable preview content detected.');

console.log(JSON.stringify({
  ok: true,
  proposal_id: proposalId,
  component_key: proposal.component_key,
  label: component.label,
  preview_route: `/brand/proposals/${proposalId}`,
}, null, 2));
