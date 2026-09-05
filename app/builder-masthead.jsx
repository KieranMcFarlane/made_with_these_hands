'use client';

import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './builder-masthead.module.css';

const NAVIGATION = [
  { href: '/makers', label: 'Makers' },
  { href: '/journal', label: 'Journal' },
  { href: '/podcast', label: 'Podcast' },
  { href: '/objects', label: 'Objects' },
  { href: '/about', label: 'About' },
];

export default function BuilderMasthead({ inverseOnHero = false }) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inverse = inverseOnHero && !collapsed;

  useEffect(() => {
    const collapseAfter = 112;
    const expandBefore = 28;
    let ticking = false;

    const update = () => {
      setCollapsed((current) => (
        current ? window.scrollY > expandBefore : window.scrollY > collapseAfter
      ));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (collapsed) setMenuOpen(false);
  }, [collapsed]);

  return (
    <header
      className={styles.masthead}
      data-collapsed={collapsed ? 'true' : 'false'}
      data-inverse={inverse ? 'true' : 'false'}
      data-overlay={inverseOnHero ? 'true' : 'false'}
    >
      <div className={styles.inner}>
        <a className={styles.brand} href="/">Made With These Hands</a>
        <p className={styles.descriptor}>A journal of heritage craft</p>
        <nav className={styles.navigation} aria-label="Primary navigation">
          {NAVIGATION.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
        </nav>
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          className={styles.menuButton}
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav className={styles.mobileNavigation} aria-label="Mobile navigation" data-open={menuOpen ? 'true' : 'false'}>
        {NAVIGATION.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
      </nav>
    </header>
  );
}
