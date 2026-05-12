'use client';

import * as React from 'react';
import { createRoot } from 'react-dom/client';

const files = [
  '/mwth-home.jsx',
  '/mwth-episode.jsx',
  '/mwth-more-pages.jsx',
  '/mwth-commerce.jsx',
];

const appSource = `
const TWEAKS = {
  "hero": "A",
  "palette": "cream",
  "masthead": "minimal"
};

function App() {
  const [tweaks, setTweaks] = React.useState(TWEAKS);
  const [page, setPage] = React.useState(() => {
    const queryPage = new URLSearchParams(window.location.search).get('page');
    return queryPage || localStorage.getItem('mwth-page') || 'home';
  });

  React.useEffect(() => {
    document.body.setAttribute('data-palette', tweaks.palette);
  }, [tweaks.palette]);

  React.useEffect(() => {
    localStorage.setItem('mwth-page', page);
  }, [page]);

  React.useEffect(() => {
    window.__setTweak = (k, v) => {
      setTweaks(t => ({ ...t, [k]: v }));
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
    };
    window.__setPage = setPage;
  }, []);

  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [page, tweaks]);

  if (page === 'episode')  return <><EpisodePage /><BasketDrawer /></>;
  if (page === 'shop')     return <><ShopPage /><BasketDrawer /></>;
  if (page === 'product')  return <><ProductPage /><BasketDrawer /></>;
  if (page === 'hugh')     return <><HughStoryPage /><BasketDrawer /></>;
  if (page === 'artists')  return <><ArtistsPage /><BasketDrawer /></>;
  if (page === 'commissions') return <><CommissionsPage /><BasketDrawer /></>;
  if (page === 'checkout')    return <CheckoutPage />;

  const Hero = tweaks.hero === 'B' ? HeroB : HeroA;
  return (
    <>
      <MastheadMid mode={tweaks.masthead} />
      <Hero />
      <Mission />
      <Craft />
      <HughStory />
      <Podcast />
      <ArtistOfWeek />
      <WhyCraft />
      <ShopCTA />
      <FooterMid />
      <BasketDrawer />
    </>
  );
}

window.__mwthRoot = window.__mwthRoot || ReactDOM.createRoot(document.getElementById('root'));
window.__mwthRoot.render(<App />);
`;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function attachHostControls() {
  const panel = document.getElementById('tweaks');
  if (!panel || panel.dataset.bound === 'true') return;

  const state = { hero: 'A', palette: 'cream', masthead: 'editorial' };
  const paint = () => {
    panel.querySelectorAll('[data-key]').forEach((group) => {
      const key = group.dataset.key;
      group.querySelectorAll('button').forEach((button) => {
        button.classList.toggle('on', state[key] === button.dataset.val);
      });
    });
  };

  panel.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-val]');
    if (!button) return;

    const key = button.parentElement.dataset.key;
    state[key] = button.dataset.val;
    paint();
    window.__setTweak?.(key, button.dataset.val);
  });

  window.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type === '__activate_edit_mode') panel.classList.add('open');
    if (data.type === '__deactivate_edit_mode') panel.classList.remove('open');
  });

  paint();
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  panel.dataset.bound = 'true';
}

export default function LegacyRuntime() {
  React.useEffect(() => {
    let cancelled = false;

    async function boot() {
      window.React = React;
      window.ReactDOM = { createRoot };

      await loadScript('https://unpkg.com/@babel/standalone@7.29.0/babel.min.js');
      const sources = await Promise.all(files.map(async (file) => {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Unable to load ${file}`);
        return response.text();
      }));

      if (cancelled) return;

      const compiled = window.Babel.transform([...sources, appSource].join('\n\n'), {
        presets: ['react'],
      }).code;

      Function(compiled)();
      attachHostControls();
    }

    boot().catch((error) => {
      console.error('Failed to start Made With These Hands prototype', error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
