'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, Search, X } from 'lucide-react';
import styles from './brand-book.module.css';

function searchableText(group, component) {
  return [
    group.title,
    group.description,
    component.name,
    component.source,
    component.directus,
    component.status,
  ].join(' ').toLowerCase();
}

export default function ComponentInventoryBrowser({ groups }) {
  const [activeGroup, setActiveGroup] = useState('all');
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => groups
    .filter((group) => activeGroup === 'all' || group.key === activeGroup)
    .map((group) => ({
      ...group,
      components: group.components.filter((component) => (
        !normalizedQuery || searchableText(group, component).includes(normalizedQuery)
      )),
    }))
    .filter((group) => group.components.length > 0), [activeGroup, groups, normalizedQuery]);

  const totalCount = groups.reduce((total, group) => total + group.components.length, 0);
  const resultCount = filteredGroups.reduce((total, group) => total + group.components.length, 0);

  return (
    <div className={styles.inventoryBrowser}>
      <div className={styles.inventoryTools}>
        <label className={styles.inventorySearch}>
          <span className={styles.visuallyHidden}>Search component inventory</span>
          <Search aria-hidden="true" size={17} strokeWidth={1.5} />
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search components or Directus"
            type="search"
            value={query}
          />
          {query && (
            <button
              aria-label="Clear component search"
              onClick={() => setQuery('')}
              title="Clear search"
              type="button"
            >
              <X aria-hidden="true" size={16} strokeWidth={1.5} />
            </button>
          )}
        </label>

        <div className={styles.inventoryFilters} aria-label="Filter components by responsibility">
          <button
            data-active={activeGroup === 'all'}
            onClick={() => setActiveGroup('all')}
            type="button"
          >
            All <span>{totalCount}</span>
          </button>
          {groups.map((group) => (
            <button
              data-active={activeGroup === group.key}
              key={group.key}
              onClick={() => setActiveGroup(group.key)}
              type="button"
            >
              {group.title} <span>{group.components.length}</span>
            </button>
          ))}
        </div>

        <p className={styles.inventoryResults} aria-live="polite">
          Showing {resultCount} of {totalCount} documented components
        </p>
      </div>

      {filteredGroups.length > 0 ? (
        <div className={styles.inventoryGroups}>
          {filteredGroups.map((group) => (
            <section className={styles.inventoryGroup} key={group.key}>
              <div className={styles.inventoryGroupHeading}>
                <div>
                  <p className={styles.eyebrow}>{String(group.components.length).padStart(2, '0')} parts</p>
                  <h3>{group.title}</h3>
                </div>
                <p>{group.description}</p>
              </div>
              <div className={styles.inventoryRows}>
                <div className={styles.inventoryColumnLabels} aria-hidden="true">
                  <span>Component</span>
                  <span>Content contract</span>
                  <span>Status</span>
                  <span>Proof</span>
                </div>
                {group.components.map((component) => (
                  <article className={styles.inventoryRow} key={`${group.key}-${component.name}`}>
                    <div className={styles.inventoryIdentity}>
                      <strong>{component.name}</strong>
                      <span>{component.source}</span>
                    </div>
                    <code>{component.directus}</code>
                    <span className={styles.statusBadge}>{component.status}</span>
                    <div className={styles.inventoryProofs}>
                      {component.instances.map((instance) => (
                        <a
                          data-surface={instance.surface}
                          href={instance.href}
                          key={`${component.name}-${instance.label}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {instance.label}
                          <ExternalLink aria-hidden="true" size={12} strokeWidth={1.5} />
                        </a>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.inventoryEmpty}>
          <p className={styles.eyebrow}>No matching parts</p>
          <h3>Try a component name, route, or Directus collection.</h3>
          <button onClick={() => { setQuery(''); setActiveGroup('all'); }} type="button">
            Reset inventory
          </button>
        </div>
      )}
    </div>
  );
}
