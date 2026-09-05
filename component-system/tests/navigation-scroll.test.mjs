import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('client-side page navigation resets scroll while section anchors remain native', () => {
  const source = fs.readFileSync('app/legacy-runtime.jsx', 'utf8');
  const resetCalls = source.match(/scrollToPageTop\(\);/g) || [];

  assert.equal(resetCalls.length, 3, 'link, programmatic, and history navigation must reset scroll');
  assert.match(source, /window\.scrollTo\(\{ top: 0, left: 0, behavior: 'instant' \}\)/);
  assert.match(source, /a\[data-page\], a\[href\^="\/\?page="\]/);
  assert.doesNotMatch(source, /a\[href\^="#"\]/);
});
