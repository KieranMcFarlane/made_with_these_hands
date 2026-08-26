// Podcast episode sub-page + archive — mid-fi

const PODCAST_ARCHIVE = [
  ['047', 'Méabh Ó Riada', 'Bog oak, dowsing, and the grain of 4,000 years', 'Bog-oak woodwork', 'Connemara', '54 min', 'April 12, 2026'],
  ['046', 'Tomás Kelly', 'Silversmithing after the crash', 'Silversmithing', 'Dublin', '48 min', 'March 29, 2026'],
  ['045', 'Nuala Finn', 'What linen remembers', 'Textiles', 'Co. Down', '1h 02', 'March 15, 2026'],
  ['044', 'Dáithí Ó Conchúir', 'Thatching the last reed-roofs of Donegal', 'Thatching', 'Co. Donegal', '57 min', 'March 1, 2026'],
  ['043', 'Saoirse Doolan', 'Winter willow and the working basket', 'Basketry', 'Co. Clare', '49 min', 'February 16, 2026'],
  ['042', 'Hugh McNeill', 'Thirty years at the wheel', 'Glass engraving', 'Kilkenny', '44 min', 'February 2, 2026'],
  ['041', 'Pádraig Brennan', 'Stoneware that survives the kitchen', 'Ceramics', 'West Cork', '52 min', 'January 19, 2026'],
  ['040', 'Róisín Mac', 'Dye plants, sheep, and slow cloth', 'Textiles', 'Co. Down', '46 min', 'January 5, 2026'],
];

function DataPodcastArchivePage() {
  return (
    <>
      <MastheadMid mode="editorial" />
      <section className="section reveal" data-screen-label="Podcast Archive Head" style={{ paddingBottom: 36 }}>
        <div className="wrap">
<div className="smallcaps" style={{ marginBottom: 18 }}>{section.eyebrow}</div>
          <RichText as="h1" html={section.title} className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '13ch' }} />
          <p className="dek" style={{ margin: '24px 0 0', maxWidth: '48ch' }}>{section.dek}</p>
        </div>
      </section>

      <section className="section reveal" data-screen-label="Podcast Featured" style={{ paddingTop: 20 }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 56, alignItems: 'center' }}>
          <Placeholder
            label="Field recording setup on a craft workshop bench"
            h={500}
            src="/images/mwth-podcast-bench.jpg"
            objectPosition="center"
          />
          <div>
            <div className="smallcaps" style={{ marginBottom: 16 }}>Latest · Episode 047</div>
            <h2 className="hl-serif hl-l" style={{ margin: 0 }}>
              Méabh Ó Riada and the grain of <span className="italic">4,000 years</span>.
            </h2>
            <p className="body" style={{ marginTop: 20 }}>
              A long conversation from Carraroe about bog oak, salvaged timber,
              hand tools, and why some material refuses the maker.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
              <a className="btn btn--primary" href="/?page=episode" data-page="episode">Play latest episode <span className="arrow">→</span></a>
              <a className="btn" href="/?page=maker" data-page="maker">Saoirse&rsquo;s maker page</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" data-screen-label="Podcast Archive List" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)' }}>
        <div className="wrap">
          <div className="section-head">
            <span className="num">01</span>
            <span className="line" />
            <span className="label">All episodes</span>
          </div>
          <div style={{ borderTop: '1px solid var(--ink)' }}>
            {PODCAST_ARCHIVE.map(([number, guest, title, craft, place, duration, date]) => (
              <a
                key={number}
                href={guest === 'Saoirse Doolan' ? '/?page=maker' : '/?page=episode'}
                data-page={guest === 'Saoirse Doolan' ? 'maker' : 'episode'}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1.3fr 1fr 120px',
                  gap: 24,
                  alignItems: 'baseline',
                  padding: '24px 0',
                  borderBottom: '1px solid var(--rule)',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <span className="mono" style={{ color: 'var(--accent)', fontSize: 12 }}>EP {number}</span>
                <div>
                  <div className="smallcaps" style={{ marginBottom: 6 }}>{guest} · {place}</div>
                  <div className="hl-serif" style={{ fontSize: 25, lineHeight: 1.18 }}>{title}</div>
                </div>
                <span className="smallcaps">{craft}</span>
                <span className="caption mono" style={{ textAlign: 'right' }}>{duration}<br/>{date}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <FooterMid />
    </>
  );
}

function EpisodePage() {
  return (
    <>
      <MastheadMid mode="editorial" />
      <article>
        {/* Title */}
        <section className="section reveal" data-screen-label="EP Title" style={{ paddingBottom: 40 }}>
          <div className="wrap-narrow">
            <div className="smallcaps" style={{ marginBottom: 20 }}>Field Recording · Episode 047</div>
            <h1 className="hl-serif hl-xl" style={{ margin: 0, letterSpacing: '-0.02em' }}>
              Méabh Ó Riada and the grain of <span className="italic">4,000 years</span>.
            </h1>
            <div className="body" style={{ marginTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap', color: 'var(--ink-60)', fontSize: 14 }}>
              <span>Recorded in Connemara</span>
              <span>·</span>
              <span>54 minutes</span>
              <span>·</span>
              <span>Published April 12, 2026</span>
              <span>·</span>
              <span>Hosted by Hugh McNeill</span>
            </div>
          </div>
        </section>

        {/* Hero image */}
        <div className="wrap" style={{ paddingBottom: 40 }}>
          <Placeholder
            label="Field recording setup at a maker's bench — microphone, notes, tools, and window light"
            h={620}
            src="/images/mwth-podcast-bench.jpg"
            objectPosition="center"
          />
          <div className="caption mono" style={{ marginTop: 10 }}>Méabh Ó Riada in her workshop at Carraroe, Co. Galway. March 2026.</div>
        </div>

        {/* Player */}
        <div className="wrap-narrow" style={{ paddingBottom: 48 }}>
          <div style={{ padding: 28, background: 'var(--ink)', color: 'var(--paper)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <button style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--paper)', color: 'var(--ink)', border: 0,
                cursor: 'pointer', fontSize: 18,
              }}>▶</button>
              <div style={{ flex: 1 }}>
                <div style={{ height: 2, background: '#3a3632', position: 'relative' }}>
                  <div style={{ width: '35%', height: '100%', background: 'var(--paper)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-40)' }}>
                  <span>18:42</span><span>54:10</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 22, marginTop: 20, paddingTop: 18, borderTop: '1px solid #3a3632', flexWrap: 'wrap' }}>
              {['Apple', 'Spotify', 'Overcast', 'RSS', 'Download', 'Transcript'].map(l => (
                <a key={l} href="#" className="smallcaps" style={{ color: 'var(--paper)', textDecoration: 'none', fontSize: 10 }}>{l}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="wrap-narrow" style={{ paddingBottom: 48 }}>
          <p className="dek" style={{ fontSize: 22, lineHeight: 1.5 }}>
            Méabh Ó Riada works with bog oak pulled from the peat of West Galway —
            wood that has been underground since the Bronze Age.
            “The grain,” she says, “is a diary.”
          </p>
          <div className="body" style={{ marginTop: 32, columnCount: 2, columnGap: 36, fontSize: 16 }}>
            <p style={{ marginTop: 0 }}>
              In this conversation we walk the bog where she sources it,
              watch her split a beam with a mallet her father made, and hear
              why she refuses power tools. Méabh's workshop sits at the end
              of a boreen in Carraroe, a half-mile from the Atlantic, and
              smells of linseed oil and old smoke.
            </p>
            <p>
              Bog oak is stained black by thousands of years in anaerobic
              peat. It is harder than the wood a carpenter knows, and more
              temperamental — it splits along lines you cannot see until
              the chisel finds them. Most of the pieces Méabh salvages,
              she says, refuse her. The ones that do not refuse her
              become spoons, bowls, boxes, and occasionally a chair.
            </p>
          </div>
        </div>

        {/* Pull quote */}
        <div style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: '72px 0' }}>
          <div className="wrap-narrow center">
            <blockquote className="hl-serif italic" style={{ margin: 0, fontSize: 'clamp(30px, 3.5vw, 44px)', lineHeight: 1.25, color: 'var(--ink)' }}>
              “You cannot rush a tree that took four thousand years to get here.”
            </blockquote>
            <div className="smallcaps" style={{ marginTop: 22 }}>— Méabh Ó Riada</div>
          </div>
        </div>

        {/* Chapters */}
        <section className="section reveal" data-screen-label="EP Chapters">
          <div className="wrap-narrow">
            <div className="section-head">
              <span className="num">01</span>
              <span className="line" />
              <span className="label">Chapters</span>
            </div>
            {[
              ['00:00', 'Walking the bog',                      'We start outside, in the rain, waist-deep in peat.'],
              ['08:14', 'The tools her father made',            'Three mallets and a slick — the complete kit.'],
              ['21:30', 'Why power tools do not belong here',   'A question of rhythm, not purity.'],
              ['33:06', 'What 4,000-year wood sounds like',     'A single, sharp ring, like a struck bell.'],
              ['38:02', 'The apprentice she is looking for',    'Patient, stubborn, and unafraid of wet feet.'],
              ['47:45', 'Reading — a poem by Seán Ó Riordáin',  'A close.'],
            ].map(([t, n, d]) => (
              <a key={t} href="#" style={{
                display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 22,
                padding: '20px 0', borderTop: '1px solid var(--rule)',
                textDecoration: 'none', color: 'inherit', alignItems: 'baseline',
              }}>
                <span className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>{t}</span>
                <div>
                  <div className="hl-serif" style={{ fontSize: 20, marginBottom: 4 }}>{n}</div>
                  <div className="body" style={{ fontSize: 13, color: 'var(--ink-60)' }}>{d}</div>
                </div>
                <span className="caption mono">▶</span>
              </a>
            ))}
          </div>
        </section>

        {/* Maker spotlight */}
        <section className="section reveal" data-screen-label="EP Maker"
                 style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
          <div className="wrap">
            <div className="section-head">
              <span className="num">02</span>
              <span className="line" />
              <span className="label">About the Maker</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 56, alignItems: 'start' }}>
              <Placeholder label="Portrait of Méabh — hands on a split beam" h={420} light />
              <div>
                <h2 className="hl-serif hl-m" style={{ margin: 0 }}>
                  Méabh <span className="italic">Ó Riada</span>
                </h2>
                <div className="smallcaps" style={{ margin: '10px 0 20px' }}>Bog-oak woodworker · Carraroe, Co. Galway · b. 1978</div>
                <p className="body">
                  Trained as a classical joiner in Dublin before moving west in 2003.
                  Her work is held in the National Museum and exhibited annually
                  at Design Island. Takes one apprentice at a time; the waiting list is four years.
                </p>
                <div style={{ display: 'flex', gap: 14, marginTop: 22, flexWrap: 'wrap' }}>
                  <a className="btn" href="/?page=shop" data-page="shop">Méabh&rsquo;s pieces in the archive <span className="arrow">→</span></a>
                  <a className="btn" href="#">Visit her workshop</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Read next */}
        <section className="section reveal" data-screen-label="EP Next">
          <div className="wrap">
            <div className="section-head">
              <span className="num">03</span>
              <span className="line" />
              <span className="label">Read Next</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[
                ['EP 046', 'Tomás Kelly',  'Silversmithing after the crash',           '48 min'],
                ['EP 045', 'Nuala Finn',   'What linen remembers',                      '1h 02'],
                ['Essay',  'Dispatch',     'The last bog-oak workers of the west',     '8 min read'],
              ].map(([tag, guest, title, meta]) => (
                <a key={title} href="/?page=podcasts" data-page="podcasts" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Placeholder label={title} h={260} />
                  <div className="smallcaps" style={{ marginTop: 14 }}>{tag} · {guest}</div>
                  <div className="hl-serif" style={{ fontSize: 22, marginTop: 6, lineHeight: 1.25 }}>{title}</div>
                  <div className="caption mono" style={{ marginTop: 8 }}>{meta}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </article>
      <FooterMid />
    </>
  );
}

function PodcastArchivePage({ mastheadMode = 'editorial' } = {}) {
  const section = MWTH_SECTION('podcast_index');
  const episodes = MWTH_DATA.episodes;
  return (
    <>
      <MastheadMid mode={mastheadMode} />
      <TemplateSlot name="before-content" />
      <section className="section reveal" data-screen-label="Podcast Archive Head" style={{ paddingBottom: 36 }}>
        <div className="wrap">
          <div className="smallcaps" style={{ marginBottom: 18 }}>{section.eyebrow}</div>
          <RichText as="h1" html={section.title} className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '13ch' }} />
          <p className="dek" style={{ margin: '24px 0 0', maxWidth: '48ch' }}>{section.dek}</p>
        </div>
      </section>
      <section className="section reveal" data-screen-label="Podcast Featured" style={{ paddingTop: 20 }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 56, alignItems: 'center' }}>
          <Placeholder label={section.imageAlt} h={500} src={section.image} objectPosition="center" />
          <div>
            <div className="smallcaps" style={{ marginBottom: 16 }}>Latest · Episode {episodes[0].number}</div>
            <h2 className="hl-serif hl-l" style={{ margin: 0 }}>{episodes[0].guest} and {episodes[0].title.toLowerCase()}.</h2>
            <p className="body" style={{ marginTop: 20 }}>The newest record in the oral archive, connected to its maker, product shelf, and craft discipline.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
              <a className="btn btn--primary" href={`/?page=episode&maker=${episodes[0].maker}`} data-page="episode" data-maker={episodes[0].maker}>Play latest episode <span className="arrow">→</span></a>
              <a className="btn" href={`/?page=maker&maker=${episodes[0].maker}`} data-page="maker" data-maker={episodes[0].maker}>Maker page</a>
            </div>
          </div>
        </div>
      </section>
      <section className="section reveal" data-screen-label="Podcast Archive List" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)' }}>
        <div className="wrap">
          <div className="section-head"><span className="num">01</span><span className="line" /><span className="label">All episodes</span></div>
          <div style={{ borderTop: '1px solid var(--ink)' }}>
            {episodes.map((episode) => (
              <a key={episode.number} href={`/?page=episode&maker=${episode.maker}`} data-page="episode" data-maker={episode.maker} style={{ display: 'grid', gridTemplateColumns: '80px 1.3fr 1fr 120px', gap: 24, alignItems: 'baseline', padding: '24px 0', borderBottom: '1px solid var(--rule)', color: 'inherit', textDecoration: 'none' }}>
                <span className="mono" style={{ color: 'var(--accent)', fontSize: 12 }}>EP {episode.number}</span>
                <div>
                  <div className="smallcaps" style={{ marginBottom: 6 }}>{episode.guest} · {episode.place}</div>
                  <div className="hl-serif" style={{ fontSize: 25, lineHeight: 1.18 }}>{episode.title}</div>
                </div>
                <span className="smallcaps">{episode.craft}</span>
                <span className="caption mono" style={{ textAlign: 'right' }}>{episode.duration}<br/>{episode.date}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <TemplateSlot name="after-content" />
      <TemplateSlot name="related-content" />
      <FooterMid />
    </>
  );
}

function EpisodeComments({ episode }) {
  const episodeId = episode.number || episode.title;
  const [comments, setComments] = React.useState([]);
  const [configured, setConfigured] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', body: '' });
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/api/comments?episode=${encodeURIComponent(episodeId)}`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => {
        if (cancelled) return;
        setConfigured(Boolean(payload.configured));
        setComments(Array.isArray(payload.comments) ? payload.comments : []);
      })
      .catch(() => {
        if (!cancelled) {
          setConfigured(false);
          setComments([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [episodeId]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    setStatus('sending');
    setError('');

    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ episode: episodeId, ...form }),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus('idle');
      setError(payload.error || 'Your comment could not be saved.');
      return;
    }

    setStatus('sent');
    setForm({ name: '', email: '', body: '' });
  }

  return (
    <section className="section reveal" data-screen-label="EP Comments" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)' }}>
      <div className="wrap-narrow">
        <div className="section-head"><span className="num">04</span><span className="line" /><span className="label">Conversation</span></div>
        <div style={{ borderTop: '1px solid var(--ink)' }}>
          {comments.length === 0 && (
            <p className="body" style={{ color: 'var(--ink-60)' }}>
              {configured ? 'No comments have been approved yet.' : 'Comments will appear here once Directus comments are configured.'}
            </p>
          )}
          {comments.map((comment) => (
            <article key={comment.id || comment.date || comment.body} style={{ padding: '22px 0', borderBottom: '1px solid var(--rule)' }}>
              <div className="smallcaps" style={{ color: 'var(--accent)' }}>{comment.name} {comment.date ? `· ${comment.date}` : ''}</div>
              <p className="body" style={{ marginTop: 10 }}>{comment.body}</p>
            </article>
          ))}
        </div>

        <form onSubmit={submit} style={{ marginTop: 34, padding: 28, background: 'var(--paper)', border: '1px solid var(--rule)' }}>
          <h3 className="hl-serif" style={{ fontSize: 28, margin: 0 }}>Add to the conversation.</h3>
          <p className="caption" style={{ marginTop: 8, color: 'var(--ink-60)', lineHeight: 1.7 }}>
            Comments are held for review before they appear.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            <CFInput label="Name" value={form.name} onChange={v => set('name', v)} />
            <CFInput label="Email" value={form.email} onChange={v => set('email', v)} />
          </div>
          <CFTextarea label="Comment" value={form.body} onChange={v => set('body', v)} />
          {error && <p className="caption" style={{ color: 'var(--accent)' }}>{error}</p>}
          {status === 'sent' && <p className="caption" style={{ color: 'var(--accent)' }}>Thanks. Your comment is waiting for review.</p>}
          <button className="btn btn--primary" style={{ marginTop: 18 }} disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Post comment'} <span className="arrow">→</span>
          </button>
        </form>
      </div>
    </section>
  );
}

function DataEpisodePage({ episode = MWTH_DATA.episodes[0] }) {
  const section = MWTH_SECTION('episode');
  const maker = MWTH_BY_MAKER(episode.maker);
  const products = MWTH_DATA.products.filter((p) => p.maker === maker.slug);
  const episodeBody = Array.isArray(episode.body) && episode.body.length ? episode.body : maker.practice;
  return (
    <>
      <MastheadMid mode="editorial" />
      <TemplateSlot name="before-content" />
      <article>
        <section className="section reveal" data-screen-label="EP Title" style={{ paddingBottom: 40 }}>
          <div className="wrap-narrow">
            <div className="smallcaps" style={{ marginBottom: 20 }}>Field Recording · Episode {episode.number}</div>
            <h1 className="hl-serif hl-xl" style={{ margin: 0, letterSpacing: '-0.02em' }}>
              {episode.guest} and <span className="italic">{episode.title.toLowerCase()}</span>.
            </h1>
            <div className="body" style={{ marginTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap', color: 'var(--ink-60)', fontSize: 14 }}>
              <span>Recorded in {episode.place}</span><span>·</span><span>{episode.duration}</span><span>·</span><span>{episode.date}</span><span>·</span><span>Hosted by Hugh McNeill</span>
            </div>
          </div>
        </section>
        <div className="wrap" style={{ paddingBottom: 40 }}>
          <Placeholder label={section.imageAlt || ('Field recording setup with ' + episode.guest)} h={620} src={section.image} objectPosition="center" />
          <div className="caption mono" style={{ marginTop: 10 }}>{episode.guest} · {episode.craft} · {episode.place}</div>
        </div>
        <div className="wrap-narrow" style={{ paddingBottom: 48 }}>
          <div style={{ padding: 28, background: 'var(--ink)', color: 'var(--paper)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <button style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--paper)', color: 'var(--ink)', border: 0, cursor: 'pointer', fontSize: 18 }}>▶</button>
              <div style={{ flex: 1 }}>
                <div style={{ height: 2, background: '#3a3632', position: 'relative' }}><div style={{ width: '35%', height: '100%', background: 'var(--paper)' }} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-40)' }}><span>18:42</span><span>{episode.duration}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="wrap-narrow" style={{ paddingBottom: 48 }}>
          <p className="dek" style={{ fontSize: 22, lineHeight: 1.5 }}>
            Hugh records {maker.name} in the workshop, following the tools,
            materials, and decisions behind {maker.craft.toLowerCase()}.
          </p>
          <div className="body" style={{ marginTop: 32, columnCount: 2, columnGap: 36, fontSize: 16 }}>
            {episodeBody.map((p, i) => <p key={i} style={{ marginTop: i === 0 ? 0 : undefined }}>{p}</p>)}
          </div>
        </div>
        <section className="section reveal" data-screen-label="EP Maker" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
          <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 56, alignItems: 'start' }}>
            <Placeholder label={`${maker.name} portrait`} h={420} light={!maker.image} src={maker.image} objectPosition="center" />
            <div>
              <h2 className="hl-serif hl-m" style={{ margin: 0 }}>{maker.name}</h2>
              <div className="smallcaps" style={{ margin: '10px 0 20px' }}>{maker.craft} · {maker.place}</div>
              <p className="body">{maker.dek}</p>
              <div style={{ display: 'flex', gap: 14, marginTop: 22, flexWrap: 'wrap' }}>
                <a className="btn" href={`/?page=maker&maker=${maker.slug}`} data-page="maker" data-maker={maker.slug}>{maker.name.split(' ')[0]}&rsquo;s maker page <span className="arrow">→</span></a>
                <a className="btn" href="/?page=podcasts" data-page="podcasts">Podcast archive</a>
              </div>
            </div>
          </div>
        </section>
        {products.length > 0 && (
          <section className="section reveal" data-screen-label="EP Products">
            <div className="wrap">
              <div className="section-head"><span className="num">03</span><span className="line" /><span className="label">Objects by {maker.name}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
                {products.map((product) => (
                  <a key={product.slug} href={`/?page=product&product=${product.slug}&maker=${maker.slug}`} data-page="product" data-product={product.slug} data-maker={maker.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Placeholder label={product.name} h={280} light={!product.image} src={product.image} objectPosition="center" />
                    <div className="hl-serif" style={{ fontSize: 22, marginTop: 12 }}>{product.name}</div>
                    <div className="caption mono" style={{ marginTop: 6 }}>{product.price} · {product.meta}</div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
        <EpisodeComments episode={episode} />
      </article>
      <TemplateSlot name="after-content" />
      <TemplateSlot name="related-content" />
      <FooterMid />
    </>
  );
}

Object.assign(window, { EpisodePage: DataEpisodePage, PodcastArchivePage });
