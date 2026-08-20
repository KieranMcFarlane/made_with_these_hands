import fs from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';
import {
  APPROVED_COMPONENT_COLLECTIONS,
  COMPONENTS,
  COMPONENT_MANIFEST_VERSION,
} from '../component-system/components.mjs';
import { activePalette, brandFromRecords } from '../lib/brand-settings.mjs';

const root = new URL('../', import.meta.url);
const schema = JSON.parse(await fs.readFile(new URL('component-system/schemas/component.schema.json', root), 'utf8'));
const validate = new Ajv2020({ allErrors: true }).compile(schema);
const errors = [];

for (const component of COMPONENTS) {
  if (!validate(component)) errors.push(`${component.collection}: ${JSON.stringify(validate.errors)}`);
  const directusFieldNames = component.directusFields.map(({ name }) => name);
  if (new Set(directusFieldNames).size !== directusFieldNames.length) {
    errors.push(`${component.collection} has duplicate Directus field contracts.`);
  }
}

const collections = COMPONENTS.map(({ collection }) => collection);
if (new Set(collections).size !== collections.length) errors.push('Component collection names must be unique.');

const renderers = COMPONENTS.map(({ renderer }) => renderer);
if (new Set(renderers).size !== renderers.length) errors.push('Renderer keys must be unique.');

const dispatcher = await fs.readFile(new URL('app/directus-blocks.jsx', root), 'utf8');
for (const collection of APPROVED_COMPONENT_COLLECTIONS) {
  if (!dispatcher.includes(`${collection}:`)) errors.push(`${collection} is missing from the compile-time renderer allowlist.`);
}

for (const requiredConsumer of [
  'lib/directus.js',
  'scripts/bootstrap-directus-mwth.mjs',
  'scripts/create-directus-mcp-user.mjs',
  'scripts/create-directus-site-token.mjs',
]) {
  const source = await fs.readFile(new URL(requiredConsumer, root), 'utf8');
  if (!source.includes('APPROVED_COMPONENT_COLLECTIONS')) {
    errors.push(`${requiredConsumer} does not consume the central component manifest.`);
  }
}

const slideshowSource = await fs.readFile(new URL('app/slideshow-block.jsx', root), 'utf8');
const slideshowLogicSource = await fs.readFile(new URL('lib/slideshow.mjs', root), 'utf8');
const directusPageStyles = await fs.readFile(new URL('app/directus-page.module.css', root), 'utf8');
const shadcnCarouselSource = await fs.readFile(new URL('components/ui/carousel.jsx', root), 'utf8');
const brandBookSource = await fs.readFile(new URL('app/brand/page.jsx', root), 'utf8');
const slideshowContract = COMPONENTS.find(({ collection }) => collection === 'block_slideshow');
for (const primitive of ['shadcn:carousel', 'shadcn:button']) {
  if (!slideshowContract?.primitives?.includes(primitive)) errors.push(`Slideshow must prefer ${primitive}.`);
}
for (const invariant of [
  "prefers-reduced-motion: reduce",
  "aria-label=\"Previous slide\"",
  "aria-label=\"Next slide\"",
  'shouldRunSlideshowAutoplay',
  'wrappedSlideIndex',
  "from '@/components/ui/button'",
  "from '@/components/ui/carousel'",
]) {
  if (!slideshowSource.includes(invariant)) errors.push(`Slideshow invariant missing: ${invariant}`);
}
for (const invariant of [
  'export const MAX_SLIDES = 12',
  'export const MINIMUM_AUTOPLAY_INTERVAL_MS = 4000',
  'value.slice(0, MAX_SLIDES)',
  'autoplay && !paused && !reducedMotion && slideCount > 1',
]) {
  if (!slideshowLogicSource.includes(invariant)) errors.push(`Slideshow logic invariant missing: ${invariant}`);
}
if (!shadcnCarouselSource.includes('aria-roledescription="carousel"')) {
  errors.push('The shadcn Carousel primitive is missing its carousel role.');
}
if (!brandBookSource.includes('<DirectusBlock')) {
  errors.push('The Brand Book is missing compile-time renderer previews.');
}
for (const collection of APPROVED_COMPONENT_COLLECTIONS) {
  if (!brandBookSource.includes(`collection: '${collection}'`)) {
    errors.push(`The Brand Book is missing a live ${collection} renderer preview.`);
  }
}

const slideshowStyleStart = directusPageStyles.indexOf('.slideshowBlock');
const slideshowStyleEnd = directusPageStyles.indexOf(".slot[data-slot='related-content']", slideshowStyleStart);
const slideshowStyles = directusPageStyles.slice(slideshowStyleStart, slideshowStyleEnd);
if (slideshowStyleStart < 0 || slideshowStyleEnd < 0) errors.push('Slideshow styles are not isolated for validation.');
if (/#[0-9a-fA-F]{3,8}\b/.test(slideshowStyles)) {
  errors.push('Slideshow styles contain a raw colour instead of an approved brand token.');
}

const brand = brandFromRecords();
const approvedCssVariables = new Set([
  ...Object.keys(activePalette(brand).tokens).map((token) => `--${token.replaceAll('_', '-')}`),
  '--serif',
  '--sans',
  '--mono',
]);
for (const [, variable] of slideshowStyles.matchAll(/var\((--[a-z0-9-]+)\)/g)) {
  if (!approvedCssVariables.has(variable)) errors.push(`Slideshow uses unapproved CSS token ${variable}.`);
}
for (const [, ratio] of slideshowStyles.matchAll(/aspect-ratio:\s*([0-9]+\s*\/\s*[0-9]+)/g)) {
  if (!brand.component_contract.image_ratios.includes(ratio)) {
    errors.push(`Slideshow uses unapproved image ratio ${ratio}.`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Component manifest ${COMPONENT_MANIFEST_VERSION} is valid (${COMPONENTS.length} components).`);
