// Commissions page

// ── Commissions ─────────────────────────────────────────────
function CommissionsPage() {
  const section = MWTH_SECTION('commissions');
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({ type: '', occasion: '', timeline: '', budget: '', detail: '', name: '', email: '' });
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const types = section.types || [];
  const process = section.process || [];
  const pastWork = section.pastWork || [];

  return (
    <>
      <MastheadMid mode="editorial" />
      <TemplateSlot name="before-content" />
      <section className="section reveal" data-screen-label="Comm Hero" style={{ paddingBottom: 32 }}>
        <div className="wrap"><div className="smallcaps" style={{ marginBottom: 18 }}>{section.eyebrow}</div><RichText as="h1" html={section.title} className="hl-serif hl-xl" style={{ margin: 0, maxWidth: '14ch' }} /><p className="dek" style={{ margin: '24px 0 0', maxWidth: '46ch' }}>{section.dek}</p></div>
      </section>
      <section className="section reveal" data-screen-label="Comm Process" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap"><div className="section-head"><span className="num">01</span><span className="line" /><span className="label">The Process</span></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>{process.map(([n, t, d]) => <div key={n} style={{ borderTop: '1px solid var(--ink)', paddingTop: 20 }}><div className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>{n}</div><div className="hl-serif" style={{ fontSize: 22, marginTop: 10 }}>{t}</div><div className="body" style={{ fontSize: 14, marginTop: 10, color: 'var(--ink-60)' }}>{d}</div></div>)}</div></div>
      </section>
      <section className="section reveal" data-screen-label="Comm Past"><div className="wrap"><div className="section-head"><span className="num">02</span><span className="line" /><span className="label">Selected past work</span></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>{pastWork.map(([y, t, d]) => <figure key={t} style={{ margin: 0 }}><Placeholder label={t.toLowerCase()} h={300} /><figcaption><div className="caption mono" style={{ marginTop: 12, color: 'var(--accent)' }}>{y}</div><div className="hl-serif" style={{ fontSize: 22, marginTop: 6 }}>{t}</div><div className="body" style={{ fontSize: 13, marginTop: 6, color: 'var(--ink-60)' }}>{d}</div></figcaption></figure>)}</div></div></section>
      <section className="section reveal" data-screen-label="Comm Form" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div className="wrap-narrow"><div className="section-head"><span className="num">03</span><span className="line" /><span className="label">Begin a correspondence</span></div><div style={{ display: 'flex', gap: 14, marginBottom: 36 }}>{['What', 'When', 'You', 'Send'].map((s, i) => <div key={s} style={{ flex: 1, paddingTop: 10, borderTop: '1px solid ' + (i <= step ? 'var(--ink)' : 'var(--rule)') }}><div className="mono" style={{ fontSize: 10, color: i <= step ? 'var(--accent)' : 'var(--ink-40)' }}>0{i+1}</div><div className="smallcaps" style={{ marginTop: 6, color: i <= step ? 'var(--ink)' : 'var(--ink-40)' }}>{s}</div></div>)}</div>
          {step === 0 && <div><h3 className="hl-serif hl-m" style={{ margin: '0 0 8px' }}>What kind of piece?</h3><p className="body" style={{ marginTop: 0, color: 'var(--ink-60)' }}>Pick the closest. We can talk it through later.</p><div style={{ display: 'grid', gap: 8, marginTop: 24 }}>{types.map(([t, m]) => <button key={t} onClick={() => set('type', t)} style={{ textAlign: 'left', padding: '20px 22px', background: data.type === t ? 'var(--ink)' : 'var(--paper)', color: data.type === t ? 'var(--paper)' : 'var(--ink)', border: '1px solid ' + (data.type === t ? 'var(--ink)' : 'var(--rule)'), cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: 'var(--sans)' }}><span className="hl-serif" style={{ fontSize: 22 }}>{t}</span><span className="caption mono" style={{ color: data.type === t ? 'var(--ink-40)' : 'var(--ink-60)' }}>{m}</span></button>)}</div></div>}
          {step === 1 && <div><h3 className="hl-serif hl-m" style={{ margin: '0 0 8px' }}>The occasion, and when.</h3><CFInput label="Occasion" placeholder="A wedding - a retirement - a christening - just because" value={data.occasion} onChange={v => set('occasion', v)} /><CFInput label="Needed by" placeholder="A month - a date - no rush" value={data.timeline} onChange={v => set('timeline', v)} /><CFInput label="Budget (optional)" placeholder="A range is fine" value={data.budget} onChange={v => set('budget', v)} /><CFTextarea label="Anything to know" placeholder="Initials, recipient, a story we should know..." value={data.detail} onChange={v => set('detail', v)} /></div>}
          {step === 2 && <div><h3 className="hl-serif hl-m" style={{ margin: '0 0 8px' }}>Who shall we write back to?</h3><CFInput label="Your name" value={data.name} onChange={v => set('name', v)} /><CFInput label="Email" value={data.email} onChange={v => set('email', v)} /><p className="caption" style={{ marginTop: 24, lineHeight: 1.7 }}>Hugh replies personally, usually within a week. Nothing is automated.</p></div>}
          {step === 3 && <div style={{ background: 'var(--paper)', padding: 32, border: '1px solid var(--ink)' }}><div className="smallcaps" style={{ color: 'var(--accent)' }}>To review</div><div style={{ marginTop: 18 }}>{[['Piece', data.type || '-'], ['Occasion', data.occasion || '-'], ['Needed by', data.timeline || '-'], ['Budget', data.budget || '-'], ['Notes', data.detail || '-'], ['Name', data.name || '-'], ['Email', data.email || '-']].map(([k, v]) => <div key={k} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', padding: '14px 0', borderBottom: '1px solid var(--rule)', fontSize: 14 }}><span className="smallcaps">{k}</span><span className="hl-serif" style={{ fontSize: 16 }}>{v}</span></div>)}</div></div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 32, justifyContent: 'space-between' }}><button className="btn" onClick={() => setStep(s => Math.max(0, s-1))} disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>Back</button>{step < 3 && <button className="btn btn--primary" onClick={() => setStep(s => s+1)}>Continue <span className="arrow">&rarr;</span></button>}{step === 3 && <button className="btn btn--primary">Send to the studio <span className="arrow">&rarr;</span></button>}</div>
        </div>
      </section>
      <TemplateSlot name="after-content" />
      <TemplateSlot name="related-content" />
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

Object.assign(window, { CommissionsPage });
