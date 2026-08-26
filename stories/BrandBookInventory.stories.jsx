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
    <main className="mwth-inventory" style={{ padding: 'clamp(32px, 6vw, 88px)' }}>
      <style>{`
        .mwth-inventory-group {
          border-top: 1px solid var(--rule);
          display: grid;
          gap: 24px;
          grid-template-columns: minmax(220px, 0.35fr) minmax(0, 1fr);
          padding-top: 22px;
        }
        .mwth-inventory-row {
          align-items: center;
          border-bottom: 1px solid var(--rule);
          display: grid;
          gap: 18px;
          grid-template-columns: minmax(190px, 1fr) minmax(150px, 0.35fr) 112px minmax(126px, auto);
          padding: 14px 0;
        }
        .mwth-inventory-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: flex-end;
        }
        .mwth-inventory-actions a {
          border: 1px solid var(--ink);
          color: var(--ink);
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.08em;
          padding: 6px 8px;
          text-decoration: none;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .mwth-inventory-actions a[data-surface='site'] {
          background: var(--ink);
          color: var(--paper);
        }
        .mwth-inventory-actions a:focus-visible,
        .mwth-inventory-actions a:hover {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        @media (max-width: 1100px) {
          .mwth-inventory-group { grid-template-columns: 1fr; }
          .mwth-inventory-row {
            grid-template-columns: minmax(0, 1fr) auto;
          }
          .mwth-inventory-row > code,
          .mwth-inventory-actions { grid-column: 1 / -1; }
          .mwth-inventory-actions { justify-content: flex-start; }
        }
      `}</style>
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
            className="mwth-inventory-group"
            key={group.key}
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
                  className="mwth-inventory-row"
                  key={`${group.key}-${component.name}`}
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
                  <div className="mwth-inventory-actions">
                    {component.instances.map((instance) => (
                      <a
                        aria-label={`${instance.label}: ${component.name}`}
                        data-surface={instance.surface}
                        href={instance.href}
                        key={`${component.name}-${instance.label}`}
                        rel={instance.surface === 'site' ? 'noreferrer' : undefined}
                        target={instance.surface === 'storybook' ? '_top' : '_blank'}
                      >
                        {instance.label}
                      </a>
                    ))}
                  </div>
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
