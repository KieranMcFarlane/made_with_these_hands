'use client';

import * as React from 'react';
import { createRoot } from 'react-dom/client';

const files = [
  '/mwth-data.jsx',
  '/mwth-home.jsx',
  '/mwth-blog.jsx',
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

function routeFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const parts = window.location.pathname.split('/').filter(Boolean);
  const route = {
    page: params.get('page') || 'home',
    maker: params.get('maker') || localStorage.getItem('mwth-maker') || 'saoirse-doolan',
    product: params.get('product') || localStorage.getItem('mwth-product') || 'lobster-pot-small',
    craft: params.get('craft') || localStorage.getItem('mwth-craft') || 'basketry',
    post: params.get('post') || localStorage.getItem('mwth-post') || 'why-we-record-the-tools',
    episode: params.get('episode') || localStorage.getItem('mwth-episode') || '',
  };

  if (params.get('page')) return route;
  if (parts.length === 0) return route;

  const [section, slug] = parts;
  if (section === 'objects') return { ...route, page: slug ? 'product' : 'shop', product: slug || route.product };
  if (section === 'makers' || section === 'guests') return { ...route, page: 'maker', maker: slug || route.maker };
  if (section === 'about' || section === 'bio' || section === 'hugh') return { ...route, page: 'hugh' };
  if (section === 'podcast') return { ...route, page: slug ? 'episode' : 'podcasts', episode: slug || route.episode, maker: slug || route.maker };
  if (section === 'journal' || section === 'blog') return { ...route, page: slug ? 'blog-post' : 'blog', post: slug || route.post };
  if (section === 'contact' || section === 'commissions') return { ...route, page: 'commissions' };
  if (section === 'craft') return { ...route, page: 'craft', craft: slug || route.craft };
  return route;
}

function App() {
  const [tweaks, setTweaks] = React.useState(TWEAKS);
  const [dataVersion, setDataVersion] = React.useState(0);
  const initialRoute = React.useMemo(() => routeFromLocation(), []);
  const [page, setPage] = React.useState(initialRoute.page);
  const [context, setContext] = React.useState(initialRoute);

  React.useEffect(() => {
    document.body.setAttribute('data-palette', tweaks.palette);
  }, [tweaks.palette]);

  React.useEffect(() => {
    localStorage.setItem('mwth-page', page);
    localStorage.setItem('mwth-maker', context.maker);
    localStorage.setItem('mwth-product', context.product);
    localStorage.setItem('mwth-craft', context.craft);
    localStorage.setItem('mwth-post', context.post);
    localStorage.setItem('mwth-episode', context.episode || '');
  }, [page, context]);

  React.useEffect(() => {
    window.__setTweak = (k, v) => {
      setTweaks(t => ({ ...t, [k]: v }));
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
    };
    window.__setPage = (nextPage, nextContext = {}) => {
      const mergedContext = { ...context, ...nextContext };
      setPage(nextPage);
      setContext(mergedContext);
      const url = new URL(window.location.href);
      url.searchParams.set('page', nextPage);
      if (mergedContext.maker) url.searchParams.set('maker', mergedContext.maker);
      if (mergedContext.product) url.searchParams.set('product', mergedContext.product);
      if (mergedContext.craft) url.searchParams.set('craft', mergedContext.craft);
      if (mergedContext.post) url.searchParams.set('post', mergedContext.post);
      if (mergedContext.episode) url.searchParams.set('episode', mergedContext.episode);
      window.history.pushState({ page: nextPage }, '', url);
    };
  }, [context]);

  React.useEffect(() => {
    let mounted = true;
    window.MWTH_LOAD_DIRECTUS?.then(() => {
      if (mounted) setDataVersion((version) => version + 1);
    });
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    const onClick = (event) => {
      const anchor = event.target.closest('a[data-page], a[href^="/?page="]');
      if (!anchor) return;

      const url = new URL(anchor.getAttribute('href'), window.location.origin);
      const nextPage = anchor.dataset.page || url.searchParams.get('page');
      if (url.origin !== window.location.origin || (!anchor.dataset.page && url.pathname !== '/')) return;
      if (!nextPage) return;

      const nextContext = {
        maker: anchor.dataset.maker || url.searchParams.get('maker') || context.maker,
        product: anchor.dataset.product || url.searchParams.get('product') || context.product,
        craft: anchor.dataset.craft || url.searchParams.get('craft') || context.craft,
        post: anchor.dataset.post || url.searchParams.get('post') || context.post,
        episode: anchor.dataset.episode || url.searchParams.get('episode') || context.episode,
      };

      event.preventDefault();
      setPage(nextPage);
      setContext(nextContext);
      localStorage.setItem('mwth-page', nextPage);
      window.history.pushState({ page: nextPage }, '', '/?page=' + nextPage + '&maker=' + nextContext.maker + '&product=' + nextContext.product + '&craft=' + nextContext.craft + '&post=' + nextContext.post + '&episode=' + (nextContext.episode || ''));
    };

    const onPopState = () => {
      const nextRoute = routeFromLocation();
      setPage(nextRoute.page);
      setContext(nextRoute);
    };

    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPopState);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPopState);
    };
  }, [context]);

  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [page, tweaks]);

  if (page === 'episode')  return <><window.EpisodePage episode={MWTH_BY_EPISODE(context.episode || context.maker)} /><window.EnquiryDrawer /></>;
  if (page === 'shop')     return <><window.ShopPage /><window.EnquiryDrawer /></>;
  if (page === 'product')  return <><window.ProductPage product={MWTH_BY_PRODUCT(context.product)} /><window.EnquiryDrawer /></>;
  if (page === 'maker')    return <><window.MakerPage maker={MWTH_BY_MAKER(context.maker)} /><window.EnquiryDrawer /></>;
  if (page === 'hugh')     return <><window.HughStoryPage /><window.EnquiryDrawer /></>;
  if (page === 'blog')     return <><window.BlogPage /><window.EnquiryDrawer /></>;
  if (page === 'blog-post') return <><window.BlogPostPage post={MWTH_BY_POST(context.post)} /><window.EnquiryDrawer /></>;
  if (page === 'artists')  return <><window.ArtistsPage /><window.EnquiryDrawer /></>;
  if (page === 'podcasts') return <><window.PodcastArchivePage /><window.EnquiryDrawer /></>;
  if (page === 'craft')    return <><window.CraftPage craft={MWTH_BY_CRAFT(context.craft)} /><window.EnquiryDrawer /></>;
  if (page === 'commissions') return <><window.CommissionsPage /><window.EnquiryDrawer /></>;
  void dataVersion;

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
      <window.EnquiryDrawer />
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
