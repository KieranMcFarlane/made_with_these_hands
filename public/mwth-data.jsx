const MWTH_DATA = {
  makers: [
    {
      slug: 'saoirse-doolan',
      name: 'Saoirse Doolan',
      craft: 'Basketry',
      place: 'Co. Clare',
      established: '2009',
      image: '/images/mwth-product-lobster-pot.jpg',
      heroLabel: 'Saoirse Doolan in the willow shed, Co. Clare',
      dek: 'Basketmaker in Co. Clare. Coppices her own willow. Holds work in the National Museum of Ireland.',
      practiceTitle: 'Winter willow, cut by hand, woven while still green.',
      practice: [
        'Saoirse works a small stand of willow near the Atlantic coast, cutting in winter when the sap is low and sorting every rod by hand before it enters the shed.',
        'Her baskets sit between field utility and collection object: lobster pots, gathering baskets, trugs, and woven studies that preserve patterns she learned from older Clare makers.',
      ],
    },
    {
      slug: 'hugh-mcneill',
      name: 'Hugh McNeill',
      craft: 'Glass engraving',
      place: 'Kilkenny',
      established: '2008',
      image: '/images/mwth-maker-portrait.jpg',
      heroLabel: 'Hugh McNeill at the copper wheel, Kilkenny',
      dek: 'Glass cutter and engraver in Kilkenny. Founder of Made With These Hands and host of Field Recordings.',
      practiceTitle: 'Cut glass, oral archive, and the discipline of the wheel.',
      practice: [
        'Hugh works from Canal Walk in Kilkenny, where the cutting wheel still runs beside the recording desk.',
        'He chooses the shop objects, records the makers, and keeps the studio narrow enough that every piece can be held and known.',
      ],
    },
    {
      slug: 'meabh-o-riada',
      name: 'Méabh Ó Riada',
      craft: 'Woodwork',
      place: 'Co. Galway',
      established: '2003',
      image: null,
      heroLabel: 'Méabh Ó Riada with bog oak in Carraroe',
      dek: 'Bog-oak woodworker in Carraroe. Works with timber held underground since the Bronze Age.',
      practiceTitle: 'Ancient oak, hand tools, and material that refuses haste.',
      practice: [
        'Méabh salvages bog oak from West Galway and works it with hand tools because the grain will not tolerate speed.',
        'Her spoons, bowls, and boxes carry the colour of peat and the uncertainty of wood pulled from another age.',
      ],
    },
    {
      slug: 'tomas-kelly',
      name: 'Tomás Kelly',
      craft: 'Silversmithing',
      place: 'Dublin',
      established: '1998',
      image: null,
      heroLabel: 'Tomás Kelly polishing silver at the bench',
      dek: 'Dublin silversmith making domestic silver, repairs, and small ceremonial commissions.',
      practiceTitle: 'Silver after the crash, repaired rather than replaced.',
      practice: [
        'Tomás is known for repair work and quiet domestic silver: spoons, cups, salt cellars, and small heirloom objects.',
        'His archive records how families kept objects moving through economic collapse by repairing them at the bench.',
      ],
    },
    {
      slug: 'nuala-finn',
      name: 'Nuala Finn',
      craft: 'Jewellery',
      place: 'Dublin',
      established: '2012',
      image: null,
      heroLabel: 'Nuala Finn laying out linen and silver forms',
      dek: 'Jeweller and textile researcher in Dublin, working across silver, linen memory, and small heirlooms.',
      practiceTitle: 'Objects worn close to the body, and cloth that remembers.',
      practice: [
        'Nuala makes jewellery with textile references: cuffs, signets, pins, and small works that hold domestic memory.',
        'Her conversation with Hugh traces how linen, metal, and family stories become one object.',
      ],
    },
  ],
  products: [
    { slug: 'lead-crystal-tumbler', name: 'Lead-crystal tumbler', maker: 'hugh-mcneill', craft: 'Glass engraving', price: '£180', place: 'Kilkenny', image: '/images/mwth-hero-glass-engraving.jpg', meta: 'Cut glass · signed · edition of 12' },
    { slug: 'engraved-decanter', name: 'Engraved decanter', maker: 'hugh-mcneill', craft: 'Glass engraving', price: '£420', place: 'Kilkenny', image: '/images/mwth-hero-glass-engraving.jpg', meta: 'Cut glass · commission pattern' },
    { slug: 'lobster-pot-small', name: 'Lobster pot, small', maker: 'saoirse-doolan', craft: 'Basketry', price: '£220', place: 'Co. Clare', image: '/images/mwth-product-lobster-pot.jpg', meta: 'Working basket · edition of 12' },
    { slug: 'gathering-basket', name: 'Gathering basket', maker: 'saoirse-doolan', craft: 'Basketry', price: '£165', place: 'Co. Clare', image: '/images/mwth-product-lobster-pot.jpg', meta: 'Hedgerow willow · signed underside' },
    { slug: 'herb-trug', name: 'Herb trug', maker: 'saoirse-doolan', craft: 'Basketry', price: '£95', place: 'Co. Clare', image: '/images/mwth-product-lobster-pot.jpg', meta: 'Kitchen piece · made to order' },
    { slug: 'bog-oak-spoon', name: 'Bog-oak spoon', maker: 'meabh-o-riada', craft: 'Woodwork', price: '£42', place: 'Co. Galway', image: null, meta: 'Bog oak · hand finished' },
    { slug: 'silver-cuff', name: 'Silver cuff', maker: 'nuala-finn', craft: 'Jewellery', price: '£240', place: 'Dublin', image: null, meta: 'Silver · linen study' },
    { slug: 'stoneware-jug', name: 'Stoneware jug', maker: 'padraig-brennan', craft: 'Ceramics', price: '£95', place: 'West Cork', image: null, meta: 'Stoneware · kitchen piece' },
  ],
  episodes: [
    { number: '047', maker: 'meabh-o-riada', guest: 'Méabh Ó Riada', title: 'Bog oak, dowsing, and the grain of 4,000 years', craft: 'Woodwork', place: 'Connemara', duration: '54 min', date: 'April 12, 2026', body: ['Hugh records Méabh in Carraroe, following the timber from bog to bench and asking why some material refuses hurry.', 'The conversation moves through old tools, wet ground, patient work, and the discipline of letting ancient oak decide the pace.'] },
    { number: '046', maker: 'tomas-kelly', guest: 'Tomás Kelly', title: 'Silversmithing after the crash', craft: 'Silversmithing', place: 'Dublin', duration: '48 min', date: 'March 29, 2026', body: ['Tomás talks about repair work, domestic silver, and the families who chose restoration over replacement.', 'The episode follows cups, spoons, and small ceremonial objects through years when keeping something alive mattered more than buying something new.'] },
    { number: '045', maker: 'nuala-finn', guest: 'Nuala Finn', title: 'What linen remembers', craft: 'Jewellery', place: 'Dublin', duration: '1h 02', date: 'March 15, 2026', body: ['Nuala traces a line between linen, jewellery, and memory worn close to the body.', 'Her studio notes turn domestic cloth into silver forms, pins, cuffs, and small heirlooms.'] },
    { number: '044', maker: 'daithi-o-conchuir', guest: 'Dáithí Ó Conchúir', title: 'Thatching the last reed-roofs of Donegal', craft: 'Thatching', place: 'Co. Donegal', duration: '57 min', date: 'March 1, 2026' },
    { number: '043', maker: 'saoirse-doolan', guest: 'Saoirse Doolan', title: 'Winter willow and the working basket', craft: 'Basketry', place: 'Co. Clare', duration: '49 min', date: 'February 16, 2026' },
    { number: '042', maker: 'hugh-mcneill', guest: 'Hugh McNeill', title: 'Thirty years at the wheel', craft: 'Glass engraving', place: 'Kilkenny', duration: '44 min', date: 'February 2, 2026' },
  ],
  posts: [
    {
      slug: 'why-we-record-the-tools',
      title: 'Why we record the tools',
      dek: 'A field note from Hugh on sound, memory, and the small noises that carry a craft.',
      date: 'April 20, 2026',
      author: 'Hugh McNeill',
      category: 'Field note',
      image: '/images/mwth-podcast-bench.jpg',
      body: [
        'A tool tells you what the maker has learned to stop forcing. The handle is worn where pressure softened into habit, the edge is kept only as sharp as the material will allow, and the noise it makes tells you whether the hand is fighting or listening.',
        'Field Recordings began because photographs were not enough. A still image can show the basket, the glass, the timber, the silver. It cannot hold the rasp of a file, the rhythm of a wheel, or the pause before a maker decides to leave a mark alone.',
      ],
    },
    {
      slug: 'the-object-archive',
      title: 'The object archive is not a shopfront',
      dek: 'How the listed objects connect makers, podcast episodes, and personal correspondence.',
      date: 'April 8, 2026',
      author: 'Hugh McNeill',
      category: 'Archive',
      image: '/images/mwth-product-lobster-pot.jpg',
      body: [
        'The objects listed here are not a catalogue in the usual sense. They are records of a maker, a place, and a conversation. Some are available. Some are references. All of them belong to the story of the hand that made them.',
        'That is why enquiries come to the studio rather than a checkout. A person should be able to ask where a piece came from, how it will age, and whether it is the right object for the room, table, or family they have in mind.',
      ],
    },
  ],
  site: {
    sections: {
      masthead: {
        eyebrow: 'Vol. I - No. 07',
        title: 'Made With These Hands',
        dek: 'A journal of heritage craft',
        meta: 'Kilkenny - April 2026',
      },
      hero: {
        eyebrow: 'The Opening - Feature 01',
        title: 'The hand that<br/>makes, <span className="italic">remembers</span>.',
        dek: 'A journal of craftspeople, heritage skills, and the quiet discipline of making things by hand. Told from the workshop floor, in their own words.',
        image: '/images/mwth-hero-glass-engraving.jpg',
        imageAlt: "Hugh's hands engraving a lead-crystal tumbler in the Kilkenny workshop",
        ctaLabel: 'Explore Craft',
        ctaHref: '#craft',
        secondaryCtaLabel: 'Listen to the Podcast',
        secondaryCtaHref: '/?page=podcasts',
        meta: 'Glass in Kilkenny - Stoneware from West Cork - The last bookbinder in Dublin - A commission for a head of state.',
      },
      hero_b: {
        eyebrow: 'Field Notes - Vol. I',
        title: 'Stories from the bench, the kiln,<br/>and the cutting wheel.',
        dek: 'Thirty years at the wheel. A thousand makers on the record. This is the work of hands, kept in writing.',
        image: '/images/mwth-hero-glass-engraving.jpg',
        imageAlt: 'Full-bleed cover - hands cutting an engraved lead-crystal tumbler, raking side light',
      },
      mission: {
        label: 'Why We Publish',
        title: 'In a world of <span className="italic">finished objects</span>, the process has gone missing.',
        body: [
          'Mass production gave us abundance and took something quieter in return - the mark of a person. A handmade object carries a memory that a machine-made one cannot.',
          'Made With These Hands is a record of the people who still stand at a bench. Their tools, their mistakes, their twelve-thousandth try. We publish, we listen, we keep the craft on paper.',
        ],
      },
      craft_index: {
        label: 'The Index',
        title: 'Disciplines in <span className="italic">this issue</span>.',
      },
      founder_portrait: {
        label: 'Portrait of the Founder',
        eyebrow: 'Hugh McNeill - Glass cutter & engraver - Kilkenny',
        title: 'Thirty years<br/>at the <span className="italic">wheel</span>.',
        dek: 'Apprenticed in Waterford at seventeen. Commissioned for cathedrals, heads of state, and a president&rsquo;s desk. Today the workshop is still open on Canal Walk, the copper wheel still spinning, and Hugh records the makers who come through the door.',
        quote: 'I learned to cut glass before I learned to drive. The wheel teaches you to slow down - you cannot argue with it.',
        image: '/images/mwth-maker-portrait.jpg',
        imageAlt: 'Hugh McNeill - half-lit, workshop, 3/4 portrait, shirt sleeves rolled',
        ctaLabel: 'Read the full story',
        ctaHref: '/?page=hugh',
      },
      podcast_home: {
        label: 'Field Recordings - The Podcast',
        title: 'Conversations with the people who still <span className="italic">make things</span>.',
        dek: 'Long-form interviews, recorded in workshops, kilns, and kitchens across Ireland and beyond. New episode every fortnight.',
        image: '/images/mwth-podcast-bench.jpg',
        imageAlt: 'Field recording setup on a craft workshop bench',
        links: ['Apple', 'Spotify', 'Overcast', 'RSS'],
      },
      artist_feature: {
        label: 'Artist of the Week',
        makerSlug: 'saoirse-doolan',
        quote: 'You cut the willow when the leaves are gone and the sap is low. Everything waits for winter.',
        ctaLabel: 'Explore Saoirse&rsquo;s work',
      },
      essay: {
        label: 'An Essay',
        title: 'Sixty-three heritage crafts in Ireland are at risk of disappearing in a <span className="italic">generation</span>.',
        metrics: [
          ['63', 'crafts at risk of being lost'],
          ['11', 'considered critically endangered'],
          ['~9', 'living master glass engravers'],
        ],
        body: [
          'Thatching. Coopering. Drystone walling. Hand-cut glass. These are not hobbies - they are bodies of knowledge held in fewer than a dozen pairs of hands each. When those hands stop, the knowledge goes with them.',
          'Made With These Hands exists to put the tradition on the record and point readers toward the makers still taking apprentices. Every object enquiry goes back to the studio for a personal reply.',
        ],
        ctaLabel: 'Read the essay',
        ctaHref: '/?page=blog',
      },
      shop_cta: {
        eyebrow: '08 - Objects',
        title: 'A small,<br/><span className="italic">slow archive</span>.',
        dek: 'A rotating selection of handmade pieces and one-off collectors items, chosen by Hugh. Numbers are always small.',
        ctaLabel: 'Browse the collection',
        ctaHref: '/?page=shop',
      },
      shop_index: {
        eyebrow: 'Objects - product archive - maker shelves',
        title: 'A small, <span className="italic">slow archive</span>.',
        dek: 'Every object is connected to a maker, a craft discipline, and where possible a conversation with Hugh.',
      },
      blog_index: {
        eyebrow: 'Journal - field notes - essays',
        title: 'Notes from the <span className="italic">bench</span>.',
        dek: 'Essays, dispatches, and archive notes connecting makers, objects, and Field Recordings.',
      },
      podcast_index: {
        eyebrow: 'Field Recordings - Podcast archive',
        title: 'Every conversation, <span className="italic">on the record</span>.',
        dek: 'Hugh McNeill records makers in their workshops. Each episode connects back to the maker page, shelf, and craft category.',
        image: '/images/mwth-podcast-bench.jpg',
        imageAlt: 'Field recording setup on a craft workshop bench',
      },
      episode: {
        image: '/images/mwth-podcast-bench.jpg',
        imageAlt: 'Field recording setup at a maker bench - microphone, notes, tools, and window light',
      },
      hugh_page: {
        eyebrow: 'Portrait - A founder&rsquo;s story',
        title: 'The man who learned to cut glass before he learned to <span className="italic">drive</span>.',
        dek: 'Hugh McNeill has been at the cutting wheel for thirty-two years. His workshop on Canal Walk in Kilkenny is half studio, half archive - and, since 2022, half radio booth.',
        image: '/images/mwth-maker-portrait.jpg',
        imageAlt: 'Hugh at the wheel - full-bleed, warm window light, copper wheel spinning',
        imageCaption: 'Hugh McNeill in his workshop. Photo: Ronan Park, March 2026.',
        body: [
          'Hugh grew up in a narrow house in Dungarvan, where his father kept a pair of rotary cutters in a biscuit tin under the sink. He started turning pieces on a school bench at fourteen, and at seventeen walked into Waterford Crystal looking for an apprenticeship. They gave him one.',
          'The apprenticeship was five years long and almost silent. You learned by watching. You made the same cut ten thousand times before you were allowed to make the second.',
          'Waterford closed a division in 2008. Hugh took his tools and rented a room behind a bicycle shop on Canal Walk. Commissions came slowly, then steadily.',
          'In 2022, after recording a long conversation with a neighbouring ceramicist on a borrowed phone, Hugh started what became Field Recordings.',
          'Hugh accepts two commissions a year, and one apprentice every third year. The rest of his time goes to cutting his own work, keeping the shop narrow, and recording.',
        ],
        quote: 'I am not trying to save anything. I am trying to keep the company of people who make things, and put what they say on the record.',
        stats: [
          ['Established', '2008'],
          ['Address', 'Canal Walk, Kilkenny'],
          ['Apprenticeship', 'Waterford, 1994-99'],
          ['Commissions/yr', '2'],
          ['Podcast eps', '47 and counting'],
          ['Visitors', 'Thursdays, by arrangement'],
        ],
        timeline: [
          ['1971', 'Born', 'Dungarvan, Co. Waterford.'],
          ['1994', 'Apprenticeship', 'Waterford Crystal.'],
          ['2001', 'First commission', 'Cathedral window, Co. Down.'],
          ['2008', 'Own workshop', 'Canal Walk, Kilkenny.'],
          ['2015', 'Head of state', 'Commissioned tumbler set.'],
          ['2022', 'The podcast', 'Field Recordings begins.'],
        ],
      },
      commissions: {
        eyebrow: 'Commissions - Two a year - By correspondence',
        title: 'A piece, made for <span className="italic">one occasion</span>.',
        dek: 'Hugh accepts two private commissions each year. The work is slow, considered, and made entirely by hand at the Canal Walk workshop.',
        process: [
          ['I', 'Letter', 'You write to Hugh with the occasion, the recipient, and any constraints.'],
          ['II', 'Conversation', 'A call or workshop visit. Sketches by post within a fortnight.'],
          ['III', 'At the wheel', 'Cutting begins. You receive a photo or two as it progresses.'],
          ['IV', 'The piece', 'Hand-delivered or sent by post, signed, dated, and yours.'],
        ],
        pastWork: [
          ['2024', 'Embassy decanter set', 'A set of six, gifted by the Irish Embassy in Tokyo.'],
          ['2022', 'Cathedral window', 'Side-chapel rose, commissioned by the Diocese of Down.'],
          ['2019', 'Head of state', 'Engraved tumbler set for a state visit.'],
        ],
        types: [
          ['Decanter or set', 'From GBP 950 - 8-12 weeks'],
          ['Trophy or award', 'From GBP 1,400 - 10-14 weeks'],
          ['Architectural / window', 'From GBP 6,000 - 6-9 months'],
          ['Heirloom piece', 'POA - timeline by arrangement'],
          ['Something else', 'Write and we will talk'],
        ],
      },
      footer: {
        title: 'Made With These Hands',
        copyright: '2026 Made With These Hands - Canal Walk, Kilkenny, Ireland',
        legal: 'Privacy - Terms - Colophon',
        columns: [
          ['Explore', ['Craft', 'Blog', 'Podcast', 'Objects']],
          ['Studio', ['Hugh McNeill', 'Commissions', 'Workshops', 'Press']],
          ['Help', ['Contact', 'Enquiries', 'FAQ']],
          ['Follow', ['Instagram', 'YouTube', 'Spotify', 'Newsletter']],
        ],
      },
    },
  },
};

function MWTH_CRAFT_SLUG(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function MWTH_WITH_CRAFTS(data) {
  const next = {
    makers: Array.isArray(data.makers) ? data.makers : [],
    products: Array.isArray(data.products) ? data.products : [],
    episodes: Array.isArray(data.episodes) ? data.episodes : [],
    posts: Array.isArray(data.posts) && data.posts.length ? data.posts : MWTH_DATA.posts,
    site: MWTH_MERGE_SITE(data.site),
  };

  next.crafts = Array.from(new Set(next.products.map((p) => p.craft).concat(next.episodes.map((e) => e.craft))))
    .filter(Boolean)
    .map((name) => ({
      slug: MWTH_CRAFT_SLUG(name),
      name,
      products: next.products.filter((p) => p.craft === name),
      makers: next.makers.filter((m) => m.craft === name),
      episodes: next.episodes.filter((e) => e.craft === name),
    }));

  return next;
}

function MWTH_MERGE_SITE(site = {}) {
  const fallback = MWTH_DATA.site || { sections: {} };
  return {
    ...fallback,
    ...site,
    sections: {
      ...(fallback.sections || {}),
      ...((site && site.sections) || {}),
    },
  };
}

function MWTH_SECTION_VALUE(section, key, fallback) {
  return section && section[key] !== undefined && section[key] !== null && section[key] !== ''
    ? section[key]
    : fallback;
}

window.MWTH_SET_DATA = (data) => {
  window.MWTH_DATA = MWTH_WITH_CRAFTS(data);
  window.MWTH_SECTION = (key) => window.MWTH_DATA.site?.sections?.[key] || MWTH_DATA.site.sections[key] || {};
  window.MWTH_FIELD = (key, field, fallback = '') => MWTH_SECTION_VALUE(window.MWTH_SECTION(key), field, fallback);
  window.MWTH_LIST = (key, field, fallback = []) => {
    const value = window.MWTH_FIELD(key, field, fallback);
    return Array.isArray(value) ? value : fallback;
  };
  window.MWTH_BY_MAKER = (slug) => window.MWTH_DATA.makers.find((m) => m.slug === slug) || window.MWTH_DATA.makers[0];
  window.MWTH_BY_PRODUCT = (slug) => window.MWTH_DATA.products.find((p) => p.slug === slug) || window.MWTH_DATA.products[2] || window.MWTH_DATA.products[0];
  window.MWTH_BY_CRAFT = (slug) => window.MWTH_DATA.crafts.find((c) => c.slug === slug) || window.MWTH_DATA.crafts[0];
  window.MWTH_BY_POST = (slug) => window.MWTH_DATA.posts.find((p) => p.slug === slug) || window.MWTH_DATA.posts[0];
  window.MWTH_BY_EPISODE = (token) => window.MWTH_DATA.episodes.find((e) => e.slug === token || e.number === token || e.maker === token) || window.MWTH_DATA.episodes[0];
};

window.MWTH_SET_DATA(MWTH_DATA);

window.MWTH_LOAD_DIRECTUS = fetch('/api/mwth-data', { cache: 'no-store' })
  .then((response) => {
    if (!response.ok) throw new Error('Directus data request failed');
    return response.json();
  })
  .then((payload) => {
    if (payload.configured && payload.data) window.MWTH_SET_DATA(payload.data);
    return window.MWTH_DATA;
  })
  .catch((error) => {
    console.warn('Using local Made With These Hands data', error);
    return window.MWTH_DATA;
  });
