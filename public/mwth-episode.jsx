// Podcast episode sub-page — mid-fi

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
                  <a className="btn" href="#">Méabh&rsquo;s pieces in the shop <span className="arrow">→</span></a>
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
                <a key={title} href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
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

Object.assign(window, { EpisodePage });
