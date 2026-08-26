import fs from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';
import { DEFAULT_BRAND_RECORDS, brandFromRecords } from '../lib/brand-settings.mjs';

const schemaUrl = new URL('../component-system/schemas/brand-contract.schema.json', import.meta.url);
const schema = JSON.parse(await fs.readFile(schemaUrl, 'utf8'));
const validate = new Ajv2020({ allErrors: true }).compile(schema);
const contract = brandFromRecords(DEFAULT_BRAND_RECORDS);

if (!validate(contract)) {
  console.error(validate.errors);
  process.exit(1);
}

console.log(`Brand contract ${contract.component_contract.version} is valid.`);
