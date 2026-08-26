import '../app/globals.css';
import {
  DEFAULT_BRAND_RECORDS,
  brandCssVariables,
  brandFromRecords,
} from '../lib/brand-settings.mjs';

const brand = brandFromRecords(DEFAULT_BRAND_RECORDS);
const brandVars = brandCssVariables(brand);

export const decorators = [
  (Story) => (
    <div
      data-brand-contract={brand.component_contract.version}
      style={{ ...brandVars, minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)' }}
    >
      <Story />
    </div>
  ),
];

export const parameters = {
  a11y: {
    test: 'error',
  },
  backgrounds: {
    default: 'paper',
    values: [
      { name: 'paper', value: '#f4efe6' },
      { name: 'paper-2', value: '#ece6d9' },
      { name: 'ink', value: '#1b1918' },
    ],
  },
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
  layout: 'fullscreen',
};
