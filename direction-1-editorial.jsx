// Direction 1 — Editorial Documentary
// Newspaper/magazine bones: masthead, issue number, multi-column flow,
// long-form caption-led imagery. Podcast framed as "field recordings."

function D1_HeroA() {
  return (
    <div>
      <Masthead mode="editorial" />
      <div style={{ padding: '28px 24px 32px' }}>
        <Caption style={{ marginBottom: 14 }}>The Opening · Feature 01</Caption>
        <Headline size={40} lh={1.02}>
          The hand that makes, remembers.
        </Headline>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 22 }}>
          <Img h={220} label="Hero portrait — Hugh at the wheel, backlit, grinding glass" tone="dk" />
          <div>
            <Sub style={{ marginBottom: 14 }}>
              A journal of craftspeople, heritage skills, and the quiet
              discipline of making things by hand. Told from the workshop
              floor, in their own words.
            </Sub>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              <Btn primary size="sm">Explore Craft</Btn>
              <Btn size="sm">Listen to the Podcast</Btn>
            </div>
            <HR m="0 0 12px" />
            <Caption>In this issue</Caption>
            <div style={{ fontFamily: WF.serif, fontSize: 13, lineHeight: 1.5, marginTop: 6 }}>
              Glass in Kilkenny · Stoneware from West Cork ·
              The last bookbinder in Dublin · A commission for a head of state.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function D1_HeroB() {
  return (
    <div>
      <Masthead mode="editorial" />
      <Img h={320} label="Full-bleed editorial — hands cradling engraved tumbler" tone="dk" />
      <div style={{ padding: '20px 24px 32px', textAlign: 'center' }}>
        <Caption style={{ marginBottom: 12 }}>Field Notes · Vol. I</Caption>
        <Headline size={38} lh={1.05} style={{ maxWidth: 380, margin: '0 auto' }}>
          Stories from the bench, the kiln, and the cutting wheel.
        </Headline>
        <Sub style={{ margin: '14px auto 18px', maxWidth: 320 }}>
          Thirty years at the wheel. A thousand makers on the record.
          This is the work of hands, kept in writing.
        </Sub>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Btn primary size="sm">Explore Craft</Btn>
          <Btn size="sm">Listen to the Podcast</Btn>
        </div>
      </div>
    </div>
  );
}

function D1_Body({ catCols = 3 }) {
  return (
    <>
      {/* 2. Mission — pull quote + dense serif body */}
      <div style={{ padding: '40px 24px', borderTop: `1px solid ${WF.line}`, borderBottom: `1px solid ${WF.line}`, background: WF.paper }}>
        <SectionTag n="02" label="Why We Publish" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
          <Headline size={22} lh={1.2} font="serif">
            In a world of finished objects, the process has gone missing.
          </Headline>
          <div style={{ fontSize: 11, lineHeight: 1.65, color: WF.ink70, columns: 2, columnGap: 16 }}>
            Mass production gave us abundance and took something quieter in
            return — the mark of a person. Made With These Hands is a record
            of the people who still stand at a bench. Their tools, their
            mistakes, their twelve-thousandth try. We believe a handmade
            object carries a memory that a machine-made one cannot.
          </div>
        </div>
      </div>

      {/* 3. Featured Craft Categories — editorial index */}
      <div style={{ padding: '36px 24px' }}>
        <SectionTag n="03" label="The Index" />
        <Headline size={24} style={{ marginBottom: 18 }}>Disciplines in this issue</Headline>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${catCols}, 1fr)`, gap: 14 }}>
          {[
            ['Glass Engraving', '14 makers'],
            ['Jewellery', '22 makers'],
            ['Ceramics', '31 makers'],
            ['Woodwork', '18 makers'],
            ['Collectors Items', '9 pieces'],
            ['Textiles', '12 makers'],
          ].slice(0, catCols * 2).map(([name, meta]) => (
            <div key={name}>
              <Img h={110} label={name} />
              <div style={{ marginTop: 8, fontFamily: WF.serif, fontSize: 13 }}>{name}</div>
              <Caption style={{ marginTop: 2 }}>{meta}</Caption>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Hugh's Story — Documentary portrait + long quote */}
      <div style={{ padding: '36px 24px', background: WF.paper, borderTop: `1px solid ${WF.line}`, borderBottom: `1px solid ${WF.line}` }}>
        <SectionTag n="04" label="Portrait of the Founder" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          <Img h={280} label="Hugh McNeill — half-lit, workshop, 3/4 portrait" tone="dk" />
          <div>
            <Caption style={{ marginBottom: 8 }}>Hugh McNeill · Glass cutter & engraver</Caption>
            <Headline size={22} lh={1.2}>Thirty years at the wheel.</Headline>
            <div style={{ margin: '14px 0' }}>
              <Quote size={14}>
                I learned to cut glass before I learned to drive. The wheel
                teaches you to slow down — you can't argue with it.
              </Quote>
            </div>
            <div style={{ fontSize: 11, lineHeight: 1.65, color: WF.ink70 }}>
              Apprenticed in Waterford at seventeen. Commissioned work for
              heads of state, cathedrals, and a president's desk. Now he
              keeps the workshop open, and records the people who still
              come through the door.
            </div>
            <div style={{ marginTop: 14 }}>
              <Btn size="sm">Read the Full Story</Btn>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Podcast — Field Recordings */}
      <div style={{ padding: '36px 24px' }}>
        <SectionTag n="05" label="Field Recordings · The Podcast" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 22, alignItems: 'start' }}>
          <div>
            <Headline size={26} style={{ marginBottom: 10 }}>
              Conversations with the people who still make things.
            </Headline>
            <Sub style={{ marginBottom: 16 }}>
              Long-form interviews, recorded in workshops, kilns, and kitchens
              across Ireland and beyond. New episode every fortnight.
            </Sub>
            <Btn size="sm">Browse all 47 episodes</Btn>
          </div>
          <div>
            {[
              ['EP 47', 'Méabh Ó Riada', 'Bog oak, dowsing, and the grain of 4,000 years'],
              ['EP 46', 'Tomás Kelly', 'Silversmithing after the crash'],
              ['EP 45', 'Nuala Finn', 'What linen remembers'],
            ].map(([n, guest, title]) => (
              <div key={n} style={{ display: 'flex', gap: 10, padding: '10px 0', borderTop: `1px solid ${WF.line}` }}>
                <Img w={52} h={52} label="" tone="dk" />
                <div style={{ flex: 1 }}>
                  <Caption>{n} · {guest}</Caption>
                  <div style={{ fontFamily: WF.serif, fontSize: 12, marginTop: 2, lineHeight: 1.3 }}>{title}</div>
                </div>
                <div style={{ width: 22, height: 22, border: `1px solid ${WF.ink}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, marginTop: 14 }}>▶</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Artist of the Week */}
      <div style={{ padding: '36px 24px', background: '#1a1a1a', color: '#e8e6e2' }}>
        <div style={{ display: 'flex', gap: 10, fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', color: '#8a8884', marginBottom: 14 }}>
          <span>06</span>
          <span style={{ flex: 1, height: 1, background: '#3a3a3a', marginTop: 5 }} />
          <span>Artist of the Week</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          <Img h={240} label="Artist at work — low light, moody" tone="dk" />
          <div>
            <div style={{ fontFamily: WF.serif, fontSize: 26, color: '#fff', lineHeight: 1.1 }}>Saoirse Doolan</div>
            <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8a8884', margin: '6px 0 14px' }}>Basketmaker · Co. Clare</div>
            <div style={{ fontSize: 11, lineHeight: 1.65, color: '#c8c6c1' }}>
              Saoirse works with hedgerow willow she coppices herself. Her
              baskets are exhibited at the National Museum and carried in
              the hands of fishermen along the Atlantic coast.
            </div>
            <div style={{ marginTop: 16, display: 'inline-block', padding: '10px 18px', fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', border: '1px solid #fff', color: '#fff' }}>
              Explore Saoirse's work →
            </div>
          </div>
        </div>
      </div>

      {/* 7. Why Craft Matters */}
      <div style={{ padding: '40px 24px' }}>
        <SectionTag n="07" label="An Essay" />
        <Headline size={28} lh={1.15} style={{ marginBottom: 14, maxWidth: 360 }}>
          Sixty-three heritage crafts in Ireland are at risk of disappearing in a generation.
        </Headline>
        <div style={{ fontSize: 11, lineHeight: 1.7, color: WF.ink70, columns: 2, columnGap: 18 }}>
          Thatching. Coopering. Drystone walling. Hand-cut glass.
          These are not hobbies — they are bodies of knowledge held in
          fewer than a dozen pairs of hands each. When those hands stop,
          the knowledge goes. Made With These Hands exists to put the
          tradition on the record and point readers toward the makers who
          still take apprentices. Read the full essay inside.
        </div>
        <div style={{ marginTop: 16 }}>
          <Btn size="sm">Read the Essay</Btn>
        </div>
      </div>

      {/* 8. Shop CTA — single block */}
      <div style={{ padding: '40px 24px', borderTop: `1px solid ${WF.line}`, background: WF.paper, textAlign: 'center' }}>
        <Caption style={{ marginBottom: 12 }}>08 · The Shop</Caption>
        <Headline size={28} style={{ marginBottom: 8 }}>A small, slow shop.</Headline>
        <Sub style={{ margin: '0 auto 18px', maxWidth: 320 }}>
          A rotating selection of handmade pieces and one-off collectors
          items, chosen by Hugh. Numbers are always small.
        </Sub>
        <Btn primary size="sm">Browse the Collection</Btn>
      </div>

      <Footer />
    </>
  );
}

Object.assign(window, { D1_HeroA, D1_HeroB, D1_Body });
