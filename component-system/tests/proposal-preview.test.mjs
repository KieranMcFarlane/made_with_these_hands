import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const proposalId = '5adebafe-35e3-46f6-942f-2069fd47ac60';

test('archive portraits proposal has a concrete preview wired to its governed route', () => {
  const previewPath = path.join(root, 'component-system', 'proposals', proposalId, 'preview.jsx');
  const stylesPath = path.join(root, 'component-system', 'proposals', proposalId, 'preview.module.css');
  const route = fs.readFileSync(path.join(root, 'app', 'brand', 'proposals', '[id]', 'page.jsx'), 'utf8');
  const preview = fs.readFileSync(previewPath, 'utf8');

  assert.ok(fs.existsSync(stylesPath), 'proposal preview styles are missing');
  assert.match(route, /block_listing_archive_portraits/);
  assert.match(route, /ArchivePortraitsPreview/);
  assert.match(route, /proposal\.proposal\?\.label/);
  assert.doesNotMatch(route, /<h1[^>]*>\s*\{proposal\.component_key\}/);
  assert.match(preview, /aria-labelledby="archive-portraits-title"/);
  assert.match(preview, /aria-label={`View episode/);
  assert.match(preview, /naturalHeight > image\.naturalWidth/);
  assert.match(preview, /data-portrait=/);
  assert.match(preview, /const pageSize = 5/);
  assert.match(preview, /aria-label="Episode archive pages"/);
  assert.match(preview, /aria-current=\{page === pageNumber \? 'page'/);
  assert.match(preview, /aria-live="polite"/);
  assert.doesNotMatch(preview, /<script|iframe|dangerouslySetInnerHTML/i);
});
