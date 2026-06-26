// Objects collection, Product detail, Hugh's Story, Artist Directory
// All share MastheadMid / FooterMid / Placeholder from mwth-home.jsx

// ── Objects / Collection ───────────────────────────────────────
function DataShopPage() {
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
<div className="smallcaps" style={{ marginBottom: 18 }}>{section.eyebrow}</div>
          <RichText as="h1" html={section.title} className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '16ch' }} />
          <p className="dek" style={{ margin: '24px 0 0', maxWidth: '50ch' }}>{section.dek}</p>
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
              If it is listed here, I have held it, used it, or watched it made.
              I do not stock things I would not give to my own family.
              Enquiries go straight to the studio, where Hugh follows up personally.
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
        <a href="/?page=shop" data-page="shop" style={{ color: 'inherit' }}>Objects</a>
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

          {/* Enquiry column */}
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
                onClick={() => window.__openEnquiry && window.__openEnquiry(
                  { name: 'Lobster pot, small', maker: 'Saoirse Doolan', price: '£220' })}>
                Enquire about this item <span className="arrow">→</span>
              </button>
              <button className="btn" title="Save">♡</button>
            </div>

            <div className="caption" style={{ marginTop: 16, lineHeight: 1.7 }}>
              Hugh replies personally from the studio. No cart, no automated order.
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
              Hear her in <a className="link" href="/?page=maker" data-page="maker">Field Recording 032</a>.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 22 }}>
              <a className="btn" href="/?page=maker" data-page="maker">Saoirse&rsquo;s shelf <span className="arrow">→</span></a>
              <a className="btn" href="/?page=maker" data-page="maker">Listen to the conversation</a>
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

// ── Maker profile, shelf, and podcast ────────────────────────
function SaoirseMakerPage() {
  const shelf = [
    ['Lobster pot, small', '£220', 'Working basket · edition of 12', '/images/mwth-product-lobster-pot.jpg'],
    ['Gathering basket', '£165', 'Hedgerow willow · signed underside', '/images/mwth-product-lobster-pot.jpg'],
    ['Herb trug', '£95', 'Kitchen piece · made to order', '/images/mwth-product-lobster-pot.jpg'],
    ['Creel, large', '£280', 'Archive pattern · 2 remaining', '/images/mwth-product-lobster-pot.jpg'],
    ['Wall hanging', '£340', 'Museum study · one-off', '/images/mwth-product-lobster-pot.jpg'],
    ['Willow repair kit', '£38', 'Studio tools · small run', null],
  ];

  return (
    <>
      <MastheadMid mode="editorial" />
      <section className="section reveal" data-screen-label="Maker Hero" style={{ paddingBottom: 40 }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 64, alignItems: 'end' }}>
          <Placeholder
            label="Saoirse Doolan in the willow shed, Co. Clare"
            h={620}
            src="/images/mwth-product-lobster-pot.jpg"
            objectPosition="center"
          />
          <div>
            <div className="smallcaps" style={{ marginBottom: 18 }}>The Maker · Basketry · Co. Clare</div>
            <h1 className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '12ch' }}>
              Saoirse <span className="italic">Doolan</span>.
            </h1>
            <p className="dek" style={{ margin: '24px 0 0', maxWidth: '42ch' }}>
              Basketmaker in Co. Clare. Coppices her own willow. Holds work in
              the National Museum of Ireland.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 36 }}>
              {[
                ['Established', '2009'],
                ['Shelf', '12 pieces'],
                ['Podcast', 'Field Recording 032'],
              ].map(([k, v]) => (
                <div key={k} style={{ borderTop: '1px solid var(--ink)', paddingTop: 14 }}>
                  <div className="smallcaps" style={{ fontSize: 10 }}>{k}</div>
                  <div className="hl-serif" style={{ fontSize: 20, marginTop: 6 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
              <a className="btn btn--primary" href="#saoirse-shelf">View the shelf <span className="arrow">→</span></a>
              <a className="btn" href="#saoirse-podcast">Listen with Hugh</a>
              <a className="btn" href="/?page=podcasts" data-page="podcasts">Podcast archive</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" data-screen-label="Maker Story" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          <div>
            <div className="smallcaps" style={{ marginBottom: 14 }}>Practice</div>
            <h2 className="hl-serif hl-m" style={{ margin: 0 }}>
              Winter willow, cut by hand, woven while still <span className="italic">green</span>.
            </h2>
          </div>
          <div className="body" style={{ columns: 2, columnGap: 34 }}>
            <p style={{ marginTop: 0 }}>
              Saoirse works a small stand of willow near the Atlantic coast,
              cutting in winter when the sap is low and sorting every rod by
              hand before it enters the shed.
            </p>
            <p>
              Her baskets sit between field utility and collection object:
              lobster pots, gathering baskets, trugs, and woven studies that
              preserve patterns she learned from older Clare makers.
            </p>
          </div>
        </div>
      </section>

      <section className="section reveal" id="saoirse-shelf" data-screen-label="Maker Shelf">
        <div className="wrap">
          <div className="section-head">
            <span className="num">01</span>
            <span className="line" />
            <span className="label">Saoirse&rsquo;s shelf · product archive</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {shelf.map(([name, price, meta, src]) => (
              <a key={name} href="/?page=product" data-page="product" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Placeholder label={`${name.toLowerCase()} — Saoirse Doolan archive`} h={330} light={!src} src={src} objectPosition="center" />
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 14, alignItems: 'baseline' }}>
                  <div>
                    <div className="hl-serif" style={{ fontSize: 22 }}>{name}</div>
                    <div className="caption mono" style={{ marginTop: 6 }}>{meta}</div>
                  </div>
                  <div className="hl-serif" style={{ fontSize: 18 }}>{price}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal" id="saoirse-podcast" data-screen-label="Maker Podcast" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 56, alignItems: 'center' }}>
          <Placeholder
            label="Hugh recording Field Recording 032 with Saoirse Doolan"
            h={420}
            src="/images/mwth-podcast-bench.jpg"
            objectPosition="center"
          />
          <div>
            <div className="smallcaps" style={{ color: 'var(--ink-40)', marginBottom: 16 }}>Field Recording 032 · Hosted by Hugh McNeill</div>
            <h2 className="hl-serif hl-l" style={{ color: 'var(--paper)', margin: 0 }}>
              Saoirse Doolan and the winter <span className="italic">willow</span>.
            </h2>
            <p className="body" style={{ color: '#d8d1c4', marginTop: 20 }}>
              Hugh visits Saoirse in her Clare shed to talk coppicing, coastal
              weather, inherited basket patterns, and why useful objects still
              belong in museums.
            </p>
            <div style={{ marginTop: 26, padding: 24, background: '#201d1b', border: '1px solid #3a3632' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <button style={{ width: 52, height: 52, borderRadius: '50%', border: 0, background: 'var(--paper)', color: 'var(--ink)', cursor: 'pointer' }}>▶</button>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 2, background: '#3a3632' }}>
                    <div style={{ width: '24%', height: '100%', background: 'var(--paper)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-40)' }}>
                    <span>12:08</span><span>49:35</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 18, paddingTop: 16, borderTop: '1px solid #3a3632' }}>
                {['Apple', 'Spotify', 'Overcast', 'RSS', 'Transcript'].map(l => (
                  <a key={l} href="#" className="smallcaps" style={{ color: 'var(--paper)', textDecoration: 'none', fontSize: 10 }}>{l}</a>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
              <a className="btn" href="/?page=podcasts" data-page="podcasts" style={{ borderColor: 'var(--paper)', color: 'var(--paper)' }}>All Field Recordings <span className="arrow">→</span></a>
              <a className="btn" href="/?page=episode" data-page="episode" style={{ borderColor: 'var(--paper)', color: 'var(--paper)' }}>Latest episode</a>
            </div>
          </div>
        </div>
      </section>
      <FooterMid />
    </>
  );
}

function EnquiryDrawer() {
  const [item, setItem] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    window.__openEnquiry = (it) => {
      setItem(it);
      setForm((current) => ({
        ...current,
        message: current.message || `Hello Hugh,\n\nI would like to enquire about ${it.name}.`,
      }));
      setStatus('idle');
      setError('');
      setOpen(true);
    };
    window.__toggleEnquiry = () => setOpen(o => !o);
  }, []);

  const set = (key, value) => setForm(current => ({ ...current, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    if (!item) return;
    setStatus('sending');
    setError('');

    const response = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: item.name,
        makerName: item.maker,
        productPrice: item.price,
        productUrl: window.location.href,
        ...form,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus('idle');
      setError(payload.error || 'The enquiry could not be sent. Please try again.');
      return;
    }

    setStatus('sent');
  }

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
          <div>
            <div className="smallcaps">Product enquiry</div>
            <div className="hl-serif" style={{ fontSize: 26, marginTop: 6 }}>Write to Hugh.</div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 0, fontSize: 20, cursor: 'pointer', color: 'var(--ink)' }}>×</button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px' }}>
          {!item && (
            <div className="body" style={{ color: 'var(--ink-60)', paddingTop: 40, textAlign: 'center' }}>
              Open an item and send a note from its product page.
            </div>
          )}
          {item && status === 'sent' && (
            <div style={{ paddingTop: 28 }}>
              <div className="smallcaps" style={{ color: 'var(--accent)' }}>Enquiry sent</div>
              <div className="hl-serif" style={{ fontSize: 24, marginTop: 10 }}>Hugh has your note.</div>
              <p className="body" style={{ color: 'var(--ink-60)' }}>He can follow up personally about {item.name}.</p>
              <button className="btn btn--primary" style={{ marginTop: 18 }} onClick={() => setOpen(false)}>Close</button>
            </div>
          )}
          {item && status !== 'sent' && (
            <form onSubmit={submit}>
              <div style={{ padding: '16px 0', borderBottom: '1px solid var(--rule)' }}>
                <div className="smallcaps">{item.maker}</div>
                <div className="hl-serif" style={{ fontSize: 20, marginTop: 4 }}>{item.name}</div>
                <div className="caption mono" style={{ marginTop: 6 }}>{item.price}</div>
              </div>
              <CFInput label="Your name" value={form.name} onChange={v => set('name', v)} />
              <CFInput label="Email" value={form.email} onChange={v => set('email', v)} />
              <CFInput label="Phone (optional)" value={form.phone} onChange={v => set('phone', v)} />
              <CFTextarea label="Message" value={form.message} onChange={v => set('message', v)} />
              {error && <p className="caption" style={{ color: 'var(--accent)', marginTop: 14 }}>{error}</p>}
              <button className="btn btn--primary" style={{ width: '100%', justifyContent: 'center', marginTop: 18 }} disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Send enquiry'} <span className="arrow">→</span>
              </button>
              <p className="caption" style={{ marginTop: 14, lineHeight: 1.7, color: 'var(--ink-60)' }}>
                This sends an email to the studio so Hugh can reply personally.
              </p>
            </form>
          )}
        </div>
      </aside>
    </>
  );
}

// ── Hugh's Story ─────────────────────────────────────────────
function HughStoryPage() {
  const section = MWTH_SECTION('hugh_page');
  const body = MWTH_LIST('hugh_page', 'body');
  const stats = section.stats || [];
  const timeline = section.timeline || [];
  return (
    <>
      <MastheadMid mode="editorial" />
      <section className="section reveal" data-screen-label="Hugh Hero" style={{ paddingBottom: 40 }}>
        <div className="wrap-narrow"><div className="smallcaps" style={{ marginBottom: 20 }}>{section.eyebrow}</div><RichText as="h1" html={section.title} className="hl-serif hl-xl" style={{ margin: 0, letterSpacing: '-0.02em' }} /><p className="dek" style={{ marginTop: 24 }}>{section.dek}</p></div>
      </section>
      <div className="wrap" style={{ paddingBottom: 56 }}><Placeholder label={section.imageAlt} h={680} src={section.image} objectPosition="center" /><div className="caption mono" style={{ marginTop: 10 }}>{section.imageCaption}</div></div>
      <section className="section reveal" data-screen-label="Hugh Body"><div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 72, alignItems: 'start' }}><div className="body" style={{ fontSize: 17, lineHeight: 1.75, color: 'var(--ink-80)' }}>{body.map((paragraph, index) => <p key={index} style={{ marginTop: index === 0 ? 0 : undefined }}>{paragraph}</p>)}{section.quote && <blockquote className="hl-serif italic" style={{ margin: '40px -20px', padding: '28px 28px', fontSize: 26, lineHeight: 1.35, borderLeft: '2px solid var(--accent)', color: 'var(--ink)' }}>&ldquo;{section.quote}&rdquo;</blockquote>}</div><aside style={{ position: 'sticky', top: 28 }}><div style={{ padding: 28, background: 'var(--paper-2)' }}><div className="smallcaps" style={{ marginBottom: 14 }}>The Workshop</div>{stats.map(([k, v]) => <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '10px 0', borderBottom: '1px solid var(--rule)', fontSize: 13 }}><span className="smallcaps" style={{ fontSize: 10 }}>{k}</span><span className="hl-serif" style={{ fontSize: 15 }}>{v}</span></div>)}<a className="btn" href="/?page=commissions" data-page="commissions" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>Enquire about a commission</a></div><Placeholder label="Detail - Hugh hands at the wheel" h={260} src={section.image} objectPosition="center" style={{ marginTop: 20 }} /></aside></div></section>
      <section className="section reveal" data-screen-label="Hugh Timeline" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}><div className="wrap"><div className="section-head"><span className="num">-</span><span className="line" /><span className="label">A selected chronology</span></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 28 }}>{timeline.map(([y, t, d]) => <div key={y} style={{ borderTop: '1px solid var(--ink)', paddingTop: 16 }}><div className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>{y}</div><div className="hl-serif" style={{ fontSize: 18, marginTop: 8 }}>{t}</div><div className="caption" style={{ marginTop: 6 }}>{d}</div></div>)}</div></div></section>
      <FooterMid />
    </>
  );
}

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
            object archive, or whose voice is on the podcast. Updated as they are.
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
                    <a key={name} href={name === 'Saoirse Doolan' ? '/?page=maker' : '/?page=product'} data-page={name === 'Saoirse Doolan' ? 'maker' : 'product'}
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

function MakerLink({ maker, children, className, style }) {
  return (
    <a href={`/?page=maker&maker=${maker.slug}`} data-page="maker" data-maker={maker.slug} className={className} style={style}>
      {children || maker.name}
    </a>
  );
}

function ProductLink({ product, children, className, style }) {
  return (
    <a href={`/?page=product&product=${product.slug}&maker=${product.maker}`} data-page="product" data-product={product.slug} data-maker={product.maker} className={className} style={style}>
      {children || product.name}
    </a>
  );
}

function CraftLink({ craft, children, className, style }) {
  return (
    <a href={`/?page=craft&craft=${craft.slug}`} data-page="craft" data-craft={craft.slug} className={className} style={style}>
      {children || craft.name}
    </a>
  );
}

function DataProductCard({ product }) {
  const maker = MWTH_BY_MAKER(product.maker);
  return (
    <article className="reveal in">
      <ProductLink product={product} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <Placeholder label={`${product.name.toLowerCase()} — still life`} h={330} light={!product.image} src={product.image} objectPosition="center" />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 14, alignItems: 'baseline' }}>
          <div>
            <div className="smallcaps" style={{ marginBottom: 6 }}>{maker.name} · {product.place}</div>
            <div className="hl-serif" style={{ fontSize: 22 }}>{product.name}</div>
          </div>
          <div className="hl-serif" style={{ fontSize: 18 }}>{product.price}</div>
        </div>
        <div className="caption mono" style={{ marginTop: 6 }}>{product.meta}</div>
      </ProductLink>
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <ProductLink product={product} className="btn" style={{ flex: 1, justifyContent: 'center' }}>View details</ProductLink>
        <button
          className="btn btn--primary"
          onClick={() => window.__openEnquiry && window.__openEnquiry({ name: product.name, maker: maker.name, price: product.price })}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          Enquire <span className="arrow">&rarr;</span>
        </button>
      </div>
    </article>
  );
}

function ShopPage() {
  const section = MWTH_SECTION('shop_index');
  const data = window.MWTH_DATA || MWTH_DATA;
  const filters = ['All', ...(data.crafts || []).map((c) => c.name)];
  const [active, setActive] = React.useState('All');
  const shown = active === 'All' ? data.products : data.products.filter((p) => p.craft === active);

  return (
    <>
      <MastheadMid mode="editorial" />
            <section className="section reveal" data-screen-label="Shop Head" style={{ paddingBottom: 32 }}>
        <div className="wrap">
          <div className="smallcaps" style={{ marginBottom: 18 }}>{section.eyebrow}</div>
          <RichText as="h1" html={section.title} className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '16ch' }} />
          <p className="dek" style={{ margin: '24px 0 0', maxWidth: '50ch' }}>{section.dek}</p>
        </div>
      </section>
      <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', background: 'var(--paper)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div className="wrap" style={{ display: 'flex', gap: 4, padding: '14px 40px', overflow: 'auto' }}>
          {filters.map((f) => (
            <button key={f} onClick={() => setActive(f)} style={{
              background: active === f ? 'var(--ink)' : 'transparent',
              color: active === f ? 'var(--paper)' : 'var(--ink-80)',
              border: 0,
              padding: '8px 14px',
              fontFamily: 'var(--sans)',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>{f}</button>
          ))}
        </div>
      </div>
      <section className="section" data-screen-label="Shop Grid" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36 }}>
            {shown.map((product) => <DataProductCard key={product.slug} product={product} />)}
          </div>
        </div>
      </section>
      <FooterMid />
    </>
  );
}

function DataProductPage({ product = MWTH_BY_PRODUCT('lobster-pot-small') }) {
  const data = window.MWTH_DATA || MWTH_DATA;
  const maker = MWTH_BY_MAKER(product.maker);
  const related = data.products.filter((p) => p.maker === maker.slug && p.slug !== product.slug);
  const episode = data.episodes.find((e) => e.maker === maker.slug);

  return (
    <>
      <MastheadMid mode="editorial" />
      <div className="wrap" style={{ padding: '24px 40px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-60)' }}>
        <a href="/?page=shop" data-page="shop" style={{ color: 'inherit' }}>Objects</a>
        &nbsp;/&nbsp;<CraftLink craft={MWTH_BY_CRAFT(product.craft.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))} style={{ color: 'inherit' }}>{product.craft}</CraftLink>
        &nbsp;/&nbsp;<MakerLink maker={maker} style={{ color: 'inherit' }}>{maker.name}</MakerLink>
        &nbsp;/&nbsp;{product.name}
      </div>
      <section className="section reveal" data-screen-label="Product" style={{ paddingTop: 8 }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 56 }}>
          <div>
            <Placeholder label={`${product.name} — hero still life`} h={620} light={!product.image} src={product.image} objectPosition="center" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 10 }}>
              {['Detail', 'Top-down', 'Maker holding it', 'Scale reference'].map((label) => (
                <Placeholder key={label} label={`${product.name} — ${label.toLowerCase()}`} h={130} light={!product.image} src={product.image} objectPosition="center" />
              ))}
            </div>
          </div>
          <div>
            <div className="smallcaps" style={{ marginBottom: 14 }}>Made by {maker.name} · {maker.place}</div>
            <h1 className="hl-serif hl-l" style={{ margin: 0, letterSpacing: '-0.01em' }}>{product.name}</h1>
            <div className="hl-serif" style={{ fontSize: 32, marginTop: 20, color: 'var(--ink)' }}>{product.price}</div>
            <div className="caption mono" style={{ marginTop: 6 }}>{product.meta}</div>
            <p className="body" style={{ marginTop: 24 }}>{maker.dek} This object belongs to the {product.craft.toLowerCase()} shelf and is archived against the maker record.</p>
            <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
              <button className="btn btn--primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => window.__openEnquiry && window.__openEnquiry({ name: product.name, maker: maker.name, price: product.price })}>
                Enquire about this item <span className="arrow">→</span>
              </button>
              <MakerLink maker={maker} className="btn">Maker</MakerLink>
            </div>
          </div>
        </div>
      </section>
      <section className="section reveal" data-screen-label="Product Maker" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'center' }}>
          <Placeholder label={`${maker.name} at the bench`} h={320} light={!maker.image} src={maker.image} objectPosition="center" />
          <div>
            <div className="smallcaps" style={{ marginBottom: 12 }}>The Maker</div>
            <h2 className="hl-serif hl-m" style={{ margin: 0 }}>{maker.name}</h2>
            <p className="body" style={{ marginTop: 16 }}>
              {maker.dek} {episode && <>Hear this maker in <a className="link" href={`/?page=maker&maker=${maker.slug}`} data-page="maker" data-maker={maker.slug}>Field Recording {episode.number}</a>.</>}
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 22 }}>
              <MakerLink maker={maker} className="btn">{maker.name.split(' ')[0]}&rsquo;s shelf <span className="arrow">→</span></MakerLink>
              {episode && <a className="btn" href={`/?page=episode&maker=${maker.slug}`} data-page="episode" data-maker={maker.slug}>Listen to the conversation</a>}
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section reveal" data-screen-label="Product More">
          <div className="wrap">
            <div className="section-head"><span className="num">—</span><span className="line" /><span className="label">More from {maker.name}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {related.map((p) => <DataProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        </section>
      )}
      <FooterMid />
    </>
  );
}

function DataMakerPage({ maker = MWTH_BY_MAKER('saoirse-doolan') }) {
  const data = window.MWTH_DATA || MWTH_DATA;
  const shelf = data.products.filter((p) => p.maker === maker.slug);
  const episodes = data.episodes.filter((e) => e.maker === maker.slug);

  return (
    <>
      <MastheadMid mode="editorial" />
      <section className="section reveal" data-screen-label="Maker Hero" style={{ paddingBottom: 40 }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 64, alignItems: 'end' }}>
          <Placeholder label={maker.heroLabel} h={620} light={!maker.image} src={maker.image} objectPosition="center" />
          <div>
            <div className="smallcaps" style={{ marginBottom: 18 }}>The Maker · {maker.craft} · {maker.place}</div>
            <h1 className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '12ch' }}>{maker.name}</h1>
            <p className="dek" style={{ margin: '24px 0 0', maxWidth: '42ch' }}>{maker.dek}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 36 }}>
              {[
                ['Established', maker.established],
                ['Shelf', `${shelf.length} pieces`],
                ['Podcast', episodes[0] ? `Field Recording ${episodes[0].number}` : 'No recording yet'],
              ].map(([k, v]) => (
                <div key={k} style={{ borderTop: '1px solid var(--ink)', paddingTop: 14 }}>
                  <div className="smallcaps" style={{ fontSize: 10 }}>{k}</div>
                  <div className="hl-serif" style={{ fontSize: 20, marginTop: 6 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
              <a className="btn btn--primary" href="#maker-shelf">{maker.name.split(' ')[0]}&rsquo;s shelf <span className="arrow">→</span></a>
              {episodes[0] && <a className="btn" href={`/?page=episode&maker=${maker.slug}`} data-page="episode" data-maker={maker.slug}>Listen to the conversation</a>}
              <a className="btn" href="/?page=podcasts" data-page="podcasts">Podcast archive</a>
            </div>
          </div>
        </div>
      </section>
      <section className="section reveal" data-screen-label="Maker Story" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          <div>
            <div className="smallcaps" style={{ marginBottom: 14 }}>Practice</div>
            <h2 className="hl-serif hl-m" style={{ margin: 0 }}>{maker.practiceTitle}</h2>
          </div>
          <div className="body" style={{ columns: 2, columnGap: 34 }}>
            {maker.practice.map((p, i) => <p key={i} style={{ marginTop: i === 0 ? 0 : undefined }}>{p}</p>)}
          </div>
        </div>
      </section>
      <section className="section reveal" id="maker-shelf" data-screen-label="Maker Shelf">
        <div className="wrap">
          <div className="section-head"><span className="num">01</span><span className="line" /><span className="label">{maker.name}&rsquo;s shelf · product archive</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {shelf.map((product) => <DataProductCard key={product.slug} product={product} />)}
          </div>
        </div>
      </section>
      {episodes.map((episode) => (
        <section key={episode.number} className="section reveal" id="maker-podcast" data-screen-label="Maker Podcast" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 56, alignItems: 'center' }}>
            <Placeholder label={`Hugh recording Field Recording ${episode.number} with ${maker.name}`} h={420} src={MWTH_FIELD('episode', 'image', '/images/mwth-podcast-bench.jpg')} objectPosition="center" />
            <div>
              <div className="smallcaps" style={{ color: 'var(--ink-40)', marginBottom: 16 }}>Field Recording {episode.number} · Hosted by Hugh McNeill</div>
              <h2 className="hl-serif hl-l" style={{ color: 'var(--paper)', margin: 0 }}>{episode.guest} and {episode.title.toLowerCase()}.</h2>
              <p className="body" style={{ color: '#d8d1c4', marginTop: 20 }}>Hugh visits {maker.name} to record the practice, tools, and decisions behind the work.</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
                <a className="btn" href="/?page=podcasts" data-page="podcasts" style={{ borderColor: 'var(--paper)', color: 'var(--paper)' }}>All Field Recordings <span className="arrow">→</span></a>
                <a className="btn" href={`/?page=episode&maker=${maker.slug}`} data-page="episode" data-maker={maker.slug} style={{ borderColor: 'var(--paper)', color: 'var(--paper)' }}>Listen to the conversation</a>
              </div>
            </div>
          </div>
        </section>
      ))}
      <FooterMid />
    </>
  );
}

function DataSaoirseMakerPage() {
  return <DataMakerPage maker={MWTH_BY_MAKER('saoirse-doolan')} />;
}

function DataCraftPage({ craft = MWTH_BY_CRAFT('basketry') }) {
  return (
    <>
      <MastheadMid mode="editorial" />
      <section className="section reveal" data-screen-label="Craft Head" style={{ paddingBottom: 36 }}>
        <div className="wrap">
          <div className="smallcaps" style={{ marginBottom: 18 }}>Craft category · {craft.products.length} objects · {craft.makers.length} makers</div>
          <h1 className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '14ch' }}>{craft.name}</h1>
          <p className="dek" style={{ margin: '24px 0 0', maxWidth: '48ch' }}>
            A living category page joining makers, shelf objects, and Field Recordings in one place.
          </p>
        </div>
      </section>
      <section className="section reveal" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap">
          <div className="section-head"><span className="num">01</span><span className="line" /><span className="label">Makers</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {craft.makers.map((maker) => (
              <MakerLink key={maker.slug} maker={maker} style={{ color: 'inherit', textDecoration: 'none', borderTop: '1px solid var(--ink)', paddingTop: 18 }}>
                <div className="smallcaps">{maker.place}</div>
                <div className="hl-serif" style={{ fontSize: 28, marginTop: 8 }}>{maker.name}</div>
                <p className="body" style={{ color: 'var(--ink-60)' }}>{maker.dek}</p>
              </MakerLink>
            ))}
          </div>
        </div>
      </section>
      <section className="section reveal">
        <div className="wrap">
          <div className="section-head"><span className="num">02</span><span className="line" /><span className="label">Objects in this discipline</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {craft.products.map((product) => <DataProductCard key={product.slug} product={product} />)}
          </div>
        </div>
      </section>
      {craft.episodes.length > 0 && (
        <section className="section reveal" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
          <div className="wrap">
            <div className="section-head"><span className="num" style={{ color: 'var(--ink-40)' }}>03</span><span className="line" style={{ background: '#3a3632' }} /><span className="label" style={{ color: 'var(--ink-40)' }}>Field Recordings</span></div>
            {craft.episodes.map((episode) => (
              <a key={episode.number} href={`/?page=episode&maker=${episode.maker}`} data-page="episode" data-maker={episode.maker} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', color: 'inherit', textDecoration: 'none', padding: '18px 0', borderTop: '1px solid #3a3632' }}>
                <span className="mono">EP {episode.number}</span>
                <span className="hl-serif" style={{ fontSize: 22 }}>{episode.title}</span>
                <span className="caption mono">{episode.duration}</span>
              </a>
            ))}
          </div>
        </section>
      )}
      <FooterMid />
    </>
  );
}

function DataArtistsPage() {
  const data = window.MWTH_DATA || MWTH_DATA;
  const makersByLetter = data.makers.reduce((acc, maker) => {
    const letter = maker.name.split(' ').slice(-1)[0][0].toUpperCase();
    acc[letter] = acc[letter] || [];
    acc[letter].push(maker);
    return acc;
  }, {});
  const letters = Object.keys(makersByLetter).sort();

  return (
    <>
      <MastheadMid mode="editorial" />
      <section className="section reveal" data-screen-label="Artists Head" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <div className="smallcaps" style={{ marginBottom: 18 }}>The Directory · {data.makers.length} makers in this prototype</div>
          <h1 className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '16ch' }}>Every maker <span className="italic">by name</span>.</h1>
          <p className="dek" style={{ margin: '24px 0 0', maxWidth: '46ch' }}>An index of every maker whose work is in the object archive, or whose voice is on the podcast.</p>
        </div>
      </section>
      <section className="section" data-screen-label="Artists Index" style={{ paddingTop: 56 }}>
        <div className="wrap-narrow">
          {letters.map((letter) => (
            <div key={letter} id={`L-${letter}`} style={{ marginBottom: 56 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 32, alignItems: 'start' }}>
                <div className="hl-serif" style={{ fontSize: 64, lineHeight: 0.9, color: 'var(--accent)' }}>{letter}</div>
                <div>
                  {makersByLetter[letter].map((maker) => {
                    const shelfCount = data.products.filter((p) => p.maker === maker.slug).length;
                    const ep = data.episodes.find((e) => e.maker === maker.slug);
                    return (
                      <MakerLink key={maker.slug} maker={maker} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 22, padding: '22px 0', borderTop: '1px solid var(--rule)', textDecoration: 'none', color: 'inherit', alignItems: 'baseline' }}>
                        <div>
                          <div className="hl-serif" style={{ fontSize: 26, letterSpacing: '-0.01em' }}>{maker.name}</div>
                          <div className="caption" style={{ marginTop: 6 }}>{shelfCount} pieces{ep ? ` · EP ${ep.number}` : ''}</div>
                        </div>
                        <div className="smallcaps">{maker.craft}</div>
                        <div className="smallcaps" style={{ textAlign: 'right' }}>{maker.place} <span className="arrow" style={{ marginLeft: 8 }}>→</span></div>
                      </MakerLink>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <FooterMid />
    </>
  );
}

Object.assign(window, {
  ShopPage,
  ProductPage: DataProductPage,
  MakerPage: DataMakerPage,
  SaoirseMakerPage: DataSaoirseMakerPage,
  CraftPage: DataCraftPage,
  EnquiryDrawer,
  BasketDrawer: EnquiryDrawer,
  HughStoryPage,
  ArtistsPage: DataArtistsPage,
});
