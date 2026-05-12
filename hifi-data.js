// Curated Unsplash photo URLs + product data.
// Photos chosen for: workshops, hands at work, glass, ceramics, wood, textile, leather, basketry.

const U = (id, w = 1600) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

const PHOTOS = {
  // Hero / portraits
  heroPortrait:    U('photo-1565193566173-7a0ee3dbe261'),     // hands working clay
  heroFullbleed:   U('photo-1556760544-74068565f05c'),         // glass cup / hands
  hughPortrait:    U('photo-1622030411594-c826a474a14d'),     // older man portrait
  hughHands:       U('photo-1621905251918-48416bd8575a'),     // hands working
  hughWorkshop:    U('photo-1611532736597-de2d4265fba3'),     // workshop
  copperWheel:     U('photo-1582738411706-bfc8e691d1c2'),     // tools detail
  hughDetail:      U('photo-1605346576608-92f1346ee05e'),     // hands close
  // Crafts
  glass:           U('photo-1547333590-47fae5f58d21'),         // glassware
  jewellery:       U('photo-1606760227091-3dd870d97f1d'),     // jewellery
  ceramics:        U('photo-1565193566173-7a0ee3dbe261'),     // clay
  woodwork:        U('photo-1567538096630-e0c55bd6374c'),     // wood
  collectors:      U('photo-1518533954129-7774297db60a'),     // object still life
  textiles:        U('photo-1589384267710-7a25bc24ab28'),     // linen / fabric
  basketry:        U('photo-1605883705077-8d3d3cebe78c'),     // basket
  leather:         U('photo-1591561954557-26941169b49e'),     // leather
  // Artist
  saoirsePortrait: U('photo-1573497019418-b400bb3ab074'),     // woman portrait, natural
  saoirseHands:    U('photo-1612780291006-8b6135018d20'),     // weaving
  // Méabh
  meabhBench:      U('photo-1611532736417-72c3c8b9d96a'),     // workshop
  meabhDetail:     U('photo-1601054819093-1e08e0e8d4a4'),     // wood detail
  // Podcast
  podcastCover:    U('photo-1590602847861-f357a9332bbc'),     // moody bw
  // Shop products
  prodTumbler:     U('photo-1547333590-47fae5f58d21'),
  prodBasket:      U('photo-1605883705077-8d3d3cebe78c'),
  prodJug:         U('photo-1610701596007-11502861dcfa'),     // jug
  prodSpoon:       U('photo-1602006052830-3e8c3f0eba0e'),     // wooden spoon
  prodCuff:        U('photo-1611652022419-a9419f74343d'),     // silver
  prodThrow:       U('photo-1582738411706-bfc8e691d1c2'),     // linen folded
  prodDecanter:    U('photo-1481833761820-0509d3217039'),     // decanter
  prodGathering:   U('photo-1610450949065-1f2841536c84'),     // basket 2
  prodTeaBowl:     U('photo-1493106641515-6b5631de4bb9'),     // porcelain
  prodAshBowl:     U('photo-1567538096630-e0c55bd6374c'),     // bowl
  prodRing:        U('photo-1605100804763-247f67b3557e'),     // ring
  prodSatchel:     U('photo-1591561954557-26941169b49e'),     // leather bag
  // Sections
  workshopWide:    U('photo-1518709268805-4e9042af2176'),
  paperTexture:    U('photo-1524634126442-357e0eac3c14'),
  benchHands:      U('photo-1611532736417-72c3c8b9d96a'),
};

const SHOP = [
  ['Lead-crystal tumbler', 'Hugh McNeill',    'Glass',     180, 'Kilkenny',     PHOTOS.prodTumbler,  '12', 4],
  ['Lobster pot, small',   'Saoirse Doolan',  'Basketry',  220, 'Co. Clare',    PHOTOS.prodBasket,   '12', 4],
  ['Stoneware jug',        'Pádraig Brennan', 'Ceramics',   95, 'West Cork',    PHOTOS.prodJug,      '24', 9],
  ['Bog-oak spoon',        'Méabh Ó Riada',   'Woodwork',   42, 'Co. Galway',   PHOTOS.prodSpoon,    '30', 12],
  ['Silver cuff',          'Nuala Finn',      'Jewellery', 240, 'Dublin',       PHOTOS.prodCuff,     '8',  3],
  ['Linen throw, natural', 'Róisín Mac',      'Textiles',  165, 'Co. Down',     PHOTOS.prodThrow,    '20', 7],
  ['Engraved decanter',    'Hugh McNeill',    'Glass',     420, 'Kilkenny',     PHOTOS.prodDecanter, '6',  2],
  ['Gathering basket',     'Saoirse Doolan',  'Basketry',  165, 'Co. Clare',    PHOTOS.prodGathering,'12', 5],
  ['Porcelain tea bowl',   'Yuki Halpin',     'Ceramics',   75, 'Wicklow',      PHOTOS.prodTeaBowl,  '24', 11],
  ['Turned ash bowl',      'Seán Devlin',     'Woodwork',   88, 'Co. Mayo',     PHOTOS.prodAshBowl,  '18', 6],
  ['Gold signet ring',     'Nuala Finn',      'Jewellery', 640, 'Dublin',       PHOTOS.prodRing,     '6',  2],
  ['Waxed canvas satchel', 'Leo Harrington',  'Leather',   320, 'Cork City',    PHOTOS.prodSatchel,  '15', 5],
];

const CRAFTS = [
  ['I',   'Glass Engraving', '14 makers', 'Tumblers, carafes, decanters cut at the wheel.',  PHOTOS.glass],
  ['II',  'Jewellery',       '22 makers', 'Silver, gold, enamel. Heirloom-minded.',          PHOTOS.jewellery],
  ['III', 'Ceramics',        '31 makers', 'Stoneware and porcelain, thrown and hand-built.', PHOTOS.ceramics],
  ['IV',  'Woodwork',        '18 makers', 'Green wood, turned bowls, bog-oak spoons.',       PHOTOS.woodwork],
  ['V',   'Collectors',      '9 pieces',  'One-off and numbered editions.',                  PHOTOS.collectors],
  ['VI',  'Textiles',        '12 makers', 'Linen, wool, naturally dyed.',                    PHOTOS.textiles],
];

const EPISODES = [
  ['047', 'Méabh Ó Riada',    'Bog oak, dowsing, and the grain of 4,000 years', '54 min', PHOTOS.meabhBench],
  ['046', 'Tomás Kelly',      'Silversmithing after the crash',                 '48 min', PHOTOS.prodCuff],
  ['045', 'Nuala Finn',       'What linen remembers',                           '62 min', PHOTOS.prodThrow],
  ['044', 'Dáithí Ó Conchúir','Thatching the last reed-roofs of Donegal',       '57 min', PHOTOS.workshopWide],
];

window.PHOTOS = PHOTOS;
window.SHOP = SHOP;
window.CRAFTS = CRAFTS;
window.EPISODES = EPISODES;
