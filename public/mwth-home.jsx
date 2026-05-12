// Homepage sections — Editorial Documentary, mid-fi

function MastheadMid({ mode = 'editorial' }) {
  return (
    <header className="masthead" data-mode={mode}>
      {mode === 'editorial' ? (
        <>
          <div className="rule">
            <span>Vol. I · No. 07</span>
            <span>A journal of heritage craft</span>
            <span>Kilkenny · April 2026</span>
          </div>
          <h1 className="title">Made With These Hands</h1>
          <nav className="nav">
            <a href="#craft">Craft</a>
            <a href="#stories">Stories</a>
            <a href="#podcast">Podcast</a>
            <a href="#shop">Shop</a>
            <a href="#about">About</a>
          </nav>
        </>
      ) : (
        <>
          <h1 className="title">Made With These Hands</h1>
          <nav className="nav">
            <a href="#craft">Craft</a>
            <a href="#stories">Stories</a>
            <a href="#podcast">Podcast</a>
            <a href="#shop">Shop</a>
            <a href="#about">About</a>
          </nav>
        </>
      )}
    </header>
  );
}

function Placeholder({ label, h = 400, light = false, style = {} }) {
  return (
    <div className={`ph${light ? ' ph--light' : ''}`} style={{ height: h, ...style }}>
      <span className="ph-label">[ {label} ]</span>
    </div>
  );
}

function HeroA() {
  return (
    <section className="hero-a section reveal" data-screen-label="01 Hero" style={{ paddingTop: 48 }}>
      <div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 18 }}>The Opening · Feature 01</div>
        <h2 className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '14ch' }}>
          The hand that<br/>makes, <span className="italic">remembers</span>.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 56, marginTop: 44, alignItems: 'end' }}>
          <Placeholder label="Hero portrait — Hugh at the wheel, backlit, grinding a tumbler. 3/4, 35mm, available light." h={520} />
          <div>
            <p className="dek" style={{ margin: '0 0 24px' }}>
              A journal of craftspeople, heritage skills, and the quiet
              discipline of making things by hand. Told from the workshop
              floor, in their own words.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
              <a className="btn btn--primary" href="#craft">Explore Craft <span className="arrow">→</span></a>
              <a className="btn" href="#podcast">Listen to the Podcast</a>
            </div>
            <div className="rule-h" style={{ marginBottom: 14 }} />
            <div className="smallcaps" style={{ marginBottom: 10 }}>In this issue</div>
            <div className="hl-serif" style={{ fontSize: 18, lineHeight: 1.5, color: 'var(--ink-80)' }}>
              Glass in Kilkenny · Stoneware from West Cork · The last bookbinder in Dublin · A commission for a head of state.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroB() {
  return (
    <section className="hero-b reveal" data-screen-label="01 Hero">
      <Placeholder label="Full-bleed cover — hands cradling an engraved lead-crystal tumbler, raking side light" h={640} />
      <div className="wrap center" style={{ padding: '48px 40px 72px' }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>Field Notes · Vol. I</div>
        <h2 className="hl-serif hl-l" style={{ margin: '0 auto', maxWidth: '18ch' }}>
          Stories from the bench, the kiln,<br/>and the cutting wheel.
        </h2>
        <p className="dek" style={{ margin: '22px auto 28px', maxWidth: '40ch' }}>
          Thirty years at the wheel. A thousand makers on the record.
          This is the work of hands, kept in writing.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="btn btn--primary" href="#craft">Explore Craft <span className="arrow">→</span></a>
          <a className="btn" href="#podcast">Listen to the Podcast</a>
        </div>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section className="section reveal" id="about" data-screen-label="02 Mission"
             style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
      <div className="wrap">
        <div className="section-head">
          <span className="num">02</span>
          <span className="line" />
          <span className="label">Why We Publish</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 56 }}>
          <h3 className="hl-serif hl-m" style={{ margin: 0 }}>
            In a world of <span className="italic">finished objects</span>, the process has gone missing.
          </h3>
          <div className="body" style={{ columns: 2, columnGap: 28 }}>
            <p style={{ marginTop: 0 }}>Mass production gave us abundance and took something quieter in return — the mark of a person. A handmade object carries a memory that a machine-made one cannot.</p>
            <p>Made With These Hands is a record of the people who still stand at a bench. Their tools, their mistakes, their twelve-thousandth try. We publish, we listen, we keep the craft on paper.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Craft() {
  const items = [
    ['I',   'Glass Engraving', '14 makers', 'Tumblers, carafes, decanters — cut at the wheel.'],
    ['II',  'Jewellery',       '22 makers', 'Silver, gold, enamel. Heirloom-minded.'],
    ['III', 'Ceramics',        '31 makers', 'Stoneware and porcelain, thrown and hand-built.'],
    ['IV',  'Woodwork',        '18 makers', 'Green wood, turned bowls, bog-oak spoons.'],
    ['V',   'Collectors',      '9 pieces',  'One-off and numbered editions.'],
    ['VI',  'Textiles',        '12 makers', 'Linen, wool, naturally dyed.'],
  ];
  return (
    <section className="section reveal" id="craft" data-screen-label="03 Craft">
      <div className="wrap">
        <div className="section-head">
          <span className="num">03</span>
          <span className="line" />
          <span className="label">The Index</span>
        </div>
        <h3 className="hl-serif hl-m" style={{ margin: '0 0 36px', maxWidth: '20ch' }}>
          Disciplines in <span className="italic">this issue</span>.
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {items.map(([n, name, meta, blurb]) => (
            <a key={name} className="craft-card" href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Placeholder label={`${name.toLowerCase()} — object, raking light`} h={260} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
                <div>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-60)', marginRight: 8 }}>{n}</span>
                  <span className="hl-serif" style={{ fontSize: 22 }}>{name}</span>
                </div>
                <span className="caption">{meta}</span>
              </div>
              <p className="body" style={{ fontSize: 13, margin: '6px 0 0', color: 'var(--ink-60)' }}>{blurb}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function HughStory() {
  return (
    <section className="section reveal" id="stories" data-screen-label="04 Hugh"
             style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
      <div className="wrap">
        <div className="section-head">
          <span className="num">04</span>
          <span className="line" />
          <span className="label">Portrait of the Founder</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
          <Placeholder label="Hugh McNeill — half-lit, workshop, 3/4 portrait, shirt sleeves rolled" h={620} />
          <div>
            <div className="smallcaps" style={{ marginBottom: 14 }}>Hugh McNeill · Glass cutter & engraver · Kilkenny</div>
            <h3 className="hl-serif hl-l" style={{ margin: 0 }}>
              Thirty years<br/>at the <span className="italic">wheel</span>.
            </h3>
            <blockquote className="dek" style={{
              margin: '32px 0', padding: '20px 24px',
              borderLeft: '2px solid var(--accent)',
              fontSize: 22, lineHeight: 1.4, color: 'var(--ink)',
            }}>
              “I learned to cut glass before I learned to drive.
              The wheel teaches you to slow down — you cannot argue with it.”
            </blockquote>
            <p className="body" style={{ marginTop: 0 }}>
              Apprenticed in Waterford at seventeen. Commissioned for cathedrals, heads of state, and a president&rsquo;s desk.
              Today the workshop is still open on Canal Walk, the copper wheel still spinning, and Hugh records
              the makers who come through the door.
            </p>
            <a className="btn" href="#" style={{ marginTop: 18 }}>Read the full story <span className="arrow">→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Podcast() {
  const episodes = [
    ['047', 'Méabh Ó Riada',   'Bog oak, dowsing, and the grain of 4,000 years', '54 min'],
    ['046', 'Tomás Kelly',      'Silversmithing after the crash',                 '48 min'],
    ['045', 'Nuala Finn',       'What linen remembers',                           '1h 02'],
    ['044', 'Dáithí Ó Conchúir','Thatching the last reed-roofs of Donegal',       '57 min'],
  ];
  return (
    <section className="section reveal" id="podcast" data-screen-label="05 Podcast">
      <div className="wrap">
        <div className="section-head">
          <span className="num">05</span>
          <span className="line" />
          <span className="label">Field Recordings · The Podcast</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          <div>
            <h3 className="hl-serif hl-l" style={{ margin: 0, maxWidth: '14ch' }}>
              Conversations with the people who still <span className="italic">make things</span>.
            </h3>
            <p className="dek" style={{ margin: '24px 0' }}>
              Long-form interviews, recorded in workshops, kilns, and kitchens
              across Ireland and beyond. New episode every fortnight.
            </p>
            <div style={{ display: 'flex', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
              {['Apple', 'Spotify', 'Overcast', 'RSS'].map(p => (
                <a key={p} href="#" className="smallcaps" style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--ink-40)', paddingBottom: 2 }}>{p}</a>
              ))}
            </div>
            {/* featured player */}
            <div style={{ padding: 22, background: 'var(--ink)', color: 'var(--paper)' }}>
              <div className="smallcaps" style={{ color: 'var(--ink-40)', marginBottom: 8 }}>Now Playing · Episode 47</div>
              <div className="hl-serif" style={{ fontSize: 22, lineHeight: 1.25, marginBottom: 16, color: 'var(--paper)' }}>
                Méabh Ó Riada — the grain of 4,000 years
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'var(--paper)', color: 'var(--ink)', border: 0,
                  cursor: 'pointer', fontSize: 14,
                }}>▶</button>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 2, background: '#3a3632', position: 'relative' }}>
                    <div style={{ width: '35%', height: '100%', background: 'var(--paper)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-40)' }}>
                    <span>18:42</span><span>54:10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* episode list */}
          <div>
            {episodes.map(([n, guest, title, dur], i) => (
              <a key={n} href="#" style={{
                display: 'grid', gridTemplateColumns: '64px 1fr auto',
                gap: 18, padding: '22px 0',
                borderTop: i === 0 ? '1px solid var(--ink)' : '1px solid var(--rule)',
                textDecoration: 'none', color: 'inherit', alignItems: 'center',
              }}>
                <span className="mono" style={{ fontSize: 12, color: 'var(--ink-60)' }}>EP {n}</span>
                <div>
                  <div className="smallcaps" style={{ marginBottom: 4 }}>{guest}</div>
                  <div className="hl-serif" style={{ fontSize: 18, lineHeight: 1.3 }}>{title}</div>
                </div>
                <span className="caption mono">{dur}</span>
              </a>
            ))}
            <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 22, marginTop: 4 }}>
              <a className="btn" href="#">Browse all 47 episodes <span className="arrow">→</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArtistOfWeek() {
  return (
    <section className="section reveal" data-screen-label="06 Artist"
             style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
      <div className="wrap">
        <div className="section-head" style={{ marginBottom: 36 }}>
          <span className="num" style={{ color: 'var(--ink-40)' }}>06</span>
          <span className="line" style={{ background: '#3a3632' }} />
          <span className="label" style={{ color: 'var(--ink-40)' }}>Artist of the Week</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <Placeholder label="Saoirse Doolan at the bench — low light, hedgerow willow drying behind" h={540} />
          <div>
            <h3 className="hl-serif hl-l" style={{ color: 'var(--paper)', margin: 0 }}>
              Saoirse <span className="italic">Doolan</span>.
            </h3>
            <div className="smallcaps" style={{ color: 'var(--ink-40)', margin: '12px 0 24px' }}>
              Basketmaker · Co. Clare · Est. 2009
            </div>
            <p className="body" style={{ color: '#d8d1c4' }}>
              Saoirse works with hedgerow willow she coppices herself. Her
              baskets are held in the collection of the National Museum of
              Ireland, and carried by fishermen along the Atlantic coast.
              Each takes between three and five days.
            </p>
            <blockquote className="dek" style={{ color: 'var(--paper)', margin: '24px 0', paddingLeft: 20, borderLeft: '2px solid var(--paper)' }}>
              “You cut the willow when the leaves are gone and the sap is low.
              Everything waits for winter.”
            </blockquote>
            <a href="#" className="btn" style={{ borderColor: 'var(--paper)', color: 'var(--paper)' }}>
              Explore Saoirse&rsquo;s work <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyCraft() {
  return (
    <section className="section reveal" data-screen-label="07 Essay">
      <div className="wrap-narrow">
        <div className="section-head">
          <span className="num">07</span>
          <span className="line" />
          <span className="label">An Essay</span>
        </div>
        <h3 className="hl-serif hl-l" style={{ margin: '0 0 40px' }}>
          Sixty-three heritage crafts in Ireland are at risk of disappearing in a <span className="italic">generation</span>.
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 48 }}>
          {[
            ['63', 'crafts at risk of being lost'],
            ['11', 'considered critically endangered'],
            ['~9', 'living master glass engravers'],
          ].map(([n, t]) => (
            <div key={n} style={{ padding: '24px 0', borderTop: '1px solid var(--ink)' }}>
              <div className="hl-serif" style={{ fontSize: 64, lineHeight: 1, color: 'var(--accent)' }}>{n}</div>
              <div className="caption" style={{ marginTop: 10, maxWidth: '20ch' }}>{t}</div>
            </div>
          ))}
        </div>
        <div className="body" style={{ columns: 2, columnGap: 32, fontSize: 16 }}>
          <p style={{ marginTop: 0 }}>Thatching. Coopering. Drystone walling. Hand-cut glass.
          These are not hobbies — they are bodies of knowledge held in
          fewer than a dozen pairs of hands each. When those hands stop,
          the knowledge goes with them.</p>
          <p>Made With These Hands exists to put the tradition on the record and point readers toward the makers
          still taking apprentices. Ten percent of every sale goes to the Heritage Craft Fund.</p>
        </div>
        <div style={{ marginTop: 36 }}>
          <a className="btn" href="#">Read the essay <span className="arrow">→</span></a>
        </div>
      </div>
    </section>
  );
}

function ShopCTA() {
  return (
    <section className="section reveal" id="shop" data-screen-label="08 Shop"
             style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)' }}>
      <div className="wrap center">
        <div className="smallcaps" style={{ marginBottom: 18 }}>08 · The Shop</div>
        <h3 className="hl-serif hl-xl" style={{ margin: 0 }}>
          A small,<br/><span className="italic">slow shop</span>.
        </h3>
        <p className="dek" style={{ margin: '28px auto 32px', maxWidth: '44ch' }}>
          A rotating selection of handmade pieces and one-off collectors
          items, chosen by Hugh. Numbers are always small.
        </p>
        <a className="btn btn--primary" href="#">Browse the collection <span className="arrow">→</span></a>
      </div>
    </section>
  );
}

function FooterMid() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '64px 0 32px' }}>
      <div className="wrap">
        <div className="hl-serif" style={{ fontSize: 40, marginBottom: 32, color: 'var(--paper)' }}>
          Made With These Hands
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, paddingBottom: 40, borderBottom: '1px solid #3a3632' }}>
          {[
            ['Explore', ['Craft', 'Stories', 'Podcast', 'Shop']],
            ['Studio',  ['Hugh McNeill', 'Commissions', 'Workshops', 'Press']],
            ['Help',    ['Contact', 'Shipping', 'Returns', 'FAQ']],
            ['Follow',  ['Instagram', 'YouTube', 'Spotify', 'Newsletter']],
          ].map(([h, items]) => (
            <div key={h}>
              <div className="smallcaps" style={{ color: 'var(--ink-40)', marginBottom: 14 }}>{h}</div>
              {items.map(i => (
                <a key={i} href="#" style={{ display: 'block', color: '#d8d1c4', textDecoration: 'none', marginBottom: 8, fontSize: 14 }}>{i}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-40)', paddingTop: 22 }}>
          <span>© 2026 Made With These Hands · Canal Walk, Kilkenny, Ireland</span>
          <span>Privacy · Terms · Colophon</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  MastheadMid, HeroA, HeroB, Mission, Craft, HughStory,
  Podcast, ArtistOfWeek, WhyCraft, ShopCTA, FooterMid, Placeholder,
});
