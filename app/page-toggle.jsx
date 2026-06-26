'use client';

import * as React from 'react';

const homeSections = [
  ['opening', 'Opening', '#root'],
  ['about', 'Why', '#about'],
  ['craft', 'Craft Index', '#craft'],
  ['podcast', 'Podcast', '#podcast'],
  ['objects', 'Objects', '#shop'],
];

export default function PageToggle() {
  const [page, setPage] = React.useState('home');

  React.useEffect(() => {
    const readPage = () => {
      const params = new URLSearchParams(window.location.search);
      setPage(params.get('page') || 'home');
    };

    const originalPushState = window.history.pushState;
    window.history.pushState = function pushState(...args) {
      const result = originalPushState.apply(this, args);
      window.dispatchEvent(new Event('mwth:navigation'));
      return result;
    };

    readPage();
    window.addEventListener('popstate', readPage);
    window.addEventListener('mwth:navigation', readPage);

    return () => {
      window.history.pushState = originalPushState;
      window.removeEventListener('popstate', readPage);
      window.removeEventListener('mwth:navigation', readPage);
    };
  }, []);

  if (page !== 'home') return null;

  return (
    <nav className="page-toggle" id="pageToggle" aria-label="On this page">
      {homeSections.map(([key, label, href]) => (
        <a
          key={key}
          href={href}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
