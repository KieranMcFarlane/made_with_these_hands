// Direction 3 — Curated Artisan Marketplace
// Shop bones, but editorial. Objects with maker bylines, price as footnote,
// "shelf" layouts. Hugh as workshop vignette. Warmer, more tactile grid.

function D3_HeroA() {
  return (
    <div>
      <Masthead mode="minimal" />
      <div style={{ padding: '32px 24px 8px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 22, alignItems: 'center' }}>
        <div>
          <Caption style={{ marginBottom: 14 }}>A curated shop of handmade work</Caption>
          <Headline size={34} lh={1.08}>
            Things made by someone, for someone.
          </Headline>
          <Sub style={{ marginTop: 14, marginBottom: 18 }}>
            Objects chosen one by one, with the maker's name on every label.
            Carried in small numbers. Always.
          </Sub>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn primary size="sm">Explore Craft</Btn>
            <Btn size="sm">Listen to the Podcast</Btn>
          </div>
        </div>
        <Img h={260} label="Still life — three objects, raking light" />
      </div>
      {/* shelf strip */}
      <div style={{ padding: '24px 24px 28px' }}>
        <Caption style={{ marginBottom: 10 }}>Newly in the shop</Caption>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {['Cut tumbler', 'Stoneware jug', 'Willow basket', 'Bog-oak spoon'].map((n, i) => (
            <div key={n}>
              <Img h={88} label="" tone="lt" />
              <div style={{ fontSize: 10, fontFamily: WF.serif, marginTop: 6 }}>{n}</div>
              <div style={{ fontSize: 9, color: WF.ink50, marginTop: 1 }}>£{[180,95,140,42][i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function D3_HeroB() {
  return (
    <div>
      <Masthead mode="minimal" />
      <div style={{ position: 'relative' }}>
        <Img h={300} label="Wide workshop scene — rack of tools, Hugh mid-work" tone="dk" />
        <div style={{ position: 'absolute', left: 20, bottom: 20, right: 20, background: WF.bg, padding: '18px 18px 14px', border: `1px solid ${WF.ink}` }}>
          <Caption style={{ marginBottom: 8 }}>A shop with stories</Caption>
          <Headline size={22} lh={1.15} style={{ marginBottom: 10 }}>
            Every object has a maker, a place, and a pair of hands.
          </Headline>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn primary size="sm">Explore Craft</Btn>
            <Btn size="sm">Listen</Btn>
          </div>
        </div>
      </div>
      <div style={{ padding: '24px 24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: WF.ink70, borderBottom: `1px solid ${WF.line}` }}>
        <span>47 makers · 6 disciplines · Ireland & beyond</span>
        <span style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>Shop →</span>
      </div>
    </div>
  );
}

function D3_Body({ catCols = 4 }) {
  return (
    <>
      {/* 2. Mission — pair of short lines, tactile */}
      <div style={{ padding: '36px 24px', background: WF.paper }}>
        <SectionTag n="02" label="Our Standard" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Headline size={24} lh={1.2}>
            One maker. One bench. One object at a time.
          </Headline>
          <div style={{ fontSize: 11, lineHeight: 1.65, color: WF.ink70 }}>
            We carry handmade work because the alternative is a world of
            anonymous objects. Every piece here has a person behind it — named,
            photographed, and on the record.
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 10 }}>
              <div>✓ Made by hand</div>
              <div>✓ Signed by the maker</div>
              <div>✓ Shipped from the workshop</div>
              <div>✓ Small runs, numbered</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Categories — marketplace grid, count badges */}
      <div style={{ padding: '36px 24px' }}>
        <SectionTag n="03" label="Browse by Craft" />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${catCols}, 1fr)`, gap: 12 }}>
          {[
            ['Glass Engraving', 14],
            ['Jewellery', 22],
            ['Ceramics', 31],
            ['Woodwork', 18],
            ['Collectors', 9],
            ['Textiles', 12],
            ['Leather', 7],
            ['Metalwork', 11],
          ].slice(0, catCols * 2).map(([n, c]) => (
            <div key={n} style={{ position: 'relative' }}>
              <Img h={110} label={n} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
                <div style={{ fontFamily: WF.serif, fontSize: 13 }}>{n}</div>
                <div style={{ fontSize: 9, color: WF.ink50 }}>{c} pieces</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Hugh — Workshop vignette (tools, hands, glass) */}
      <div style={{ padding: '36px 24px', borderTop: `1px solid ${WF.line}`, borderBottom: `1px solid ${WF.line}` }}>
        <SectionTag n="04" label="The Workshop" />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
          <Img h={200} label="Hugh's hands, holding a cutter to glass" tone="dk" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Img h={95} label="Detail — copper wheel" tone="dk" />
            <Img h={95} label="Detail — engraved surface" tone="dk" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Img h={95} label="Tool rack" tone="dk" />
            <Img h={95} label="Signed piece, finished" tone="dk" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 22 }}>
          <div>
            <div style={{ fontFamily: WF.serif, fontSize: 20 }}>Hugh McNeill</div>
            <Caption style={{ marginTop: 6 }}>Glass cutter & engraver · Kilkenny</Caption>
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.65, color: WF.ink70 }}>
            Thirty-two years at the wheel. Apprenticed in Waterford,
            commissioned by heads of state, still takes walk-ins on Fridays.
            Hugh chooses every piece in the shop himself.
            <div style={{ marginTop: 10 }}><Btn size="sm">Meet Hugh</Btn></div>
          </div>
        </div>
      </div>

      {/* 5. Podcast */}
      <div style={{ padding: '36px 24px', background: WF.paper }}>
        <SectionTag n="05" label="The Podcast" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 22, alignItems: 'center' }}>
          <Img h={220} label="Podcast cover — type-only, heavy serif" tone="dk" />
          <div>
            <Headline size={24} lh={1.2}>Hugh, talking shop.</Headline>
            <Sub style={{ marginTop: 12, marginBottom: 16 }}>
              Every other Thursday, a new conversation with a maker whose
              work lives in the shop. Forty-seven episodes and counting.
            </Sub>
            <div style={{ padding: 12, background: WF.bg, border: `1px solid ${WF.line}`, display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 28, height: 28, border: `1px solid ${WF.ink}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>▶</div>
              <div style={{ flex: 1 }}>
                <Caption>Now playing · EP 47</Caption>
                <div style={{ fontFamily: WF.serif, fontSize: 12, marginTop: 2 }}>Méabh Ó Riada — the grain of 4,000 years</div>
                {/* scrubber */}
                <div style={{ height: 2, background: WF.ink15, marginTop: 8, position: 'relative' }}>
                  <div style={{ width: '35%', height: '100%', background: WF.ink }} />
                </div>
              </div>
              <div style={{ fontSize: 9, color: WF.ink50 }}>18:42 / 54:10</div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 12, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: WF.ink70 }}>
              <span>Apple</span><span>Spotify</span><span>RSS</span><span>All 47 episodes →</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Artist of the Week — product-tagged */}
      <div style={{ padding: '36px 24px' }}>
        <SectionTag n="06" label="Artist of the Week" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 22 }}>
          <div>
            <Img h={230} label="Saoirse Doolan — portrait with willow" tone="dk" />
            <Caption style={{ marginTop: 10 }}>Saoirse Doolan · Basketmaker · Co. Clare</Caption>
            <div style={{ fontFamily: WF.serif, fontSize: 22, marginTop: 6 }}>Willow, hedgerow-cut.</div>
            <Sub style={{ marginTop: 10 }}>
              Saoirse coppices her own willow and weaves to the rhythm of the
              fishing calendar. Each basket takes three to five days.
            </Sub>
          </div>
          <div>
            <Caption style={{ marginBottom: 10 }}>Saoirse's pieces in the shop</Caption>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['Lobster pot, small', '£220'],
                ['Gathering basket', '£165'],
                ['Herb trug', '£95'],
                ['Wall hanging', '£340'],
              ].map(([n, p]) => (
                <div key={n}>
                  <Img h={95} label="" tone="lt" />
                  <div style={{ fontSize: 11, fontFamily: WF.serif, marginTop: 6 }}>{n}</div>
                  <div style={{ fontSize: 9, color: WF.ink50, marginTop: 1 }}>{p}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}><Btn size="sm">Visit Saoirse's shelf</Btn></div>
          </div>
        </div>
      </div>

      {/* 7. Why Craft Matters */}
      <div style={{ padding: '40px 24px', background: '#1a1a1a', color: '#e8e6e2' }}>
        <div style={{ display: 'flex', gap: 10, fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', color: '#8a8884', marginBottom: 14 }}>
          <span>07</span><span style={{ flex: 1, height: 1, background: '#3a3a3a', marginTop: 5 }} /><span>Why Craft Matters</span>
        </div>
        <Headline size={26} lh={1.2} style={{ color: '#fff', maxWidth: 420 }}>
          When you buy from a maker, you keep a craft alive for another year.
        </Headline>
        <div style={{ fontSize: 11, lineHeight: 1.7, color: '#c8c6c1', marginTop: 14, maxWidth: 460 }}>
          Sixty-three heritage crafts in Ireland are at risk. We put 10% of
          every sale into the Heritage Craft Fund — apprenticeships,
          equipment, tool repair. The rest goes straight to the maker.
        </div>
        <div style={{ marginTop: 16, display: 'inline-block', padding: '10px 18px', fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', border: '1px solid #fff', color: '#fff' }}>
          Read the Manifesto →
        </div>
      </div>

      {/* 8. Shop CTA */}
      <div style={{ padding: '44px 24px', textAlign: 'center' }}>
        <Caption>08 · The Shop</Caption>
        <Headline size={28} style={{ margin: '8px 0 8px' }}>Browse the collection.</Headline>
        <Sub style={{ margin: '0 auto 18px', maxWidth: 340 }}>
          47 makers. 118 pieces currently in the shop. New additions every Friday.
        </Sub>
        <Btn primary size="sm">Enter the Shop</Btn>
      </div>

      <Footer />
    </>
  );
}

Object.assign(window, { D3_HeroA, D3_HeroB, D3_Body });
