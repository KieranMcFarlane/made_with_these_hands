import { componentByCollection } from './components.mjs';

export const GENERIC_BLOCK_COLLECTION = 'site_sections';
export const GENERIC_BLOCK_SCHEMA_VERSION = 1;
export const GENERIC_BLOCK_MAX_BYTES = 65_536;

const EXECUTABLE_KEY = /(?:^|_)(?:component_path|renderer|renderer_path|script|source_code|javascript|html)(?:$|_)/i;
const EXECUTABLE_VALUE = /<script\b|javascript\s*:|data\s*:\s*text\/html/i;
const RAW_PRESENTATION_KEY = /(?:^|_)(?:css|style|class_name|padding|margin|gap|inset)(?:$|_)/i;
const APPROVED_SPACING = new Set(['compact', 'standard', 'generous']);

function assertDeclarative(value, path = 'data') {
  if (typeof value === 'string' && EXECUTABLE_VALUE.test(value)) {
    throw new Error(`${path} contains executable content.`);
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertDeclarative(entry, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, entry] of Object.entries(value)) {
    if (EXECUTABLE_KEY.test(key)) throw new Error(`${path}.${key} is not an allowed content field.`);
    if (RAW_PRESENTATION_KEY.test(key)) throw new Error(`${path}.${key} bypasses the approved presentation tokens.`);
    assertDeclarative(entry, `${path}.${key}`);
  }
}

export function validateGenericPageBlock(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new Error('Generic page block must be an object.');
  }
  const component = componentByCollection(record.component_key);
  if (!component || component.status !== 'approved') {
    throw new Error(`Component "${record.component_key || ''}" is not in the approved registry.`);
  }
  const schemaVersion = Number(record.schema_version || GENERIC_BLOCK_SCHEMA_VERSION);
  if (!Number.isInteger(schemaVersion) || schemaVersion < 1) {
    throw new Error('schema_version must be a positive integer.');
  }
  const data = record.data ?? {};
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Generic page block data must be an object.');
  }
  assertDeclarative(data);
  if (data.spacing !== undefined && !APPROVED_SPACING.has(data.spacing)) {
    throw new Error('data.spacing must be compact, standard, or generous.');
  }
  if (Buffer.byteLength(JSON.stringify(data), 'utf8') > GENERIC_BLOCK_MAX_BYTES) {
    throw new Error(`Generic page block data exceeds ${GENERIC_BLOCK_MAX_BYTES} bytes.`);
  }
  return { component, schemaVersion, data };
}

export function materializeGenericPageBlock(record) {
  const { component, schemaVersion, data } = validateGenericPageBlock(record);
  const common = Object.fromEntries(Object.entries(record).filter(([key]) => ![
    'component_key',
    'schema_version',
    'data',
    'source_block_collection',
    'source_block_id',
  ].includes(key)));
  return {
    componentKey: component.collection,
    schemaVersion,
    item: { ...common, ...data },
  };
}
