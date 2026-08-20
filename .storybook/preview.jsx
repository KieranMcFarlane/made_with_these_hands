import '../app/globals.css';

const brandVars = {
  '--paper': '#f4efe6',
  '--paper-2': '#ece6d9',
  '--paper-3': '#e3ddcf',
  '--ink': '#1b1918',
  '--ink-80': '#2e2a27',
  '--ink-60': '#5a534d',
  '--ink-40': '#8a827a',
  '--ink-20': '#c6beb2',
  '--rule': '#cfc6b5',
  '--accent': '#2a3f4a',
  '--white': '#faf6ec',
  '--serif': '"Cormorant Garamond", "EB Garamond", Georgia, "Times New Roman", serif',
  '--sans': '"Inter Tight", "Helvetica Neue", Helvetica, Arial, sans-serif',
  '--mono': '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
};

export const decorators = [
  (Story) => (
    <div style={{ ...brandVars, minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)' }}>
      <Story />
    </div>
  ),
];

export const parameters = {
  a11y: {
    test: 'todo',
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
