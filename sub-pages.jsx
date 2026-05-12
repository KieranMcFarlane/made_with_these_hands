// Sub-page wireframe — Podcast episode / Artist detail variants per direction

function SubPage_D1_Episode() {
  // Editorial documentary — long-form reading page
  return (
    <div>
      <Masthead mode="editorial" />
      <div style={{ padding: '28px 24px 32px' }}>
        <Caption style={{ marginBottom: 12 }}>Field Recording · Episode 47</Caption>
        <Headline size={32} lh={1.1} style={{ marginBottom: 10 }}>
          Méabh Ó Riada and the grain of 4,000 years.
        </Headline>
        <Caption style={{ color: WF.ink70 }}>
          Recorded in Connemara · 54 min · Published April 12
        </Caption>
        <Img h={240} label="Méabh at her bench, bog-oak beams stacked behind" tone="dk" style={{ marginTop: 18 }} />
        {/* Player */}
        <div style={{ padding: 14, border: `1px solid ${WF.ink}`, marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 34, height: 34, background: WF.ink, color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>▶</div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 2, background: WF.ink15, position: 'relative' }}>
              <div style={{ width: '35%', height: '100%', background: WF.ink }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: WF.ink50 }}>
              <span>18:42</span><span>54:10</span>
            </div>
          </div>
        </div>
        {/* Body — two column editorial */}
        <div style={{ marginTop: 24, fontSize: 11, lineHeight: 1.75, color: WF.ink70, columns: 2, columnGap: 18 }}>
          Méabh Ó Riada works with bog oak pulled from the peat of West
          Galway — wood that has been underground since the Bronze Age.
          "The grain," she says, "is a diary." In this conversation we
          walk the bog where she sources it, watch her split a beam with
          a mallet her father made, and hear why she refuses power tools.
          The episode is accompanied by a transcript, a gallery of her
          current work, and notes on the three tools she uses most.
        </div>
        {/* Pullquote */}
        <div style={{ margin: '24px 0', padding: '18px 0', borderTop: `1px solid ${WF.line}`, borderBottom: `1px solid ${WF.line}`, textAlign: 'center' }}>
          <Quote size={18}>You cannot rush a tree that took four thousand years to get here.</Quote>
          <Caption style={{ marginTop: 10 }}>— Méabh Ó Riada</Caption>
        </div>
        {/* Chapters */}
        <Caption style={{ marginBottom: 10 }}>Chapters</Caption>
        {[
          ['00:00', 'Walking the bog'],
          ['08:14', 'On the tools her father made'],
          ['21:30', 'Why power tools do not belong here'],
          ['38:02', 'The apprentice she is looking for'],
        ].map(([t, n]) => (
          <div key={t} style={{ display: 'flex', gap: 14, padding: '8px 0', borderTop: `1px solid ${WF.line}`, fontSize: 11 }}>
            <span style={{ color: WF.ink50, fontVariantNumeric: 'tabular-nums' }}>{t}</span>
            <span style={{ fontFamily: WF.serif }}>{n}</span>
          </div>
        ))}
        {/* Related */}
        <div style={{ marginTop: 28 }}>
          <Caption style={{ marginBottom: 10 }}>Read Next</Caption>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {['EP 46 · Tomás Kelly', 'Essay · The last bog-oak workers'].map(t => (
              <div key={t}>
                <Img h={90} label="" tone="dk" />
                <div style={{ fontFamily: WF.serif, fontSize: 12, marginTop: 6, lineHeight: 1.3 }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function SubPage_D2_Artist() {
  // Heritage gallery — exhibition page for an artist
  return (
    <div style={{ background: '#faf8f3' }}>
      <Masthead mode="rail" />
      <div style={{ padding: '48px 28px 24px', textAlign: 'center' }}>
        <Caption style={{ marginBottom: 14 }}>Exhibition · April 2026</Caption>
        <Headline size={34} lh={1.05}>Saoirse Doolan</Headline>
        <Caption style={{ marginTop: 10 }}>Basketmaker · Co. Clare · b. 1982</Caption>
        <div style={{ width: 24, height: 1, background: WF.ink, margin: '18px auto' }} />
      </div>
      {/* Hero object */}
      <div style={{ padding: '0 28px 28px' }}>
        <Img h={300} label="Hero object — lobster pot, raking light on linen plinth" tone="lt" style={{ background: '#e8e4db' }} />
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: WF.ink50 }}>
          <span>Plate 01 · Lobster pot, small · 2025</span>
          <span>Hedgerow willow, coppiced Co. Clare</span>
        </div>
      </div>
      {/* Wall label */}
      <div style={{ margin: '0 28px 36px', padding: 22, background: WF.bg, border: `1px solid ${WF.line}` }}>
        <Caption style={{ marginBottom: 10 }}>Wall Label</Caption>
        <div style={{ fontSize: 11, lineHeight: 1.7, color: WF.ink70 }}>
          Saoirse Doolan coppices her own hedgerow willow on the south shore
          of Galway Bay. She weaves to the rhythm of the Atlantic fishing
          calendar — lobster pots in spring, gathering baskets in summer.
          Her work is held in the collection of the National Museum of
          Ireland and used daily by the fishermen of Roundstone.
        </div>
      </div>
      {/* Plates — gallery grid */}
      <div style={{ padding: '0 28px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Caption>Plates II – VII</Caption>
          <Headline size={20} style={{ marginTop: 4 }}>Selected works</Headline>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {['Plate II', 'Plate III', 'Plate IV', 'Plate V', 'Plate VI', 'Plate VII'].map(p => (
            <div key={p} style={{ textAlign: 'center' }}>
              <Img h={130} label={p} tone="lt" style={{ background: '#e8e4db' }} />
              <Caption style={{ marginTop: 8 }}>{p}</Caption>
            </div>
          ))}
        </div>
      </div>
      {/* Interview link + acquire */}
      <div style={{ margin: '0 28px 36px', padding: 22, background: '#ebe8e1', textAlign: 'center' }}>
        <Caption style={{ marginBottom: 8 }}>Listen</Caption>
        <div style={{ fontFamily: WF.serif, fontSize: 16 }}>EP 32 · Saoirse Doolan on coppiced willow</div>
        <div style={{ marginTop: 14, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Btn size="sm">Play the conversation</Btn>
          <Btn primary size="sm">Acquire a piece</Btn>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function SubPage_D3_Product() {
  // Marketplace — maker shelf / product detail
  return (
    <div>
      <Masthead mode="minimal" />
      <div style={{ padding: '14px 24px', fontSize: 10, color: WF.ink50, letterSpacing: 0.5 }}>
        Shop → Basketmaking → Saoirse Doolan → Lobster pot, small
      </div>
      <div style={{ padding: '8px 24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Gallery */}
        <div>
          <Img h={280} label="Hero — lobster pot at ¾ angle" tone="lt" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginTop: 6 }}>
            {[1,2,3,4].map(i => <Img key={i} h={50} label="" tone="lt" />)}
          </div>
        </div>
        {/* Buy column */}
        <div>
          <Caption style={{ marginBottom: 8 }}>Made by Saoirse Doolan · Co. Clare</Caption>
          <Headline size={26} lh={1.1}>Lobster pot, small.</Headline>
          <div style={{ fontFamily: WF.serif, fontSize: 18, marginTop: 12 }}>£220</div>
          <div style={{ fontSize: 10, color: WF.ink50, marginTop: 2 }}>Edition of 12 · 4 remaining</div>
          <div style={{ marginTop: 16, fontSize: 11, lineHeight: 1.65, color: WF.ink70 }}>
            Hand-woven from hedgerow willow, coppiced by Saoirse on the south
            shore of Galway Bay. Each takes between three and five days to make.
          </div>
          <div style={{ marginTop: 18 }}>
            <Btn primary size="sm" w="100%">Add to basket</Btn>
          </div>
          <div style={{ marginTop: 14, fontSize: 10, color: WF.ink70, lineHeight: 1.6 }}>
            Ships from Kilkenny within 5 working days · Free UK & Ireland · 10% to the Heritage Craft Fund
          </div>
          {/* Specs */}
          <div style={{ marginTop: 20, borderTop: `1px solid ${WF.line}` }}>
            {[
              ['Material', 'Coppiced willow, hedgerow'],
              ['Dimensions', '32 × 24 × 18 cm'],
              ['Weight', '1.1 kg'],
              ['Signed', 'Maker mark, underside'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', padding: '8px 0', borderBottom: `1px solid ${WF.line}`, fontSize: 10 }}>
                <span style={{ width: 100, color: WF.ink50, letterSpacing: 0.8, textTransform: 'uppercase' }}>{k}</span>
                <span style={{ flex: 1, fontFamily: WF.serif }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Maker card */}
      <div style={{ margin: '0 24px 28px', padding: 18, background: WF.paper, display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 14, alignItems: 'center' }}>
        <Img w={80} h={80} label="" tone="dk" />
        <div>
          <div style={{ fontFamily: WF.serif, fontSize: 15 }}>Saoirse Doolan</div>
          <div style={{ fontSize: 10, color: WF.ink50, marginTop: 2 }}>12 pieces in the shop · 1 podcast episode</div>
        </div>
        <Btn size="sm">Visit shelf</Btn>
      </div>
      {/* Cross-sell */}
      <div style={{ padding: '0 24px 32px' }}>
        <Caption style={{ marginBottom: 10 }}>More from Saoirse</Caption>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[['Gathering basket', '£165'], ['Herb trug', '£95'], ['Wall hanging', '£340'], ['Creel, large', '£280']].map(([n, p]) => (
            <div key={n}>
              <Img h={100} label="" tone="lt" />
              <div style={{ fontFamily: WF.serif, fontSize: 11, marginTop: 6 }}>{n}</div>
              <div style={{ fontSize: 9, color: WF.ink50 }}>{p}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

Object.assign(window, { SubPage_D1_Episode, SubPage_D2_Artist, SubPage_D3_Product });
