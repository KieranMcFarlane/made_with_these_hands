// Shop (collection), Product detail, Hugh's Story, Artist Directory
// All share MastheadMid / FooterMid / Placeholder from mwth-home.jsx

// ── Shop / Collection ─────────────────────────────────────────
function ShopPage() {
  const pieces = [
    ['Lead-crystal tumbler', 'Hugh McNeill',    'Glass',      '£180', 'Kilkenny'],
    ['Lobster pot, small',   'Saoirse Doolan',  'Basketry',   '£220', 'Co. Clare'],
    ['Stoneware jug',        'Pádraig Brennan', 'Ceramics',   '£95',  'West Cork'],
    ['Bog-oak spoon',        'Méabh Ó Riada',   'Woodwork',   '£42',  'Co. Galway'],
    ['Silver cuff',          'Nuala Finn',      'Jewellery',  '£240', 'Dublin'],
    ['Linen throw, natural', 'Róisín Mac',      'Textiles',   '£165', 'Co. Down'],
    ['Engraved decanter',    'Hugh McNeill',    'Glass',      '£420', 'Kilkenny'],
    ['Gathering basket',     'Saoirse Doolan',  'Basketry',   '£165', 'Co. Clare'],
    ['Porcelain tea bowl',   'Yuki Halpin',     'Ceramics',   '£75',  'Wicklow'],
    ['Turned ash bowl',      'Seán Devlin',     'Woodwork',   '£88',  'Co. Mayo'],
    ['Gold signet ring',     'Nuala Finn',      'Jewellery',  '£640', 'Dublin'],
    ['Waxed canvas satchel', 'Leo Harrington',  'Leather',    '£320', 'Cork City'],
  ];
  const filters = ['All', 'Glass', 'Ceramics', 'Jewellery', 'Woodwork', 'Basketry', 'Textiles', 'Leather', 'Collectors'];
  const [active, setActive] = React.useState('All');
  const shown = active === 'All' ? pieces : pieces.filter(p => p[2] === active);
  const imageForPiece = (name, cat) => {
    if (name === 'Lobster pot, small' || name === 'Gathering basket' || cat === 'Basketry') {
      return '/images/mwth-product-lobster-pot.jpg';
    }
    if (name === 'Lead-crystal tumbler' || name === 'Engraved decanter' || cat === 'Glass') {
      return '/images/mwth-hero-glass-engraving.jpg';
    }
    return null;
  };

  return (
    <>
      <MastheadMid mode="editorial" />
      <section className="section reveal" data-screen-label="Shop Head" style={{ paddingBottom: 32 }}>
        <div className="wrap">
          <div className="smallcaps" style={{ marginBottom: 18 }}>The Shop · 118 pieces · Updated every Friday</div>
          <h1 className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '16ch' }}>
            A small, <span className="italic">slow shop</span>.
          </h1>
          <p className="dek" style={{ margin: '24px 0 0', maxWidth: '48ch' }}>
            Every object here was chosen by Hugh. Every maker is named,
            photographed, and on the record. Numbers are small by design.
          </p>
        </div>
      </section>

      {/* Filter rail */}
      <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', background: 'var(--paper)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div className="wrap" style={{ display: 'flex', gap: 4, padding: '14px 40px', overflow: 'auto' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)} style={{
              background: active === f ? 'var(--ink)' : 'transparent',
              color: active === f ? 'var(--paper)' : 'var(--ink-80)',
              border: 0, padding: '8px 14px', fontFamily: 'var(--sans)',
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{f}</button>
          ))}
          <div style={{ flex: 1 }} />
          <div className="smallcaps" style={{ alignSelf: 'center', color: 'var(--ink-60)' }}>Sort · Newest ▾</div>
        </div>
      </div>

      {/* Grid */}
      <section className="section" data-screen-label="Shop Grid" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36 }}>
            {shown.map(([name, maker, cat, price, place], i) => (
              <a key={name+i} href="#" onClick={(e) => { e.preventDefault(); window.__setPage && window.__setPage('product'); }}
                 className="reveal in" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Placeholder
                  label={`${name.toLowerCase()} — still life`}
                  h={360}
                  src={imageForPiece(name, cat)}
                  objectPosition={cat === 'Glass' ? 'center' : 'center'}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16 }}>
                  <div>
                    <div className="smallcaps" style={{ marginBottom: 6 }}>{maker} · {place}</div>
                    <div className="hl-serif" style={{ fontSize: 22 }}>{name}</div>
                  </div>
                  <div className="hl-serif" style={{ fontSize: 18 }}>{price}</div>
                </div>
                <div className="caption mono" style={{ marginTop: 6 }}>{cat} · signed · edition of 12</div>
              </a>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <a className="btn" href="#">Load more ({pieces.length}+ of 118) <span className="arrow">→</span></a>
          </div>
        </div>
      </section>

      {/* Editorial insert */}
      <section className="section reveal" data-screen-label="Shop Insert"
               style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <Placeholder
            label="Hugh selecting pieces in the workshop"
            h={360}
            src="/images/mwth-maker-portrait.jpg"
            objectPosition="center top"
          />
          <div>
            <div className="smallcaps" style={{ marginBottom: 14 }}>A note from Hugh</div>
            <h2 className="hl-serif hl-m" style={{ margin: 0 }}>
              I choose every piece <span className="italic">myself</span>.
            </h2>
            <p className="body" style={{ marginTop: 20 }}>
              If it is in the shop, I have held it, used it, or watched it made.
              I do not stock things I would not give to my own family.
              Ten percent of every sale goes to the Heritage Craft Fund.
            </p>
            <a className="btn" href="#" style={{ marginTop: 18 }}>Read about the fund <span className="arrow">→</span></a>
          </div>
        </div>
      </section>
      <FooterMid />
    </>
  );
}

// ── Product detail ───────────────────────────────────────────
function ProductPage() {
  return (
    <>
      <MastheadMid mode="editorial" />
      <div className="wrap" style={{ padding: '24px 40px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-60)' }}>
        <a href="#" onClick={(e)=>{e.preventDefault(); window.__setPage && window.__setPage('shop');}} style={{ color: 'inherit' }}>Shop</a>
        &nbsp;/&nbsp;Basketry&nbsp;/&nbsp;Saoirse Doolan&nbsp;/&nbsp;Lobster pot, small
      </div>

      <section className="section reveal" data-screen-label="Product" style={{ paddingTop: 8 }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 56 }}>
          {/* Gallery */}
          <div>
            <Placeholder
              label="Hero — lobster pot at ¾ angle, side light, linen plinth"
              h={620}
              src="/images/mwth-product-lobster-pot.jpg"
              objectPosition="center"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 10 }}>
              {['Detail — weave', 'Top-down', 'Maker holding it', 'Scale reference'].map(l => (
                <Placeholder
                  key={l}
                  label={l}
                  h={130}
                  light
                  src="/images/mwth-product-lobster-pot.jpg"
                  objectPosition="center"
                />
              ))}
            </div>
          </div>

          {/* Buy column */}
          <div>
            <div className="smallcaps" style={{ marginBottom: 14 }}>Made by Saoirse Doolan · Co. Clare</div>
            <h1 className="hl-serif hl-l" style={{ margin: 0, letterSpacing: '-0.01em' }}>
              Lobster pot, <span className="italic">small</span>.
            </h1>
            <div className="hl-serif" style={{ fontSize: 32, marginTop: 20, color: 'var(--ink)' }}>£220</div>
            <div className="caption mono" style={{ marginTop: 6 }}>Edition of 12 · 4 remaining · Signed underside</div>

            <p className="body" style={{ marginTop: 24 }}>
              Hand-woven from hedgerow willow, coppiced by Saoirse on the south
              shore of Galway Bay. Each takes between three and five days to make.
              The willow is cut in winter and woven green, so each pot dries into
              a shape slightly of its own.
            </p>

            <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
              <button className="btn btn--primary" style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => window.__openBasket && window.__openBasket(
                  { name: 'Lobster pot, small', maker: 'Saoirse Doolan', price: '£220' })}>
                Add to basket <span className="arrow">→</span>
              </button>
              <button className="btn" title="Save">♡</button>
            </div>

            <div className="caption" style={{ marginTop: 16, lineHeight: 1.7 }}>
              Ships from Kilkenny within 5 working days · Free UK &amp; Ireland<br/>
              10% of this sale goes to the Heritage Craft Fund
            </div>

            {/* Specs */}
            <div style={{ marginTop: 32, borderTop: '1px solid var(--ink)' }}>
              {[
                ['Material',   'Coppiced willow, hedgerow'],
                ['Dimensions', '32 × 24 × 18 cm'],
                ['Weight',     '1.1 kg'],
                ['Signed',     'Maker mark, underside'],
                ['Care',       'Keep dry; oil annually if used outdoors'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', padding: '14px 0', borderBottom: '1px solid var(--rule)', fontSize: 13 }}>
                  <span className="smallcaps">{k}</span>
                  <span className="hl-serif" style={{ fontSize: 15 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Maker card */}
      <section className="section reveal" data-screen-label="Product Maker" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'center' }}>
          <Placeholder
            label="Saoirse at the bench"
            h={320}
            src="/images/mwth-product-lobster-pot.jpg"
            objectPosition="center"
          />
          <div>
            <div className="smallcaps" style={{ marginBottom: 12 }}>The Maker</div>
            <h2 className="hl-serif hl-m" style={{ margin: 0 }}>Saoirse Doolan</h2>
            <p className="body" style={{ marginTop: 16 }}>
              Basketmaker in Co. Clare. Coppices her own willow.
              Holds work in the National Museum of Ireland.
              Hear her in <a className="link" href="#" onClick={(e)=>{e.preventDefault(); window.__setPage('episode');}}>Field Recording 032</a>.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 22 }}>
              <a className="btn" href="#" onClick={(e)=>{e.preventDefault(); window.__setPage('artists');}}>Saoirse&rsquo;s shelf <span className="arrow">→</span></a>
              <a className="btn" href="#" onClick={(e)=>{e.preventDefault(); window.__setPage('episode');}}>Listen to the conversation</a>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="section reveal" data-screen-label="Product More">
        <div className="wrap">
          <div className="section-head">
            <span className="num">—</span>
            <span className="line" />
            <span className="label">More from Saoirse</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[['Gathering basket', '£165'], ['Herb trug', '£95'], ['Wall hanging', '£340'], ['Creel, large', '£280']].map(([n,p]) => (
              <a key={n} href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Placeholder label={n.toLowerCase()} h={240} light />
                <div className="hl-serif" style={{ fontSize: 17, marginTop: 12 }}>{n}</div>
                <div className="caption mono" style={{ marginTop: 4 }}>Saoirse Doolan · {p}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <FooterMid />
    </>
  );
}

// ── Basket drawer ────────────────────────────────────────────
function BasketDrawer() {
  const [items, setItems] = React.useState([]);
  const [open, setOpen]   = React.useState(false);
  React.useEffect(() => {
    window.__openBasket = (it) => {
      setItems(x => [...x, { ...it, id: Date.now() }]);
      setOpen(true);
    };
    window.__toggleBasket = () => setOpen(o => !o);
  }, []);
  const total = items.reduce((s, i) => s + Number(String(i.price).replace(/[^0-9.]/g, '')), 0);
  return (
    <>
      <div onClick={() => setOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(27,25,24,0.35)', zIndex: 80,
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.25s',
      }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, zIndex: 81,
        background: 'var(--paper)', borderLeft: '1px solid var(--ink)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(.2,.7,.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 28px', borderBottom: '1px solid var(--ink)' }}>
          <div className="smallcaps">Basket · {items.length} {items.length === 1 ? 'piece' : 'pieces'}</div>
          <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 0, fontSize: 20, cursor: 'pointer', color: 'var(--ink)' }}>×</button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px' }}>
          {items.length === 0 && (
            <div className="body" style={{ color: 'var(--ink-60)', paddingTop: 40, textAlign: 'center' }}>
              Your basket is quiet.
            </div>
          )}
          {items.map(it => (
            <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 14, padding: '16px 0', borderBottom: '1px solid var(--rule)' }}>
              <Placeholder label="" h={64} light />
              <div>
                <div className="smallcaps">{it.maker}</div>
                <div className="hl-serif" style={{ fontSize: 17, marginTop: 4 }}>{it.name}</div>
                <div className="caption mono" style={{ marginTop: 4 }}>Qty 1</div>
              </div>
              <div className="hl-serif" style={{ fontSize: 15 }}>{it.price}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '20px 28px', borderTop: '1px solid var(--ink)', background: 'var(--paper-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="smallcaps">Subtotal</span>
            <span className="hl-serif" style={{ fontSize: 22 }}>£{total.toFixed(0)}</span>
          </div>
          <div className="caption" style={{ marginBottom: 14, color: 'var(--ink-60)' }}>
            Shipping + Heritage Fund contribution calculated at checkout.
          </div>
          <button className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }} disabled={items.length === 0}>
            Checkout <span className="arrow">→</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Hugh's Story ─────────────────────────────────────────────
function HughStoryPage() {
  return (
    <>
      <MastheadMid mode="editorial" />
      <section className="section reveal" data-screen-label="Hugh Hero" style={{ paddingBottom: 40 }}>
        <div className="wrap-narrow">
          <div className="smallcaps" style={{ marginBottom: 20 }}>Portrait · A founder&rsquo;s story</div>
          <h1 className="hl-serif hl-xl" style={{ margin: 0, letterSpacing: '-0.02em' }}>
            The man who learned to cut glass before he learned to <span className="italic">drive</span>.
          </h1>
          <p className="dek" style={{ marginTop: 24 }}>
            Hugh McNeill has been at the cutting wheel for thirty-two years.
            His workshop on Canal Walk in Kilkenny is half studio, half archive —
            and, since 2022, half radio booth.
          </p>
        </div>
      </section>

      <div className="wrap" style={{ paddingBottom: 56 }}>
        <Placeholder label="Hugh at the wheel — full-bleed, warm window light, copper wheel spinning" h={680} />
        <div className="caption mono" style={{ marginTop: 10 }}>Hugh McNeill in his workshop. Photo: Ronan Park, March 2026.</div>
      </div>

      {/* Long form + sidebar */}
      <section className="section reveal" data-screen-label="Hugh Body">
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 72, alignItems: 'start' }}>
          <div className="body" style={{ fontSize: 17, lineHeight: 1.75, color: 'var(--ink-80)' }}>
            <p style={{ marginTop: 0, fontSize: 19 }}>
              <span className="hl-serif" style={{ fontSize: 56, float: 'left', lineHeight: 0.9, marginRight: 12, marginTop: 6, color: 'var(--accent)' }}>H</span>
              ugh grew up in a narrow house in Dungarvan, where his father
              kept a pair of rotary cutters in a biscuit tin under the sink.
              He started turning pieces on a school bench at fourteen, and
              at seventeen walked into Waterford Crystal looking for an
              apprenticeship. They gave him one.
            </p>
            <p>
              The apprenticeship was five years long and almost silent.
              You learned by watching. You made the same cut ten thousand
              times before you were allowed to make the second. The
              cutters, most of them in their sixties by then, were kind
              and exacting. Hugh remembers a man called John Fitzpatrick
              who refused to let anyone else sweep his bench.
            </p>

            <h3 className="hl-serif hl-s" style={{ margin: '36px 0 16px' }}>On his own in Kilkenny</h3>
            <p>
              Waterford closed a division in 2008. Hugh took his tools
              and rented a room behind a bicycle shop on Canal Walk.
              Commissions came slowly, then steadily: a cathedral
              window in Down; a pair of decanters for an embassy; a
              tumbler for a visiting head of state. He still works
              alone most mornings. Thursdays he takes visitors.
            </p>

            <h3 className="hl-serif hl-s" style={{ margin: '36px 0 16px' }}>The podcast</h3>
            <p>
              In 2022, after recording a long conversation with a
              neighbouring ceramicist on a borrowed phone, Hugh
              started what became <em>Field Recordings</em>.
              Forty-seven episodes later, the podcast has become the
              closest thing Ireland has to an oral archive of its
              heritage crafts.
            </p>

            <blockquote className="hl-serif italic" style={{
              margin: '40px -20px', padding: '28px 28px',
              fontSize: 26, lineHeight: 1.35,
              borderLeft: '2px solid var(--accent)', color: 'var(--ink)',
            }}>
              “I am not trying to save anything. I am trying to keep
              the company of people who make things, and put what they
              say on the record.”
            </blockquote>

            <h3 className="hl-serif hl-s" style={{ margin: '36px 0 16px' }}>What he takes on now</h3>
            <p>
              Hugh accepts two commissions a year, and one apprentice
              every third year. The rest of his time goes to cutting
              his own work, keeping the shop narrow, and recording.
              He is fifty-four this summer. He still sweeps his own bench.
            </p>
          </div>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: 28 }}>
            <div style={{ padding: 28, background: 'var(--paper-2)' }}>
              <div className="smallcaps" style={{ marginBottom: 14 }}>The Workshop</div>
              {[
                ['Established',     '2008'],
                ['Address',         'Canal Walk, Kilkenny'],
                ['Apprenticeship',  'Waterford, 1994–99'],
                ['Commissions/yr',  '2'],
                ['Podcast eps',     '47 and counting'],
                ['Visitors',        'Thursdays, by arrangement'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '10px 0', borderBottom: '1px solid var(--rule)', fontSize: 13 }}>
                  <span className="smallcaps" style={{ fontSize: 10 }}>{k}</span>
                  <span className="hl-serif" style={{ fontSize: 15 }}>{v}</span>
                </div>
              ))}
              <a className="btn" href="#" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>
                Enquire about a commission
              </a>
            </div>
            <Placeholder label="Detail — Hugh&rsquo;s hands at the wheel" h={260} style={{ marginTop: 20 }} />
            <Placeholder label="The copper wheel" h={180} light style={{ marginTop: 10 }} />
          </aside>
        </div>
      </section>

      {/* Timeline */}
      <section className="section reveal" data-screen-label="Hugh Timeline" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap">
          <div className="section-head">
            <span className="num">—</span>
            <span className="line" />
            <span className="label">A selected chronology</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 28 }}>
            {[
              ['1971', 'Born', 'Dungarvan, Co. Waterford.'],
              ['1994', 'Apprenticeship', 'Waterford Crystal.'],
              ['2001', 'First commission', 'Cathedral window, Co. Down.'],
              ['2008', 'Own workshop', 'Canal Walk, Kilkenny.'],
              ['2015', 'Head of state', 'Commissioned tumbler set.'],
              ['2022', 'The podcast', 'Field Recordings begins.'],
            ].map(([y, t, d]) => (
              <div key={y} style={{ borderTop: '1px solid var(--ink)', paddingTop: 16 }}>
                <div className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>{y}</div>
                <div className="hl-serif" style={{ fontSize: 18, marginTop: 8 }}>{t}</div>
                <div className="caption" style={{ marginTop: 6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FooterMid />
    </>
  );
}

// ── Artist Directory (alphabetical, editorial index) ────────
function ArtistsPage() {
  const artists = [
    ['A', []],
    ['B', [['Pádraig Brennan', 'Ceramics', 'West Cork', '23 pieces']]],
    ['C', []],
    ['D', [
      ['Seán Devlin', 'Woodwork', 'Co. Mayo', '9 pieces'],
      ['Saoirse Doolan', 'Basketry', 'Co. Clare', '12 pieces · Artist of the Week'],
    ]],
    ['E', []],
    ['F', [['Nuala Finn', 'Jewellery', 'Dublin', '18 pieces']]],
    ['G', []],
    ['H', [
      ['Yuki Halpin', 'Ceramics', 'Wicklow', '14 pieces'],
      ['Leo Harrington', 'Leather', 'Cork City', '7 pieces'],
    ]],
    ['I', []], ['J', []],
    ['K', [['Tomás Kelly', 'Silversmithing', 'Dublin', '11 pieces · EP 046']]],
    ['L', []],
    ['M', [['Róisín Mac', 'Textiles', 'Co. Down', '15 pieces']]],
    ['N', []],
    ['Mc / O', [
      ['Hugh McNeill', 'Glass', 'Kilkenny', 'Founder · 26 pieces'],
      ['Dáithí Ó Conchúir', 'Thatching', 'Co. Donegal', 'EP 044 · commissions only'],
      ['Méabh Ó Riada', 'Bog-oak woodwork', 'Co. Galway', '8 pieces · EP 047'],
    ]],
    ['P', []], ['Q', []], ['R', []], ['S', []], ['T', []], ['U', []],
    ['V', []], ['W', []], ['X', []], ['Y', []], ['Z', []],
  ];
  return (
    <>
      <MastheadMid mode="editorial" />
      <section className="section reveal" data-screen-label="Artists Head" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <div className="smallcaps" style={{ marginBottom: 18 }}>The Directory · 47 makers on the record</div>
          <h1 className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '16ch' }}>
            Every maker <span className="italic">by name</span>.
          </h1>
          <p className="dek" style={{ margin: '24px 0 0', maxWidth: '46ch' }}>
            An alphabetical index of every artist whose work is in the
            shop, or whose voice is on the podcast. Updated as they are.
          </p>
        </div>
      </section>

      {/* A-Z rail */}
      <div className="wrap" style={{ padding: '12px 40px', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', display: 'flex', flexWrap: 'wrap', gap: 14, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-60)' }}>
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => (
          <a key={c} href={`#L-${c}`} style={{ color: 'inherit', textDecoration: 'none', padding: '2px 4px' }}>{c}</a>
        ))}
      </div>

      {/* Entries */}
      <section className="section" data-screen-label="Artists Index" style={{ paddingTop: 56 }}>
        <div className="wrap-narrow">
          {artists.filter(([, list]) => list.length > 0).map(([letter, list]) => (
            <div key={letter} id={`L-${letter}`} style={{ marginBottom: 56 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 32, alignItems: 'start' }}>
                <div className="hl-serif" style={{ fontSize: 64, lineHeight: 0.9, color: 'var(--accent)' }}>
                  {letter}
                </div>
                <div>
                  {list.map(([name, craft, place, meta]) => (
                    <a key={name} href="#" onClick={(e)=>{e.preventDefault(); window.__setPage('product');}}
                       style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 22,
                                padding: '22px 0', borderTop: '1px solid var(--rule)',
                                textDecoration: 'none', color: 'inherit', alignItems: 'baseline' }}>
                      <div>
                        <div className="hl-serif" style={{ fontSize: 26, letterSpacing: '-0.01em' }}>{name}</div>
                        <div className="caption" style={{ marginTop: 6 }}>{meta}</div>
                      </div>
                      <div className="smallcaps">{craft}</div>
                      <div className="smallcaps" style={{ textAlign: 'right' }}>{place} <span className="arrow" style={{ marginLeft: 8 }}>→</span></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Submit CTA */}
      <section className="section reveal" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)' }}>
        <div className="wrap center">
          <div className="smallcaps" style={{ marginBottom: 14 }}>For makers</div>
          <h2 className="hl-serif hl-l" style={{ margin: 0 }}>
            Working by hand? <span className="italic">We are listening.</span>
          </h2>
          <p className="dek" style={{ margin: '20px auto 24px', maxWidth: '44ch' }}>
            Makers submit to the directory by introduction. Write to Hugh
            with a note about your practice and a picture of your bench.
          </p>
          <a className="btn btn--primary" href="#">Write to the studio <span className="arrow">→</span></a>
        </div>
      </section>
      <FooterMid />
    </>
  );
}

Object.assign(window, { ShopPage, ProductPage, BasketDrawer, HughStoryPage, ArtistsPage });
