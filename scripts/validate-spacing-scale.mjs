import fs from 'node:fs/promises';
import path from 'node:path';

const CSS_FILES = [
  'app/globals.css',
  'app/directus-page.module.css',
  'app/brand/brand-book.module.css',
];
const SPACING_PROPERTY = /^(?:margin|padding|gap|row-gap|column-gap|scroll-margin)(?:-[a-z]+)?$/;
const PX_VALUE = /(-?\d+(?:\.\d+)?)px/g;
const errors = [];

for (const file of CSS_FILES) {
  const source = await fs.readFile(file, 'utf8');
  for (const [index, line] of source.split('\n').entries()) {
    const match = line.match(/^\s*([a-z-]+):\s*([^;]+);/);
    if (!match || !SPACING_PROPERTY.test(match[1])) continue;

    for (const pixel of match[2].matchAll(PX_VALUE)) {
      const value = Number(pixel[1]);
      if (!Number.isInteger(value) || value % 4 !== 0) {
        errors.push(`${path.normalize(file)}:${index + 1} uses off-scale ${pixel[0]} in ${match[1]}.`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Fixed layout spacing follows the 4px grid.');
