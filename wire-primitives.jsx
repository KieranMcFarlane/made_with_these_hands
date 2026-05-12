// Low-fi wireframe primitives — grayscale blockframes, no illustration
// All components render plain boxes/lines; solid gray blocks for imagery.

const WF = {
  ink: '#1a1a1a',
  ink70: '#4a4a4a',
  ink50: '#7a7a7a',
  ink30: '#b8b8b8',
  ink15: '#d8d8d8',
  line: '#cfcfcf',
  bg: '#ffffff',
  paper: '#f7f6f3',
  block: '#c9c7c2',      // solid gray for image placeholders
  blockDk: '#8a8884',
  blockLt: '#e4e2dd',
  accent: '#1a1a1a',
  font: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
};

// Artboard frame — a "page" within the canvas
function Page({ width = 420, children, tag }) {
  return (
    <div style={{
      width, background: WF.bg, color: WF.ink,
      fontFamily: WF.font, fontSize: 11, lineHeight: 1.4,
      position: 'relative', border: `1px solid ${WF.line}`,
    }}>
      {tag && (
        <div style={{
          position: 'absolute', top: -22, right: 0,
          fontSize: 10, color: WF.ink50, letterSpacing: 0.5,
          textTransform: 'uppercase', fontWeight: 500,
        }}>{tag}</div>
      )}
      {children}
    </div>
  );
}

// Gray image block with a caption label
function Img({ h = 180, label, w = '100%', tone = 'block', style = {} }) {
  const bg = tone === 'dk' ? WF.blockDk : tone === 'lt' ? WF.blockLt : WF.block;
  const fg = tone === 'dk' ? '#e8e6e2' : tone === 'lt' ? WF.ink50 : WF.ink70;
  return (
    <div style={{
      width: w, height: h, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase',
      color: fg, fontWeight: 500,
      textAlign: 'center', padding: '0 12px',
      ...style,
    }}>{label}</div>
  );
}

// Horizontal rule
function HR({ m = '0', c = WF.line }) {
  return <div style={{ height: 1, background: c, margin: m }} />;
}

// Generic text line (for lorem)
function Line({ w = '100%', h = 7, c = WF.ink30, mb = 5 }) {
  return <div style={{ width: w, height: h, background: c, marginBottom: mb }} />;
}

// Stack of text lines
function Lines({ count = 3, widths, last = '60%', mb = 5, c = WF.ink30, h = 6 }) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const w = widths ? widths[i] : (i === count - 1 ? last : '100%');
    out.push(<Line key={i} w={w} h={h} c={c} mb={mb} />);
  }
  return <>{out}</>;
}

// Button placeholder
function Btn({ children, primary = false, w, size = 'md' }) {
  const pad = size === 'sm' ? '8px 14px' : '12px 22px';
  const fs = size === 'sm' ? 10 : 11;
  return (
    <div style={{
      display: 'inline-block', padding: pad, fontSize: fs,
      letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 500,
      background: primary ? WF.ink : 'transparent',
      color: primary ? '#fff' : WF.ink,
      border: `1px solid ${WF.ink}`,
      width: w, textAlign: 'center', boxSizing: 'border-box',
      cursor: 'default',
    }}>{children}</div>
  );
}

// Editorial header — for inside-page mastheads
function Masthead({ issue, date, mode = 'center', links = ['Craft', 'Stories', 'Podcast', 'Shop', 'About'] }) {
  if (mode === 'editorial') {
    return (
      <div style={{ padding: '14px 24px', borderBottom: `1px solid ${WF.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: WF.ink50, marginBottom: 10 }}>
          <span>{issue || 'Vol. I · No. 07'}</span>
          <span>{date || 'April 2026'}</span>
        </div>
        <div style={{ textAlign: 'center', fontFamily: WF.serif, fontSize: 22, letterSpacing: 1, fontWeight: 400 }}>
          Made With These Hands
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 10, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: WF.ink70 }}>
          {links.map(l => <span key={l}>{l}</span>)}
        </div>
      </div>
    );
  }
  if (mode === 'rail') {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', borderBottom: `1px solid ${WF.line}` }}>
        <div style={{ fontFamily: WF.serif, fontSize: 13, letterSpacing: 0.5 }}>Made With These Hands</div>
        <div style={{ display: 'flex', gap: 6, flexDirection: 'column', width: 20 }}>
          <div style={{ height: 1, background: WF.ink }} />
          <div style={{ height: 1, background: WF.ink }} />
          <div style={{ height: 1, background: WF.ink }} />
        </div>
      </div>
    );
  }
  // minimal
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: `1px solid ${WF.line}` }}>
      <div style={{ fontFamily: WF.serif, fontSize: 13, letterSpacing: 0.5 }}>Made With These Hands</div>
      <div style={{ display: 'flex', gap: 16, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: WF.ink70 }}>
        {links.map(l => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

// Section label (left gutter)
function SectionTag({ n, label }) {
  return (
    <div style={{ display: 'flex', gap: 10, fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', color: WF.ink50, marginBottom: 14 }}>
      <span>{n}</span>
      <span style={{ flex: 1, height: 1, background: WF.ink30, marginTop: 5 }} />
      <span>{label}</span>
    </div>
  );
}

// Large editorial headline — block rendered as text
function Headline({ children, size = 34, font = 'serif', weight = 400, style = {}, lh = 1.05 }) {
  return (
    <div style={{
      fontFamily: font === 'serif' ? WF.serif : WF.font,
      fontSize: size, fontWeight: weight, lineHeight: lh,
      letterSpacing: font === 'serif' ? -0.3 : 0,
      color: WF.ink,
      textWrap: 'balance',
      ...style,
    }}>{children}</div>
  );
}

function Sub({ children, style = {} }) {
  return (
    <div style={{
      fontSize: 12, lineHeight: 1.55, color: WF.ink70,
      maxWidth: 340, ...style,
    }}>{children}</div>
  );
}

function Caption({ children, style = {} }) {
  return (
    <div style={{
      fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase',
      color: WF.ink50, ...style,
    }}>{children}</div>
  );
}

function Quote({ children, size = 18 }) {
  return (
    <div style={{ fontFamily: WF.serif, fontSize: size, lineHeight: 1.35, fontStyle: 'italic', color: WF.ink, textWrap: 'balance' }}>
      “{children}”
    </div>
  );
}

// Footer — shared across all 3
function Footer({ tone = 'light' }) {
  const bg = tone === 'dark' ? '#1a1a1a' : WF.paper;
  const fg = tone === 'dark' ? '#d8d6d1' : WF.ink70;
  const fgDim = tone === 'dark' ? '#8a8884' : WF.ink50;
  const line = tone === 'dark' ? '#333' : WF.line;
  return (
    <div style={{ background: bg, color: fg, padding: '40px 28px 22px' }}>
      <div style={{ fontFamily: WF.serif, fontSize: 22, color: tone === 'dark' ? '#fff' : WF.ink, marginBottom: 20 }}>
        Made With These Hands
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 18, fontSize: 10, marginBottom: 28 }}>
        {[
          ['Explore', ['Craft', 'Stories', 'Podcast', 'Shop']],
          ['Studio', ['Hugh McNeill', 'Commissions', 'Workshops', 'Press']],
          ['Help', ['Contact', 'Shipping', 'Returns', 'FAQ']],
          ['Follow', ['Instagram', 'YouTube', 'Spotify', 'Newsletter']],
        ].map(([h, items]) => (
          <div key={h}>
            <div style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: fgDim, marginBottom: 10 }}>{h}</div>
            {items.map(i => <div key={i} style={{ marginBottom: 5 }}>{i}</div>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${line}`, paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 9, color: fgDim }}>
        <span>© 2026 Made With These Hands · Kilkenny, Ireland</span>
        <span>Privacy · Terms</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  WF, Page, Img, HR, Line, Lines, Btn,
  Masthead, SectionTag, Headline, Sub, Caption, Quote, Footer,
});
