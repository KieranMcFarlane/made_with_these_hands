// Homepage sections — Editorial Documentary, mid-fi

function MastheadMid({ mode = 'editorial', collapseOnScroll = true }) {
  const masthead = MWTH_SECTION('masthead');
  const [collapsed, setCollapsed] = React.useState(mode === 'minimal');
  const forceMinimal = mode === 'minimal';
  const isCollapsed = forceMinimal || collapsed;

  React.useEffect(() => {
    if (!collapseOnScroll || forceMinimal) {
      setCollapsed(forceMinimal);
      return undefined;
    }

    const collapseAfter = 112;
    const expandBefore = 28;
    let ticking = false;
    const update = () => {
      const scrollY = window.scrollY;
      setCollapsed((current) => {
        if (current) return scrollY > expandBefore;
        return scrollY > collapseAfter;
      });
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
  }, [collapseOnScroll, forceMinimal]);

  return (
    <header
      className="masthead"
      data-collapsed={isCollapsed ? 'true' : 'false'}
      data-collapse-on-scroll={collapseOnScroll ? 'true' : 'false'}
      data-mode={mode}
    >
      <div className="masthead-layer masthead-layer--editorial" aria-hidden={isCollapsed ? 'true' : 'false'}>
        <div className="masthead-layer-inner">
          <div className="rule">
            <span>{masthead.eyebrow}</span>
            <span>{masthead.dek}</span>
          </div>
          <h1 className="title">{masthead.title}</h1>
          <nav className="nav">
            <a href="/?page=craft&craft=glass-engraving" data-page="craft" data-craft="glass-engraving">Craft</a>
            <a href="/?page=blog" data-page="blog">Blog</a>
            <a href="/?page=podcasts" data-page="podcasts">Podcast</a>
            <a href="/?page=shop" data-page="shop">Objects</a>
            <a href="/?page=hugh" data-page="hugh">About</a>
          </nav>
        </div>
      </div>
      <div className="masthead-layer masthead-layer--compact" aria-hidden={isCollapsed ? 'false' : 'true'}>
        <div className="masthead-layer-inner">
          <h1 className="title">{masthead.title}</h1>
          <nav className="nav">
            <a href="/?page=craft&craft=glass-engraving" data-page="craft" data-craft="glass-engraving">Craft</a>
            <a href="/?page=blog" data-page="blog">Blog</a>
            <a href="/?page=podcasts" data-page="podcasts">Podcast</a>
            <a href="/?page=shop" data-page="shop">Objects</a>
            <a href="/?page=hugh" data-page="hugh">About</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

function TemplateSlot({ name }) {
  return <div data-mwth-template-slot={name} />;
}


function Placeholder({ label, h = 400, light = false, style = {}, src, objectPosition = 'center' }) {
  if (src) {
    return (
      <figure className={`ph ph--image${light ? ' ph--light' : ''}`} style={{ height: h, ...style }}>
        <img src={src} alt={label} style={{ objectPosition }} />
        <figcaption className="ph-label">[ {label} ]</figcaption>
      </figure>
    );
  }

  return (
    <div className={`ph${light ? ' ph--light' : ''}`} style={{ height: h, ...style }}>
      <span className="ph-label">[ {label} ]</span>
    </div>
  );
}

function RichText({ as = 'span', html, children, ...props }) {
  const Tag = as;
  if (!html) return <Tag {...props}>{children}</Tag>;
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: String(html).replaceAll('className=', 'class=') }} />;
}

function HeroA() {
  const hero = MWTH_SECTION('hero');
  return (
    <section className="hero-a section reveal" data-screen-label="01 Hero" style={{ paddingTop: 48 }}>
      <div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 18 }}>{hero.eyebrow}</div>
        <RichText as="h2" html={hero.title} className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '14ch' }} />
        <div className="hero-a-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 56, marginTop: 44, alignItems: 'end' }}>
          <Placeholder label={hero.imageAlt} h={520} src={hero.image} objectPosition="center" />
          <div>
            <p className="dek" style={{ margin: '0 0 24px' }}>{hero.dek}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
              <a className="btn btn--primary" href={hero.ctaHref || '#craft'}>{hero.ctaLabel || 'Explore Craft'} <span className="arrow">&rarr;</span></a>
              <a className="btn" href={hero.secondaryCtaHref || '/?page=podcasts'} data-page="podcasts">{hero.secondaryCtaLabel || 'Listen to the Podcast'}</a>
            </div>
            <div className="rule-h" style={{ marginBottom: 14 }} />
            <div className="smallcaps" style={{ marginBottom: 10 }}>In this issue</div>
            <div className="hl-serif" style={{ fontSize: 18, lineHeight: 1.5, color: 'var(--ink-80)' }}>{hero.meta}</div>
          </div>
        </div>
      </div>
    </section>
  );
}


function HeroB() {
  const hero = MWTH_SECTION('hero_b');
  const mainHero = MWTH_SECTION('hero');
  return (
    <section className="hero-b reveal" data-screen-label="01 Hero">
      <Placeholder label={hero.imageAlt} h={640} src={hero.image || mainHero.image} objectPosition="center" />
      <div className="wrap center" style={{ padding: '48px 40px 72px' }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>{hero.eyebrow}</div>
        <RichText as="h2" html={hero.title} className="hl-serif hl-l" style={{ margin: '0 auto', maxWidth: '18ch' }} />
        <p className="dek" style={{ margin: '22px auto 28px', maxWidth: '40ch' }}>{hero.dek}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="btn btn--primary" href={mainHero.ctaHref || '#craft'}>{mainHero.ctaLabel || 'Explore Craft'} <span className="arrow">&rarr;</span></a>
          <a className="btn" href={mainHero.secondaryCtaHref || '/?page=podcasts'} data-page="podcasts">{mainHero.secondaryCtaLabel || 'Listen to the Podcast'}</a>
        </div>
      </div>
    </section>
  );
}


function Mission() {
  const mission = MWTH_SECTION('mission');
  return (
    <section className="section reveal" id="about" data-screen-label="02 Mission" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
      <div className="wrap">
        <div className="section-head"><span className="num">02</span><span className="line" /><span className="label">{mission.label}</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 56 }}>
          <RichText as="h3" html={mission.title} className="hl-serif hl-m" style={{ margin: 0 }} />
          <div className="body" style={{ columns: 2, columnGap: 28 }}>{MWTH_LIST('mission', 'body').map((paragraph, index) => <p key={index} style={{ marginTop: index === 0 ? 0 : undefined }}>{paragraph}</p>)}</div>
        </div>
      </div>
    </section>
  );
}


function Craft() {
  const section = MWTH_SECTION('craft_index');
  const items = (window.MWTH_DATA?.crafts || []).slice(0, 6);
  const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  return (
    <section className="section reveal" id="craft" data-screen-label="03 Craft">
      <div className="wrap">
        <div className="section-head"><span className="num">03</span><span className="line" /><span className="label">{section.label}</span></div>
        <RichText as="h3" html={section.title} className="hl-serif hl-m" style={{ margin: '0 0 36px', maxWidth: '20ch' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {items.map((craft, index) => (
            <a key={craft.slug} className="craft-card" href={'/?page=craft&craft=' + craft.slug} data-page="craft" data-craft={craft.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Placeholder label={craft.name.toLowerCase() + ' - object, raking light'} h={260} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
                <div><span className="mono" style={{ fontSize: 10, color: 'var(--ink-60)', marginRight: 8 }}>{numerals[index] || index + 1}</span><span className="hl-serif" style={{ fontSize: 22 }}>{craft.name}</span></div>
                <span className="caption">{craft.makers.length} makers</span>
              </div>
              <p className="body" style={{ fontSize: 13, margin: '6px 0 0', color: 'var(--ink-60)' }}>{craft.products.length} objects and {craft.episodes.length} Field Recordings in the archive.</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


function HughStory() {
  const section = MWTH_SECTION('founder_portrait');
  return (
    <section className="section reveal" id="stories" data-screen-label="04 Hugh" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
      <div className="wrap">
        <div className="section-head"><span className="num">04</span><span className="line" /><span className="label">{section.label}</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
          <Placeholder label={section.imageAlt} h={620} src={section.image} objectPosition="center top" />
          <div><div className="smallcaps" style={{ marginBottom: 14 }}>{section.eyebrow}</div><RichText as="h3" html={section.title} className="hl-serif hl-l" style={{ margin: 0 }} /><blockquote className="dek" style={{ margin: '32px 0', padding: '20px 24px', borderLeft: '2px solid var(--accent)', fontSize: 22, lineHeight: 1.4, color: 'var(--ink)' }}>&ldquo;{section.quote}&rdquo;</blockquote><p className="body" style={{ marginTop: 0 }}>{section.dek}</p><a className="btn" href={section.ctaHref || '/?page=hugh'} data-page="hugh" style={{ marginTop: 18 }}>{section.ctaLabel || 'Read the full story'} <span className="arrow">&rarr;</span></a></div>
        </div>
      </div>
    </section>
  );
}


function Podcast() {
  const section = MWTH_SECTION('podcast_home');
  const episodes = MWTH_DATA.episodes.slice(0, 4);
  const latest = episodes[0] || {};
  return (
    <section className="section reveal" id="podcast" data-screen-label="05 Podcast">
      <div className="wrap">
        <div className="section-head"><span className="num">05</span><span className="line" /><span className="label">{section.label}</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          <div><RichText as="h3" html={section.title} className="hl-serif hl-l" style={{ margin: 0, maxWidth: '14ch' }} /><p className="dek" style={{ margin: '24px 0' }}>{section.dek}</p><div style={{ display: 'flex', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>{(section.links || []).map((p) => <a key={p} href="#" className="smallcaps" style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--ink-40)', paddingBottom: 2 }}>{p}</a>)}</div><div style={{ padding: 22, background: 'var(--ink)', color: 'var(--paper)' }}><div className="smallcaps" style={{ color: 'var(--ink-40)', marginBottom: 8 }}>Now Playing - Episode {latest.number}</div><div className="hl-serif" style={{ fontSize: 22, lineHeight: 1.25, marginBottom: 16, color: 'var(--paper)' }}>{latest.guest} - {latest.title}</div><div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><button style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--paper)', color: 'var(--ink)', border: 0, cursor: 'pointer', fontSize: 14 }}>?</button><div style={{ flex: 1 }}><div style={{ height: 2, background: '#3a3632', position: 'relative' }}><div style={{ width: '35%', height: '100%', background: 'var(--paper)' }} /></div><div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-40)' }}><span>18:42</span><span>{latest.duration}</span></div></div></div></div></div>
          <div><Placeholder label={section.imageAlt} h={260} src={section.image} objectPosition="center" style={{ marginBottom: 22 }} />{episodes.map((episode, i) => <a key={episode.number} href={'/?page=episode&maker=' + episode.maker} data-page="episode" data-maker={episode.maker} style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 18, padding: '22px 0', borderTop: i === 0 ? '1px solid var(--ink)' : '1px solid var(--rule)', textDecoration: 'none', color: 'inherit', alignItems: 'center' }}><span className="mono" style={{ fontSize: 12, color: 'var(--ink-60)' }}>EP {episode.number}</span><div><div className="smallcaps" style={{ marginBottom: 4 }}>{episode.guest}</div><div className="hl-serif" style={{ fontSize: 18, lineHeight: 1.3 }}>{episode.title}</div></div><span className="caption mono">{episode.duration}</span></a>)}<div style={{ borderTop: '1px solid var(--rule)', paddingTop: 22, marginTop: 4 }}><a className="btn" href="/?page=podcasts" data-page="podcasts">Browse all episodes <span className="arrow">&rarr;</span></a></div></div>
        </div>
      </div>
    </section>
  );
}


function ArtistOfWeek() {
  const section = MWTH_SECTION('artist_feature');
  const maker = MWTH_BY_MAKER(section.makerSlug || 'saoirse-doolan');
  return (
    <section className="section reveal" data-screen-label="06 Artist" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
      <div className="wrap"><div className="section-head" style={{ marginBottom: 36 }}><span className="num" style={{ color: 'var(--ink-40)' }}>06</span><span className="line" style={{ background: '#3a3632' }} /><span className="label" style={{ color: 'var(--ink-40)' }}>{section.label}</span></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}><Placeholder label={maker.heroLabel} h={540} src={maker.image} objectPosition="center" /><div><h3 className="hl-serif hl-l" style={{ color: 'var(--paper)', margin: 0 }}>{maker.name}</h3><div className="smallcaps" style={{ color: 'var(--ink-40)', margin: '12px 0 24px' }}>{maker.craft} - {maker.place} - Est. {maker.established}</div><p className="body" style={{ color: '#d8d1c4' }}>{maker.dek}</p><blockquote className="dek" style={{ color: 'var(--paper)', margin: '24px 0', paddingLeft: 20, borderLeft: '2px solid var(--paper)' }}>&ldquo;{section.quote}&rdquo;</blockquote><a href={'/?page=maker&maker=' + maker.slug} data-page="maker" data-maker={maker.slug} className="btn" style={{ borderColor: 'var(--paper)', color: 'var(--paper)' }}>{section.ctaLabel || 'Explore maker work'} <span className="arrow">&rarr;</span></a></div></div></div>
    </section>
  );
}


function WhyCraft() {
  const section = MWTH_SECTION('essay');
  return (
    <section className="section reveal" data-screen-label="07 Essay"><div className="wrap-narrow"><div className="section-head"><span className="num">07</span><span className="line" /><span className="label">{section.label}</span></div><RichText as="h3" html={section.title} className="hl-serif hl-l" style={{ margin: '0 0 40px' }} /><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 48 }}>{(section.metrics || []).map(([n, t]) => <div key={n} style={{ padding: '24px 0', borderTop: '1px solid var(--ink)' }}><div className="hl-serif" style={{ fontSize: 64, lineHeight: 1, color: 'var(--accent)' }}>{n}</div><div className="caption" style={{ marginTop: 10, maxWidth: '20ch' }}>{t}</div></div>)}</div><div className="body" style={{ columns: 2, columnGap: 32, fontSize: 16 }}>{MWTH_LIST('essay', 'body').map((paragraph, index) => <p key={index} style={{ marginTop: index === 0 ? 0 : undefined }}>{paragraph}</p>)}</div><div style={{ marginTop: 36 }}><a className="btn" href={section.ctaHref || '/?page=blog'}>{section.ctaLabel || 'Read the essay'} <span className="arrow">&rarr;</span></a></div></div></section>
  );
}


function ShopCTA() {
  const section = MWTH_SECTION('shop_cta');
  return (
    <section className="section reveal" id="shop" data-screen-label="08 Shop" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)' }}><div className="wrap center"><div className="smallcaps" style={{ marginBottom: 18 }}>{section.eyebrow}</div><RichText as="h3" html={section.title} className="hl-serif hl-xl" style={{ margin: 0 }} /><p className="dek" style={{ margin: '28px auto 32px', maxWidth: '44ch' }}>{section.dek}</p><a className="btn btn--primary" href={section.ctaHref || '/?page=shop'} data-page="shop">{section.ctaLabel || 'Browse the collection'} <span className="arrow">&rarr;</span></a></div></section>
  );
}


function footerLinkProps(label) {
  const routes = {
    Craft: ['/?page=craft&craft=glass-engraving', 'craft'],
    Blog: ['/?page=blog', 'blog'],
    Podcast: ['/?page=podcasts', 'podcasts'],
    Objects: ['/?page=shop', 'shop'],
    'Hugh McNeill': ['/?page=hugh', 'hugh'],
    Commissions: ['/?page=commissions', 'commissions'],
  };
  const route = routes[label];
  return route ? { href: route[0], 'data-page': route[1] } : { href: '#' };
}

function FooterMid() {
  const footer = MWTH_SECTION('footer');
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '64px 0 32px' }}><div className="wrap"><div className="hl-serif" style={{ fontSize: 40, marginBottom: 32, color: 'var(--paper)' }}>{footer.title}</div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, paddingBottom: 40, borderBottom: '1px solid #3a3632' }}>{(footer.columns || []).map(([h, items]) => <div key={h}><div className="smallcaps" style={{ color: 'var(--ink-40)', marginBottom: 14 }}>{h}</div>{items.map((i) => <a key={i} {...footerLinkProps(i)} style={{ display: 'block', color: '#d8d1c4', textDecoration: 'none', marginBottom: 8, fontSize: 14 }}>{i}</a>)}</div>)}</div><div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-40)', paddingTop: 22 }}><span>&copy; {footer.copyright}</span><span>{footer.legal}</span></div></div></footer>
  );
}



Object.assign(window, {
  MastheadMid, HeroA, HeroB, Mission, Craft, HughStory,
  Podcast, ArtistOfWeek, WhyCraft, ShopCTA, FooterMid, Placeholder, TemplateSlot,
});
