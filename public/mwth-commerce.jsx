// Commissions page + Checkout flow

// ── Commissions ─────────────────────────────────────────────
function CommissionsPage() {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    type: '', occasion: '', timeline: '', budget: '', detail: '', name: '', email: '',
  });
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const types = [
    ['Decanter or set',     'From £950 · 8–12 weeks'],
    ['Trophy or award',     'From £1,400 · 10–14 weeks'],
    ['Architectural / window', 'From £6,000 · 6–9 months'],
    ['Heirloom piece',      'POA · timeline by arrangement'],
    ['Something else',      'Write and we will talk'],
  ];

  return (
    <>
      <MastheadMid mode="editorial" />

      <section className="section reveal" data-screen-label="Comm Hero" style={{ paddingBottom: 32 }}>
        <div className="wrap">
          <div className="smallcaps" style={{ marginBottom: 18 }}>Commissions · Two a year · By correspondence</div>
          <h1 className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '14ch' }}>
            A piece, made for <span className="italic">one occasion</span>.
          </h1>
          <p className="dek" style={{ margin: '24px 0 0', maxWidth: '46ch' }}>
            Hugh accepts two private commissions each year. The work is slow,
            considered, and made entirely by hand at the Canal Walk workshop.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="section reveal" data-screen-label="Comm Process" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap">
          <div className="section-head">
            <span className="num">01</span><span className="line" /><span className="label">The Process</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {[
              ['I',   'Letter',     'You write to Hugh with the occasion, the recipient, and any constraints.'],
              ['II',  'Conversation', 'A call or workshop visit. Sketches by post within a fortnight.'],
              ['III', 'At the wheel', 'Cutting begins. You receive a photo or two as it progresses.'],
              ['IV',  'The piece',   'Hand-delivered or sent by post, signed, dated, and yours.'],
            ].map(([n, t, d]) => (
              <div key={n} style={{ borderTop: '1px solid var(--ink)', paddingTop: 20 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>{n}</div>
                <div className="hl-serif" style={{ fontSize: 22, marginTop: 10 }}>{t}</div>
                <div className="body" style={{ fontSize: 14, marginTop: 10, color: 'var(--ink-60)' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past commissions */}
      <section className="section reveal" data-screen-label="Comm Past">
        <div className="wrap">
          <div className="section-head">
            <span className="num">02</span><span className="line" /><span className="label">Selected past work</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {[
              ['2024', 'Embassy decanter set', 'A set of six, gifted by the Irish Embassy in Tokyo.'],
              ['2022', 'Cathedral window',     'Side-chapel rose, commissioned by the Diocese of Down.'],
              ['2019', 'Head of state',        'Engraved tumbler set for a state visit.'],
            ].map(([y, t, d]) => (
              <figure key={t} style={{ margin: 0 }}>
                <Placeholder label={t.toLowerCase()} h={300} />
                <figcaption>
                  <div className="caption mono" style={{ marginTop: 12, color: 'var(--accent)' }}>{y}</div>
                  <div className="hl-serif" style={{ fontSize: 22, marginTop: 6 }}>{t}</div>
                  <div className="body" style={{ fontSize: 13, marginTop: 6, color: 'var(--ink-60)' }}>{d}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Form — multi-step */}
      <section className="section reveal" data-screen-label="Comm Form" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap-narrow">
          <div className="section-head">
            <span className="num">03</span><span className="line" /><span className="label">Begin a correspondence</span>
          </div>

          {/* progress */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 36 }}>
            {['What', 'When', 'You', 'Send'].map((s, i) => (
              <div key={s} style={{ flex: 1, paddingTop: 10, borderTop: `1px solid ${i <= step ? 'var(--ink)' : 'var(--rule)'}` }}>
                <div className="mono" style={{ fontSize: 10, color: i <= step ? 'var(--accent)' : 'var(--ink-40)' }}>0{i+1}</div>
                <div className="smallcaps" style={{ marginTop: 6, color: i <= step ? 'var(--ink)' : 'var(--ink-40)' }}>{s}</div>
              </div>
            ))}
          </div>

          {step === 0 && (
            <div>
              <h3 className="hl-serif hl-m" style={{ margin: '0 0 8px' }}>What kind of piece?</h3>
              <p className="body" style={{ marginTop: 0, color: 'var(--ink-60)' }}>Pick the closest. We can talk it through later.</p>
              <div style={{ display: 'grid', gap: 8, marginTop: 24 }}>
                {types.map(([t, m]) => (
                  <button key={t} onClick={() => set('type', t)} style={{
                    textAlign: 'left', padding: '20px 22px',
                    background: data.type === t ? 'var(--ink)' : 'var(--paper)',
                    color: data.type === t ? 'var(--paper)' : 'var(--ink)',
                    border: `1px solid ${data.type === t ? 'var(--ink)' : 'var(--rule)'}`,
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    fontFamily: 'var(--sans)',
                  }}>
                    <span className="hl-serif" style={{ fontSize: 22 }}>{t}</span>
                    <span className="caption mono" style={{ color: data.type === t ? 'var(--ink-40)' : 'var(--ink-60)' }}>{m}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="hl-serif hl-m" style={{ margin: '0 0 8px' }}>The occasion, and when.</h3>
              <CFInput label="Occasion" placeholder="A wedding · a retirement · a christening · just because"
                value={data.occasion} onChange={v => set('occasion', v)} />
              <CFInput label="Needed by" placeholder="A month · a date · no rush"
                value={data.timeline} onChange={v => set('timeline', v)} />
              <CFInput label="Budget (optional)" placeholder="A range is fine"
                value={data.budget} onChange={v => set('budget', v)} />
              <CFTextarea label="Anything to know" placeholder="Initials, recipient, a story we should know..."
                value={data.detail} onChange={v => set('detail', v)} />
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="hl-serif hl-m" style={{ margin: '0 0 8px' }}>Who shall we write back to?</h3>
              <CFInput label="Your name" value={data.name} onChange={v => set('name', v)} />
              <CFInput label="Email"      value={data.email} onChange={v => set('email', v)} />
              <p className="caption" style={{ marginTop: 24, lineHeight: 1.7 }}>
                Hugh replies personally, usually within a week.
                Nothing is automated. Your details are kept in a notebook on the bench.
              </p>
            </div>
          )}

          {step === 3 && (
            <div style={{ background: 'var(--paper)', padding: 32, border: '1px solid var(--ink)' }}>
              <div className="smallcaps" style={{ color: 'var(--accent)' }}>To review</div>
              <div style={{ marginTop: 18 }}>
                {[
                  ['Piece', data.type || '—'],
                  ['Occasion', data.occasion || '—'],
                  ['Needed by', data.timeline || '—'],
                  ['Budget', data.budget || '—'],
                  ['Notes', data.detail || '—'],
                  ['Name', data.name || '—'],
                  ['Email', data.email || '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', padding: '14px 0', borderBottom: '1px solid var(--rule)', fontSize: 14 }}>
                    <span className="smallcaps">{k}</span>
                    <span className="hl-serif" style={{ fontSize: 16 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 32, justifyContent: 'space-between' }}>
            <button className="btn" onClick={() => setStep(s => Math.max(0, s-1))} disabled={step === 0}
              style={{ opacity: step === 0 ? 0.4 : 1 }}>← Back</button>
            {step < 3 && <button className="btn btn--primary" onClick={() => setStep(s => s+1)}>Continue <span className="arrow">→</span></button>}
            {step === 3 && <button className="btn btn--primary">Send to the studio <span className="arrow">→</span></button>}
          </div>
        </div>
      </section>

      <FooterMid />
    </>
  );
}

function CFInput({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: 'block', marginTop: 22 }}>
      <div className="smallcaps" style={{ marginBottom: 8 }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: '100%', padding: '14px 0', background: 'transparent',
          border: 0, borderBottom: '1px solid var(--ink)',
          fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--ink)',
          outline: 'none',
        }} />
    </label>
  );
}
function CFTextarea({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: 'block', marginTop: 22 }}>
      <div className="smallcaps" style={{ marginBottom: 8 }}>{label}</div>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4}
        style={{
          width: '100%', padding: '12px 0', background: 'transparent',
          border: 0, borderBottom: '1px solid var(--ink)',
          fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--ink)',
          outline: 'none', resize: 'vertical', lineHeight: 1.5,
        }} />
    </label>
  );
}

// ── Checkout ────────────────────────────────────────────────
function CheckoutPage() {
  const [step, setStep] = React.useState('address'); // address | payment | done
  const items = [
    { name: 'Lobster pot, small',  maker: 'Saoirse Doolan', price: 220 },
    { name: 'Bog-oak spoon',       maker: 'Méabh Ó Riada',  price:  42 },
  ];
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const ship = 0;
  const fund = Math.round(subtotal * 0.10);
  const total = subtotal + ship;

  return (
    <>
      <header style={{ borderBottom: '1px solid var(--ink)', padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="hl-serif" style={{ fontSize: 22 }}>Made With These Hands</div>
        <div className="smallcaps">Secure checkout</div>
      </header>

      <div className="wrap" style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64 }} data-screen-label="Checkout">
        {/* LEFT: form */}
        <div>
          {/* Step rail */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 36 }}>
            {[['address', 'Address'], ['payment', 'Payment'], ['done', 'Confirmation']].map(([k, l], i) => (
              <div key={k} style={{ flex: 1, paddingTop: 10, borderTop: `1px solid ${stepIndex(step) >= i ? 'var(--ink)' : 'var(--rule)'}` }}>
                <div className="mono" style={{ fontSize: 10, color: stepIndex(step) >= i ? 'var(--accent)' : 'var(--ink-40)' }}>0{i+1}</div>
                <div className="smallcaps" style={{ marginTop: 6, color: stepIndex(step) >= i ? 'var(--ink)' : 'var(--ink-40)' }}>{l}</div>
              </div>
            ))}
          </div>

          {step === 'address' && (
            <div>
              <h2 className="hl-serif hl-l" style={{ margin: '0 0 8px' }}>Where shall we <span className="italic">send it</span>?</h2>
              <p className="body" style={{ color: 'var(--ink-60)' }}>Each piece is wrapped by hand and packed in straw at the workshop.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 28 }}>
                <CFInput label="First name" value="" onChange={()=>{}} />
                <CFInput label="Last name"  value="" onChange={()=>{}} />
              </div>
              <CFInput label="Email" value="" onChange={()=>{}} />
              <CFInput label="Address" value="" onChange={()=>{}} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22 }}>
                <CFInput label="City"     value="" onChange={()=>{}} />
                <CFInput label="Postcode" value="" onChange={()=>{}} />
                <CFInput label="Country"  value="" onChange={()=>{}} />
              </div>
              <CFTextarea label="A note for Hugh (optional)" placeholder="Gift wrapping, a card, a delivery date..." value="" onChange={()=>{}} />
              <div style={{ marginTop: 28 }}>
                <button className="btn btn--primary" onClick={() => setStep('payment')}>Continue to payment <span className="arrow">→</span></button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div>
              <h2 className="hl-serif hl-l" style={{ margin: '0 0 8px' }}>Payment.</h2>
              <p className="body" style={{ color: 'var(--ink-60)' }}>Secured by Stripe. We accept all major cards.</p>
              <CFInput label="Card number" value="" onChange={()=>{}} placeholder="1234 5678 9012 3456" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22 }}>
                <CFInput label="Expiry" placeholder="MM / YY" value="" onChange={()=>{}} />
                <CFInput label="CVC" value="" onChange={()=>{}} />
                <CFInput label="Postcode" value="" onChange={()=>{}} />
              </div>
              <label style={{ display: 'flex', gap: 12, marginTop: 24, alignItems: 'flex-start' }}>
                <input type="checkbox" defaultChecked style={{ marginTop: 5, accentColor: 'var(--ink)' }} />
                <span className="body" style={{ fontSize: 14 }}>
                  Yes, send me one short letter a fortnight from the workshop. No clutter.
                </span>
              </label>
              <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
                <button className="btn" onClick={() => setStep('address')}>← Back</button>
                <button className="btn btn--primary" onClick={() => setStep('done')}>Place order · £{total} <span className="arrow">→</span></button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div>
              <div className="smallcaps" style={{ color: 'var(--accent)', marginBottom: 16 }}>Order received · No. 04217</div>
              <h2 className="hl-serif hl-xl" style={{ margin: 0 }}>
                Thank you.<br/><span className="italic">Wrapping begins.</span>
              </h2>
              <p className="dek" style={{ marginTop: 24 }}>
                Hugh has your order. You will hear from him personally before
                the parcel leaves Kilkenny — usually within three days.
                A receipt is on its way to your inbox.
              </p>
              <div style={{ marginTop: 28, padding: 22, background: 'var(--paper-2)' }}>
                <div className="smallcaps" style={{ marginBottom: 8 }}>The Heritage Craft Fund</div>
                <div className="hl-serif" style={{ fontSize: 22 }}>£{fund} of this order goes to apprenticeships and tool repair.</div>
              </div>
              <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
                <button className="btn" onClick={() => window.__setPage('shop')}>← Back to the shop</button>
                <button className="btn btn--primary" onClick={() => window.__setPage('home')}>Read the journal <span className="arrow">→</span></button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: order summary */}
        <aside style={{ position: 'sticky', top: 28, alignSelf: 'start' }}>
          <div style={{ padding: 28, background: 'var(--paper-2)', border: '1px solid var(--rule)' }}>
            <div className="smallcaps" style={{ marginBottom: 18 }}>Your basket · {items.length} pieces</div>
            {items.map(it => (
              <div key={it.name} style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--rule)' }}>
                <Placeholder label="" h={60} light />
                <div>
                  <div className="smallcaps">{it.maker}</div>
                  <div className="hl-serif" style={{ fontSize: 16, marginTop: 4 }}>{it.name}</div>
                </div>
                <div className="hl-serif" style={{ fontSize: 15 }}>£{it.price}</div>
              </div>
            ))}
            <div style={{ paddingTop: 18, fontSize: 14 }}>
              {[
                ['Subtotal',           `£${subtotal}`],
                ['Shipping',           ship === 0 ? 'Free · UK & IE' : `£${ship}`],
                ['Heritage Fund (10%)', `£${fund} · included`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: 'var(--ink-60)' }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', borderTop: '1px solid var(--ink)', marginTop: 8 }}>
                <span className="smallcaps">Total</span>
                <span className="hl-serif" style={{ fontSize: 28 }}>£{total}</span>
              </div>
            </div>
          </div>

          <div className="caption" style={{ marginTop: 16, lineHeight: 1.7, color: 'var(--ink-60)' }}>
            Each piece ships from Kilkenny, hand-wrapped, within five working days.
            Returns within 30 days, by post.
          </div>
        </aside>
      </div>
    </>
  );
}
function stepIndex(s) { return { address: 0, payment: 1, done: 2 }[s] || 0; }

Object.assign(window, { CommissionsPage, CheckoutPage });
