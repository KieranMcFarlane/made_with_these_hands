'use client';

import * as React from 'react';

const pagePrefixes = ['Shop', 'Product', 'Maker', 'Hugh', 'Artists', 'Blog', 'Podcast', 'Post', 'Craft', 'Comm', 'EP'];

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function labelForSection(rawLabel) {
  const exactLabel = String(rawLabel || '').replace(/^\d+\s*/, '').trim();
  const exactLabels = {
    'Blog Grid': 'Articles',
    'Podcast Archive Head': 'Overview',
    'Podcast Archive List': 'Episodes',
    'EP Products': 'Objects',
    'Shop Grid': 'Objects',
    Product: 'Overview',
    Shop: 'Objects',
  };
  if (exactLabels[exactLabel]) return exactLabels[exactLabel];

  let label = exactLabel;

  for (const prefix of pagePrefixes) {
    if (label.startsWith(`${prefix} `)) {
      label = label.slice(prefix.length + 1).trim();
      break;
    }
  }

  return ({
    Head: 'Overview',
    Hero: 'Overview',
    Title: 'Overview',
    Grid: 'Items',
    List: 'List',
    'Archive List': 'Episodes',
    Body: 'Story',
    More: 'More',
    Insert: 'Note',
    Past: 'Past work',
    Form: 'Enquire',
    Comments: 'Comments',
  })[label] || label;
}

function readSections() {
  const root = document.getElementById('root');
  if (!root) return [];

  const isScrollable = document.documentElement.scrollHeight > window.innerHeight + 160;
  if (!isScrollable) return [];

  return Array.from(root.querySelectorAll('[data-screen-label]'))
    .map((section, index) => {
      const rawLabel = section.getAttribute('data-screen-label');
      const label = labelForSection(rawLabel);
      if (!label) return null;

      if (!section.id) {
        section.id = `mwth-${slugify(rawLabel)}-${index + 1}`;
      }

      return {
        id: section.id,
        label,
        href: `#${section.id}`,
      };
    })
    .filter(Boolean);
}

export default function PageToggle() {
  const [sections, setSections] = React.useState([]);

  React.useEffect(() => {
    let updateTimer;
    const updateSections = () => {
      window.clearTimeout(updateTimer);
      updateTimer = window.setTimeout(() => {
        setSections(readSections());
      }, 60);
    };

    const originalPushState = window.history.pushState;
    window.history.pushState = function pushState(...args) {
      const result = originalPushState.apply(this, args);
      window.dispatchEvent(new Event('mwth:navigation'));
      return result;
    };

    const observer = new MutationObserver(updateSections);
    const root = document.getElementById('root');
    if (root) observer.observe(root, { childList: true, subtree: true });

    updateSections();
    window.addEventListener('resize', updateSections);
    window.addEventListener('popstate', updateSections);
    window.addEventListener('mwth:navigation', updateSections);

    return () => {
      window.clearTimeout(updateTimer);
      observer.disconnect();
      window.history.pushState = originalPushState;
      window.removeEventListener('resize', updateSections);
      window.removeEventListener('popstate', updateSections);
      window.removeEventListener('mwth:navigation', updateSections);
    };
  }, []);

  if (sections.length < 2) return null;

  return (
    <nav className="page-toggle" id="pageToggle" aria-label="On this page">
      {sections.map(({ id, label, href }) => (
        <a
          key={id}
          href={href}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
