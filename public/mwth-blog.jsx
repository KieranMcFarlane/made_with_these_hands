function BlogLink({ post, children, className, style }) {
  return (
    <a href={`/?page=blog-post&post=${post.slug}`} data-page="blog-post" data-post={post.slug} className={className} style={style}>
      {children || post.title}
    </a>
  );
}

function BlogCard({ post, featured = false }) {
  return (
    <BlogLink post={post} className="reveal in" style={{ color: 'inherit', textDecoration: 'none' }}>
      <Placeholder label={post.title} h={featured ? 460 : 280} light={!post.image} src={post.image} objectPosition="center" />
      <div className="smallcaps" style={{ marginTop: 16, color: 'var(--accent)' }}>{post.category} · {post.date}</div>
      <h2 className="hl-serif" style={{ fontSize: featured ? 38 : 25, lineHeight: 1.12, margin: '8px 0 0' }}>{post.title}</h2>
      <p className="body" style={{ color: 'var(--ink-60)', marginTop: 10 }}>{post.dek}</p>
    </BlogLink>
  );
}

function BlogPage() {
  const section = MWTH_SECTION('blog_index');
  const posts = MWTH_DATA.posts || [];
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <MastheadMid mode="editorial" />
      <TemplateSlot name="before-content" />
      <section className="section reveal" data-screen-label="Blog Head" style={{ paddingBottom: 32 }}>
        <div className="wrap">
<div className="smallcaps" style={{ marginBottom: 18 }}>{section.eyebrow}</div>
          <RichText as="h1" html={section.title} className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '14ch' }} />
          <p className="dek" style={{ margin: '24px 0 0', maxWidth: '48ch' }}>{section.dek}</p>
        </div>
      </section>

      {featured && (
        <section className="section reveal" data-screen-label="Blog Featured" style={{ paddingTop: 20 }}>
          <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 56, alignItems: 'center' }}>
            <Placeholder label={featured.title} h={520} light={!featured.image} src={featured.image} objectPosition="center" />
            <div>
              <div className="smallcaps" style={{ marginBottom: 16, color: 'var(--accent)' }}>{featured.category} · {featured.date}</div>
              <h2 className="hl-serif hl-l" style={{ margin: 0 }}>{featured.title}</h2>
              <p className="body" style={{ marginTop: 20 }}>{featured.dek}</p>
              <BlogLink post={featured} className="btn btn--primary" style={{ marginTop: 22 }}>Read the note <span className="arrow">→</span></BlogLink>
            </div>
          </div>
        </section>
      )}

      <section className="section reveal" data-screen-label="Blog Grid" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)' }}>
        <div className="wrap">
          <div className="section-head"><span className="num">01</span><span className="line" /><span className="label">Latest writing</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {(rest.length ? rest : posts).map((post) => <BlogCard key={post.slug} post={post} />)}
          </div>
        </div>
      </section>
      <TemplateSlot name="after-content" />
      <TemplateSlot name="related-content" />
      <FooterMid />
    </>
  );
}

function BlogPostPage({ post = MWTH_BY_POST() }) {
  const relatedEpisodes = MWTH_DATA.episodes.slice(0, 3);

  return (
    <>
      <MastheadMid mode="editorial" />
      <TemplateSlot name="before-content" />
      <article>
        <section className="section reveal" data-screen-label="Post Title" style={{ paddingBottom: 38 }}>
          <div className="wrap-narrow">
            <div className="smallcaps" style={{ marginBottom: 18 }}>{post.category} · {post.date} · {post.author}</div>
            <h1 className="hl-serif hl-xl" style={{ margin: 0 }}>{post.title}</h1>
            <p className="dek" style={{ marginTop: 24 }}>{post.dek}</p>
          </div>
        </section>
        <div className="wrap" style={{ paddingBottom: 48 }}>
          <Placeholder label={post.title} h={620} light={!post.image} src={post.image} objectPosition="center" />
        </div>
        <div className="wrap-narrow" style={{ paddingBottom: 64 }}>
          <div className="body" style={{ fontSize: 18, lineHeight: 1.75 }}>
            {(post.body || []).map((paragraph, index) => <p key={index} style={{ marginTop: index === 0 ? 0 : undefined }}>{paragraph}</p>)}
          </div>
        </div>
        <section className="section reveal" data-screen-label="Post Related" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <div className="wrap">
            <div className="section-head"><span className="num" style={{ color: 'var(--ink-40)' }}>02</span><span className="line" style={{ background: '#3a3632' }} /><span className="label" style={{ color: 'var(--ink-40)' }}>Related Field Recordings</span></div>
            {relatedEpisodes.map((episode) => (
              <a key={episode.number} href={`/?page=episode&maker=${episode.maker}`} data-page="episode" data-maker={episode.maker} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', color: 'inherit', textDecoration: 'none', padding: '18px 0', borderTop: '1px solid #3a3632' }}>
                <span className="mono">EP {episode.number}</span>
                <span className="hl-serif" style={{ fontSize: 22 }}>{episode.guest} · {episode.title}</span>
                <span className="caption mono">{episode.duration}</span>
              </a>
            ))}
          </div>
        </section>
      </article>
      <TemplateSlot name="after-content" />
      <TemplateSlot name="related-content" />
      <FooterMid />
    </>
  );
}

Object.assign(window, { BlogPage, BlogPostPage });
