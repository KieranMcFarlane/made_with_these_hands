const directusUrl = process.env.DIRECTUS_URL || 'http://127.0.0.1:8055';
const token = process.env.DIRECTUS_ADMIN_TOKEN;
const tenant = 'made-with-these-hands';

if (!token) {
  console.error('DIRECTUS_ADMIN_TOKEN is required.');
  process.exit(1);
}

const makers = [
  {
    slug: 'saoirse-doolan',
    name: 'Saoirse Doolan',
    craft: 'Basketry',
    place: 'Co. Clare',
    established: '2009',
    dek: 'Basketmaker in Co. Clare. Coppices her own willow. Holds work in the National Museum of Ireland.',
    practice_title: 'Winter willow, cut by hand, woven while still green.',
    practice: [
      'Saoirse works a small stand of willow near the Atlantic coast, cutting in winter when the sap is low and sorting every rod by hand before it enters the shed.',
      'Her baskets sit between field utility and collection object: lobster pots, gathering baskets, trugs, and woven studies that preserve patterns she learned from older Clare makers.',
    ],
    hero_label: 'Saoirse Doolan in the willow shed, Co. Clare',
  },
  {
    slug: 'hugh-mcneill',
    name: 'Hugh McNeill',
    craft: 'Glass engraving',
    place: 'Kilkenny',
    established: '2008',
    dek: 'Glass cutter and engraver in Kilkenny. Founder of Made With These Hands and host of Field Recordings.',
    practice_title: 'Cut glass, oral archive, and the discipline of the wheel.',
    practice: [
      'Hugh works from Canal Walk in Kilkenny, where the cutting wheel still runs beside the recording desk.',
      'He chooses the studio objects, records the makers, and keeps the archive narrow enough that every piece can be held and known.',
    ],
    hero_label: 'Hugh McNeill at the copper wheel, Kilkenny',
  },
  {
    slug: 'meabh-o-riada',
    name: 'Méabh Ó Riada',
    craft: 'Woodwork',
    place: 'Co. Galway',
    established: '2003',
    dek: 'Bog-oak woodworker in Carraroe. Works with timber held underground since the Bronze Age.',
    practice_title: 'Ancient oak, hand tools, and material that refuses haste.',
    practice: [
      'Méabh salvages bog oak from West Galway and works it with hand tools because the grain will not tolerate speed.',
      'Her spoons, bowls, and boxes carry the colour of peat and the uncertainty of wood pulled from another age.',
    ],
    hero_label: 'Méabh Ó Riada with bog oak in Carraroe',
  },
  {
    slug: 'tomas-kelly',
    name: 'Tomás Kelly',
    craft: 'Silversmithing',
    place: 'Dublin',
    established: '1998',
    dek: 'Dublin silversmith making domestic silver, repairs, and small ceremonial commissions.',
    practice_title: 'Silver after the crash, repaired rather than replaced.',
    practice: [
      'Tomás is known for repair work and quiet domestic silver: spoons, cups, salt cellars, and small heirloom objects.',
      'His archive records how families kept objects moving through economic collapse by repairing them at the bench.',
    ],
    hero_label: 'Tomás Kelly polishing silver at the bench',
  },
  {
    slug: 'nuala-finn',
    name: 'Nuala Finn',
    craft: 'Jewellery',
    place: 'Dublin',
    established: '2012',
    dek: 'Jeweller and textile researcher in Dublin, working across silver, linen memory, and small heirlooms.',
    practice_title: 'Objects worn close to the body, and cloth that remembers.',
    practice: [
      'Nuala makes jewellery with textile references: cuffs, signets, pins, and small works that hold domestic memory.',
      'Her conversation with Hugh traces how linen, metal, and family stories become one object.',
    ],
    hero_label: 'Nuala Finn laying out linen and silver forms',
  },
];

const products = [
  { slug: 'lead-crystal-tumbler', name: 'Lead-crystal tumbler', maker: 'hugh-mcneill', craft: 'Glass engraving', price: '£180', place: 'Kilkenny', meta: 'Cut glass · signed · edition of 12' },
  { slug: 'engraved-decanter', name: 'Engraved decanter', maker: 'hugh-mcneill', craft: 'Glass engraving', price: '£420', place: 'Kilkenny', meta: 'Cut glass · commission pattern' },
  { slug: 'lobster-pot-small', name: 'Lobster pot, small', maker: 'saoirse-doolan', craft: 'Basketry', price: '£220', place: 'Co. Clare', meta: 'Working basket · edition of 12' },
  { slug: 'gathering-basket', name: 'Gathering basket', maker: 'saoirse-doolan', craft: 'Basketry', price: '£165', place: 'Co. Clare', meta: 'Hedgerow willow · signed underside' },
  { slug: 'herb-trug', name: 'Herb trug', maker: 'saoirse-doolan', craft: 'Basketry', price: '£95', place: 'Co. Clare', meta: 'Kitchen piece · made to order' },
  { slug: 'bog-oak-spoon', name: 'Bog-oak spoon', maker: 'meabh-o-riada', craft: 'Woodwork', price: '£42', place: 'Co. Galway', meta: 'Bog oak · hand finished' },
  { slug: 'silver-cuff', name: 'Silver cuff', maker: 'nuala-finn', craft: 'Jewellery', price: '£240', place: 'Dublin', meta: 'Silver · linen study' },
];

const episodes = [
  { number: '047', maker: 'meabh-o-riada', guest: 'Méabh Ó Riada', title: 'Bog oak, dowsing, and the grain of 4,000 years', craft: 'Woodwork', place: 'Connemara', duration: '54 min', date: '2026-04-12' },
  { number: '046', maker: 'tomas-kelly', guest: 'Tomás Kelly', title: 'Silversmithing after the crash', craft: 'Silversmithing', place: 'Dublin', duration: '48 min', date: '2026-03-29' },
  { number: '045', maker: 'nuala-finn', guest: 'Nuala Finn', title: 'What linen remembers', craft: 'Jewellery', place: 'Dublin', duration: '1h 02', date: '2026-03-15' },
  { number: '043', maker: 'saoirse-doolan', guest: 'Saoirse Doolan', title: 'Winter willow and the working basket', craft: 'Basketry', place: 'Co. Clare', duration: '49 min', date: '2026-02-16' },
  { number: '042', maker: 'hugh-mcneill', guest: 'Hugh McNeill', title: 'Thirty years at the wheel', craft: 'Glass engraving', place: 'Kilkenny', duration: '44 min', date: '2026-02-02' },
];

const posts = [
  {
    slug: 'why-we-record-the-tools',
    title: 'Why we record the tools',
    dek: 'A field note from Hugh on sound, memory, and the small noises that carry a craft.',
    date: '2026-04-20',
    author: 'Hugh McNeill',
    category: 'Field note',
    body: [
      'A tool tells you what the maker has learned to stop forcing.',
      'Field Recordings began because photographs were not enough.',
    ],
  },
  {
    slug: 'the-object-archive',
    title: 'The object archive is not a shopfront',
    dek: 'How the listed objects connect makers, podcast episodes, and personal correspondence.',
    date: '2026-04-08',
    author: 'Hugh McNeill',
    category: 'Archive',
    body: [
      'The objects listed here are not a catalogue in the usual sense.',
      'That is why enquiries come to the studio rather than a checkout.',
    ],
  },
];

const siteSections = [
  {
    key: 'masthead',
    label: 'Masthead',
    eyebrow: 'Vol. I - No. 07',
    title: 'Made With These Hands',
    dek: 'A journal of heritage craft',
    meta: 'Kilkenny - April 2026',
  },
  {
    key: 'hero',
    label: 'Homepage hero',
    eyebrow: 'The Opening - Feature 01',
    title: 'The hand that<br/>makes, <span className="italic">remembers</span>.',
    dek: 'A journal of craftspeople, heritage skills, and the quiet discipline of making things by hand. Told from the workshop floor, in their own words.',
    image_alt: "Hugh's hands engraving a lead-crystal tumbler in the Kilkenny workshop",
    cta_label: 'Explore Craft',
    cta_href: '#craft',
    secondary_cta_label: 'Listen to the Podcast',
    secondary_cta_href: '/?page=podcasts',
    meta: 'Glass in Kilkenny - Stoneware from West Cork - The last bookbinder in Dublin - A commission for a head of state.',
  },
  {
    key: 'hero_b',
    label: 'Alternate homepage hero',
    eyebrow: 'Field Notes - Vol. I',
    title: 'Stories from the bench, the kiln,<br/>and the cutting wheel.',
    dek: 'Thirty years at the wheel. A thousand makers on the record. This is the work of hands, kept in writing.',
    image_alt: 'Full-bleed cover - hands cutting an engraved lead-crystal tumbler, raking side light',
  },
  {
    key: 'mission',
    label: 'Why We Publish',
    title: 'In a world of <span className="italic">finished objects</span>, the process has gone missing.',
    body: [
      'Mass production gave us abundance and took something quieter in return - the mark of a person. A handmade object carries a memory that a machine-made one cannot.',
      'Made With These Hands is a record of the people who still stand at a bench. Their tools, their mistakes, their twelve-thousandth try. We publish, we listen, we keep the craft on paper.',
    ],
  },
  {
    key: 'craft_index',
    label: 'The Index',
    title: 'Disciplines in <span className="italic">this issue</span>.',
  },
  {
    key: 'founder_portrait',
    label: 'Portrait of the Founder',
    eyebrow: 'Hugh McNeill - Glass cutter & engraver - Kilkenny',
    title: 'Thirty years<br/>at the <span className="italic">wheel</span>.',
    dek: 'Apprenticed in Waterford at seventeen. Commissioned for cathedrals, heads of state, and a president desk. Today the workshop is still open on Canal Walk, the copper wheel still spinning, and Hugh records the makers who come through the door.',
    image_alt: 'Hugh McNeill - half-lit, workshop, 3/4 portrait, shirt sleeves rolled',
    quote: 'I learned to cut glass before I learned to drive. The wheel teaches you to slow down - you cannot argue with it.',
    cta_label: 'Read the full story',
    cta_href: '/?page=hugh',
  },
  {
    key: 'podcast_home',
    label: 'Homepage podcast',
    title: 'Conversations with the people who still <span className="italic">make things</span>.',
    dek: 'Long-form interviews, recorded in workshops, kilns, and kitchens across Ireland and beyond. New episode every fortnight.',
    image_alt: 'Field recording setup on a craft workshop bench',
    extra: {
      links: ['Apple', 'Spotify', 'Overcast', 'RSS'],
    },
  },
  {
    key: 'artist_feature',
    label: 'Artist of the Week',
    quote: 'You cut the willow when the leaves are gone and the sap is low. Everything waits for winter.',
    cta_label: 'Explore Saoirse work',
    extra: {
      makerSlug: 'saoirse-doolan',
    },
  },
  {
    key: 'essay',
    label: 'An Essay',
    title: 'Sixty-three heritage crafts in Ireland are at risk of disappearing in a <span className="italic">generation</span>.',
    body: [
      'Thatching. Coopering. Drystone walling. Hand-cut glass. These are not hobbies - they are bodies of knowledge held in fewer than a dozen pairs of hands each. When those hands stop, the knowledge goes with them.',
      'Made With These Hands exists to put the tradition on the record and point readers toward the makers still taking apprentices. Every object enquiry goes back to the studio for a personal reply.',
    ],
    cta_label: 'Read the essay',
    cta_href: '/?page=blog',
    extra: {
      metrics: [
        ['63', 'crafts at risk of being lost'],
        ['11', 'considered critically endangered'],
        ['~9', 'living master glass engravers'],
      ],
    },
  },
  {
    key: 'shop_cta',
    label: 'Objects CTA',
    eyebrow: '08 - Objects',
    title: 'A small,<br/><span className="italic">slow archive</span>.',
    dek: 'A rotating selection of handmade pieces and one-off collectors items, chosen by Hugh. Numbers are always small.',
    cta_label: 'Browse the collection',
    cta_href: '/?page=shop',
  },
  {
    key: 'shop_index',
    label: 'Objects page header',
    eyebrow: 'Objects - product archive - maker shelves',
    title: 'A small, <span className="italic">slow archive</span>.',
    dek: 'Every object is connected to a maker, a craft discipline, and where possible a conversation with Hugh.',
  },
  {
    key: 'blog_index',
    label: 'Journal page header',
    eyebrow: 'Journal - field notes - essays',
    title: 'Notes from the <span className="italic">bench</span>.',
    dek: 'Essays, dispatches, and archive notes connecting makers, objects, and Field Recordings.',
  },
  {
    key: 'podcast_index',
    label: 'Podcast page header',
    eyebrow: 'Field Recordings - Podcast archive',
    title: 'Every conversation, <span className="italic">on the record</span>.',
    dek: 'Hugh McNeill records makers in their workshops. Each episode connects back to the maker page, shelf, and craft category.',
    image_alt: 'Field recording setup on a craft workshop bench',
  },
  {
    key: 'episode',
    label: 'Episode shared assets',
    image_alt: 'Field recording setup at a maker bench - microphone, notes, tools, and window light',
  },
  {
    key: 'hugh_page',
    label: 'Hugh story page',
    eyebrow: 'Portrait - A founder story',
    title: 'The man who learned to cut glass before he learned to <span className="italic">drive</span>.',
    dek: 'Hugh McNeill has been at the cutting wheel for thirty-two years. His workshop on Canal Walk in Kilkenny is half studio, half archive - and, since 2022, half radio booth.',
    image_alt: 'Hugh at the wheel - full-bleed, warm window light, copper wheel spinning',
    image_caption: 'Hugh McNeill in his workshop. Photo: Ronan Park, March 2026.',
    body: [
      'Hugh grew up in a narrow house in Dungarvan, where his father kept a pair of rotary cutters in a biscuit tin under the sink. He started turning pieces on a school bench at fourteen, and at seventeen walked into Waterford Crystal looking for an apprenticeship. They gave him one.',
      'The apprenticeship was five years long and almost silent. You learned by watching. You made the same cut ten thousand times before you were allowed to make the second.',
      'Waterford closed a division in 2008. Hugh took his tools and rented a room behind a bicycle shop on Canal Walk. Commissions came slowly, then steadily.',
      'In 2022, after recording a long conversation with a neighbouring ceramicist on a borrowed phone, Hugh started what became Field Recordings.',
      'Hugh accepts two commissions a year, and one apprentice every third year. The rest of his time goes to cutting his own work, keeping the shop narrow, and recording.',
    ],
    quote: 'I am not trying to save anything. I am trying to keep the company of people who make things, and put what they say on the record.',
    extra: {
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
  },
  {
    key: 'commissions',
    label: 'Commissions page',
    eyebrow: 'Commissions - Two a year - By correspondence',
    title: 'A piece, made for <span className="italic">one occasion</span>.',
    dek: 'Hugh accepts two private commissions each year. The work is slow, considered, and made entirely by hand at the Canal Walk workshop.',
    extra: {
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
  },
  {
    key: 'footer',
    label: 'Footer',
    title: 'Made With These Hands',
    extra: {
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
];

async function request(path, options = {}) {
  const response = await fetch(`${directusUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = body?.errors?.[0]?.message || body?.message || response.statusText;
    throw new Error(`${options.method || 'GET'} ${path}: ${message}`);
  }
  return body;
}

async function itemExists(collection, field, value) {
  const query = new URLSearchParams({
    filter: JSON.stringify({
      _and: [
        { tenant: { _eq: tenant } },
        { [field]: { _eq: value } },
      ],
    }),
    limit: '1',
  });
  const result = await request(`/items/${collection}?${query}`);
  return result.data[0] || null;
}

async function ensureItem(collection, field, item) {
  const existing = await itemExists(collection, field, item[field]);
  if (existing) {
    console.log(`item exists: ${collection}.${item[field]}`);
    return;
  }
  await request(`/items/${collection}`, {
    method: 'POST',
    body: JSON.stringify({
      tenant,
      status: 'published',
      enquiry_enabled: true,
      ...item,
    }),
  });
  console.log(`created item: ${collection}.${item[field]}`);
}

async function main() {
  for (const maker of makers) await ensureItem('makers', 'slug', maker);
  for (const product of products) await ensureItem('products', 'slug', product);
  for (const episode of episodes) await ensureItem('episodes', 'number', episode);
  for (const post of posts) await ensureItem('posts', 'slug', post);
  for (const section of siteSections) await ensureItem('site_sections', 'key', section);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
