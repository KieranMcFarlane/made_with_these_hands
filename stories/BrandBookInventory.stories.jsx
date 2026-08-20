import { COMPONENT_INVENTORY_COUNT, COMPONENT_INVENTORY_GROUPS } from '../app/component-inventory';

const meta = {
  title: 'MWTH/Brand Book/Component Inventory',
  parameters: {
    docs: {
      description: {
        component: 'A Storybook view of the Brand Book component inventory: site templates, approved blocks, data-backed listings, and interactive modules.',
      },
    },
  },
};

export default meta;

function InventorySurface() {
  return (
    <main style={{ padding: 'clamp(32px, 6vw, 88px)' }}>
      <p style={{
        fontFamily: 'var(--mono)',
        fontSize: 10,
        letterSpacing: '0.14em',
        margin: '0 0 12px',
        textTransform: 'uppercase',
      }}
      >
        Brand book / component inventory
      </p>
      <h1 style={{
        fontFamily: 'var(--serif)',
        fontSize: 'clamp(48px, 8vw, 108px)',
        fontWeight: 400,
        letterSpacing: '-0.04em',
        lineHeight: 0.92,
        margin: '0 0 28px',
        maxWidth: '12ch',
      }}
      >
        Approved parts, clear boundaries.
      </h1>
      <p style={{ color: 'var(--ink-60)', fontSize: 18, lineHeight: 1.6, maxWidth: 720 }}>
        {COMPONENT_INVENTORY_COUNT} documented components and templates, grouped by how the owner
        edits them and how Codex is allowed to extend them.
      </p>
      <div style={{ display: 'grid', gap: 28, marginTop: 48 }}>
        {COMPONENT_INVENTORY_GROUPS.map((group) => (
          <section
            key={group.key}
            style={{
              borderTop: '1px solid var(--rule)',
              display: 'grid',
              gap: 24,
              gridTemplateColumns: 'minmax(220px, 0.35fr) minmax(0, 1fr)',
              paddingTop: 22,
            }}
          >
            <div>
              <h2 style={{
                fontFamily: 'var(--serif)',
                fontSize: 34,
                fontWeight: 500,
                lineHeight: 1,
                margin: '0 0 10px',
              }}
              >
                {group.title}
              </h2>
              <p style={{ color: 'var(--ink-60)', lineHeight: 1.55, margin: 0 }}>
                {group.description}
              </p>
            </div>
            <div style={{ display: 'grid', gap: 0 }}>
              {group.components.map((component) => (
                <article
                  key={`${group.key}-${component.name}`}
                  style={{
                    alignItems: 'baseline',
                    borderBottom: '1px solid var(--rule)',
                    display: 'grid',
                    gap: 18,
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(160px, 0.35fr) 120px',
                    padding: '13px 0',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 500 }}>
                      {component.name}
                    </strong>
                    <span style={{ color: 'var(--ink-60)', fontSize: 13 }}>{component.source}</span>
                  </div>
                  <code style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{component.directus}</code>
                  <span style={{
                    border: '1px solid var(--rule)',
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    padding: '5px 7px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }}
                  >
                    {component.status}
                  </span>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export const Inventory = {
  render: () => <InventorySurface />,
};
