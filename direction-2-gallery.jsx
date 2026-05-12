// Direction 2 — Heritage Gallery
// Museum/gallery bones: quiet centered type, plinthed objects, wall labels,
// generous whitespace, symmetrical grid. Hugh as timeline.

function D2_HeroA() {
  return (
    <div style={{ background: '#faf8f3' }}>
      <Masthead mode="rail" />
      <div style={{ padding: '72px 32px 64px', textAlign: 'center' }}>
        <Caption style={{ marginBottom: 22 }}>Est. 1994 · Kilkenny · Ireland</Caption>
        <Headline size={44} lh={1.05} style={{ letterSpacing: -0.5 }}>
          Made<br/>With These<br/>Hands.
        </Headline>
        <div style={{ width: 32, height: 1, background: WF.ink, margin: '22px auto' }} />
        <Sub style={{ margin: '0 auto 26px', maxWidth: 300 }}>
          A gallery of heritage crafts, artisan stories, and objects made
          one pair of hands at a time.
        </Sub>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Btn primary size="sm">Explore Craft</Btn>
          <Btn size="sm">Listen to the Podcast</Btn>
        </div>
      </div>
      {/* plinthed object below the fold */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: WF.line, borderTop: `1px solid ${WF.line}` }}>
        <div style={{ background: '#faf8f3', padding: 18, textAlign: 'center' }}>
          <Img h={120} label="Object I · engraved decanter" tone="lt" style={{ background: '#f0ede6' }} />
          <Caption style={{ marginTop: 10 }}>Plate 01</Caption>
        </div>
        <div style={{ background: '#faf8f3', padding: 18, textAlign: 'center' }}>
          <Img h={120} label="Object II · turned bowl" tone="lt" style={{ background: '#f0ede6' }} />
          <Caption style={{ marginTop: 10 }}>Plate 02</Caption>
        </div>
        <div style={{ background: '#faf8f3', padding: 18, textAlign: 'center' }}>
          <Img h={120} label="Object III · silver pin" tone="lt" style={{ background: '#f0ede6' }} />
          <Caption style={{ marginTop: 10 }}>Plate 03</Caption>
        </div>
      </div>
    </div>
  );
}

function D2_HeroB() {
  return (
    <div style={{ background: '#faf8f3' }}>
      <Masthead mode="rail" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 360 }}>
        <div style={{ padding: '60px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Caption style={{ marginBottom: 16 }}>The Collection</Caption>
          <Headline size={36} lh={1.05}>
            Objects, stories, and the people who shape them.
          </Headline>
          <Sub style={{ marginTop: 16, marginBottom: 22 }}>
            An ongoing record of heritage skills, curated by a glass
            engraver of thirty years and the makers he keeps company with.
          </Sub>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn primary size="sm">Explore Craft</Btn>
            <Btn size="sm">Listen</Btn>
          </div>
        </div>
        <div style={{ background: '#e8e4db', position: 'relative' }}>
          <Img h="100%" label="Single object, centered — lead-crystal tumbler on linen" tone="lt" style={{ background: '#e8e4db' }} />
          <div style={{ position: 'absolute', bottom: 18, left: 18, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: WF.ink50 }}>
            Plate 01 · Lead crystal, hand-cut · H. McNeill, 2024
          </div>
        </div>
      </div>
    </div>
  );
}

function D2_Body({ catCols = 3 }) {
  return (
    <>
      {/* 2. Mission — gallery wall-text */}
      <div style={{ padding: '56px 40px', textAlign: 'center', background: '#faf8f3' }}>
        <Caption style={{ marginBottom: 16 }}>02 · On the Wall</Caption>
        <Headline size={22} lh={1.45} style={{ maxWidth: 440, margin: '0 auto', fontStyle: 'italic' }} font="serif">
          Mass production gave the world abundance. This gallery is for what it
          cost us — the mark of a hand, the memory in an object, the years
          it took to learn.
        </Headline>
        <div style={{ width: 24, height: 1, background: WF.ink, margin: '20px auto 0' }} />
      </div>

      {/* 3. Categories — symmetrical grid, gallery cards */}
      <div style={{ padding: '44px 28px', borderTop: `1px solid ${WF.line}` }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Caption>03 · Rooms</Caption>
          <Headline size={24} style={{ marginTop: 6 }}>The Disciplines</Headline>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${catCols}, 1fr)`, gap: 18 }}>
          {[
            ['I', 'Glass Engraving', 'Cut · Etched · Blown'],
            ['II', 'Jewellery', 'Silver · Gold · Enamel'],
            ['III', 'Ceramics', 'Stoneware · Porcelain'],
            ['IV', 'Woodwork', 'Turned · Carved · Green'],
            ['V', 'Collectors Items', 'One-of-a-kind'],
            ['VI', 'Textiles', 'Linen · Wool · Dyed'],
          ].slice(0, catCols * 2).map(([r, name, sub]) => (
            <div key={name} style={{ textAlign: 'center', padding: 14, border: `1px solid ${WF.line}` }}>
              <Caption style={{ marginBottom: 10 }}>Room {r}</Caption>
              <Img h={130} label={name} tone="lt" style={{ background: '#ebe8e1' }} />
              <div style={{ fontFamily: WF.serif, fontSize: 15, marginTop: 12 }}>{name}</div>
              <div style={{ fontSize: 10, color: WF.ink50, marginTop: 4, letterSpacing: 0.5 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Hugh — Timeline */}
      <div style={{ padding: '52px 28px', background: '#faf8f3', borderTop: `1px solid ${WF.line}`, borderBottom: `1px solid ${WF.line}` }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Caption>04 · The Curator</Caption>
          <Headline size={28} style={{ marginTop: 6 }}>Hugh McNeill</Headline>
          <Sub style={{ margin: '8px auto 0', maxWidth: 320 }}>
            From a Waterford apprenticeship to a glassworks of his own —
            thirty-two years, a single craft.
          </Sub>
        </div>
        <div style={{ position: 'relative', paddingLeft: 24 }}>
          <div style={{ position: 'absolute', left: 6, top: 6, bottom: 6, width: 1, background: WF.ink30 }} />
          {[
            ['1994', 'Apprenticed at seventeen, Waterford Crystal.'],
            ['2001', 'First private commission — a cathedral window in Co. Down.'],
            ['2008', 'Opens own workshop in Kilkenny.'],
            ['2015', 'Commissioned piece for a visiting head of state.'],
            ['2022', 'Begins the Made With These Hands podcast.'],
            ['Today', 'Records makers, cuts glass, takes apprentices.'],
          ].map(([y, t]) => (
            <div key={y} style={{ position: 'relative', paddingBottom: 18 }}>
              <div style={{ position: 'absolute', left: -24, top: 4, width: 13, height: 13, border: `1px solid ${WF.ink}`, background: '#faf8f3', borderRadius: '50%' }} />
              <div style={{ fontFamily: WF.serif, fontSize: 15 }}>{y}</div>
              <div style={{ fontSize: 11, color: WF.ink70, lineHeight: 1.55, marginTop: 3 }}>{t}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <Btn size="sm">Read the Full Biography</Btn>
        </div>
      </div>

      {/* 5. Podcast — gallery listening room */}
      <div style={{ padding: '48px 28px', textAlign: 'center' }}>
        <Caption>05 · Listening Room</Caption>
        <Headline size={28} style={{ margin: '6px 0 8px' }}>In Conversation</Headline>
        <Sub style={{ margin: '0 auto 22px', maxWidth: 320 }}>
          Recorded interviews with the makers whose work hangs in these
          rooms. Forty-seven episodes, free to listen.
        </Sub>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {[
            ['EP 47', 'Méabh Ó Riada', 'The grain of 4,000 years'],
            ['EP 46', 'Tomás Kelly', 'Silversmithing after the crash'],
            ['EP 45', 'Nuala Finn', 'What linen remembers'],
          ].map(([n, g, t]) => (
            <div key={n} style={{ border: `1px solid ${WF.line}`, padding: 14 }}>
              <Img h={90} label="Portrait" tone="lt" style={{ background: '#ebe8e1' }} />
              <Caption style={{ margin: '10px 0 4px' }}>{n}</Caption>
              <div style={{ fontFamily: WF.serif, fontSize: 13 }}>{g}</div>
              <div style={{ fontSize: 10, color: WF.ink50, marginTop: 4, lineHeight: 1.4 }}>{t}</div>
              <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: WF.ink70 }}>
                <span style={{ width: 16, height: 16, border: `1px solid ${WF.ink}`, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 7 }}>▶</span>
                Listen · 54 min
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Artist of the Week — plinthed */}
      <div style={{ padding: '52px 28px', background: '#faf8f3', textAlign: 'center' }}>
        <Caption>06 · Artist of the Week</Caption>
        <div style={{ margin: '20px auto 16px', maxWidth: 280, position: 'relative' }}>
          <Img h={240} label="Saoirse Doolan, holding a basket" tone="lt" style={{ background: '#ebe8e1' }} />
          {/* plinth */}
          <div style={{ height: 8, background: WF.ink30, margin: '0 -8px' }} />
          <div style={{ height: 4, background: WF.ink15, margin: '0 -18px' }} />
        </div>
        <Headline size={26}>Saoirse Doolan</Headline>
        <Caption style={{ marginTop: 6 }}>Basketmaker · Co. Clare · Est. 2009</Caption>
        <div style={{ margin: '14px auto', maxWidth: 340, textAlign: 'left', padding: '14px 18px', background: '#fff', border: `1px solid ${WF.line}` }}>
          <Caption style={{ marginBottom: 8 }}>Wall Label</Caption>
          <div style={{ fontSize: 11, lineHeight: 1.6, color: WF.ink70 }}>
            Saoirse coppices her own hedgerow willow. Her baskets are exhibited
            at the National Museum of Ireland and carried by Atlantic fishermen.
            Each takes between three and five days.
          </div>
        </div>
        <Btn size="sm">Explore the Exhibition</Btn>
      </div>

      {/* 7. Why Craft Matters */}
      <div style={{ padding: '48px 28px', borderTop: `1px solid ${WF.line}` }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Caption>07 · On the Record</Caption>
          <Headline size={26} style={{ marginTop: 6, maxWidth: 360, margin: '6px auto 0' }} lh={1.2}>
            Why heritage crafts need keepers.
          </Headline>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 18 }}>
          {[
            ['63', 'crafts in Ireland at risk of disappearing'],
            ['11', 'considered critically endangered'],
            ['~9', 'living master glass engravers'],
          ].map(([n, t]) => (
            <div key={n} style={{ padding: 14, border: `1px solid ${WF.line}`, textAlign: 'center' }}>
              <Headline size={34} font="serif">{n}</Headline>
              <div style={{ fontSize: 10, color: WF.ink50, marginTop: 6, lineHeight: 1.4 }}>{t}</div>
            </div>
          ))}
        </div>
        <Sub style={{ margin: '0 auto', maxWidth: 380, textAlign: 'center' }}>
          We keep the record and point readers toward the makers still
          taking apprentices. Read the full essay inside.
        </Sub>
        <div style={{ textAlign: 'center', marginTop: 14 }}><Btn size="sm">Read the Essay</Btn></div>
      </div>

      {/* 8. Shop */}
      <div style={{ padding: '48px 28px', textAlign: 'center', background: '#faf8f3', borderTop: `1px solid ${WF.line}` }}>
        <Caption>08 · The Shop</Caption>
        <Headline size={26} style={{ margin: '6px 0 8px' }}>A curated selection.</Headline>
        <Sub style={{ margin: '0 auto 20px', maxWidth: 320 }}>
          A small, rotating collection of handmade pieces and one-off
          collectors items. Chosen, not sold.
        </Sub>
        <Btn primary size="sm">Enter the Shop</Btn>
      </div>

      <Footer />
    </>
  );
}

Object.assign(window, { D2_HeroA, D2_HeroB, D2_Body });
