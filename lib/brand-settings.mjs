export const BRAND_TENANT = 'made-with-these-hands';

export const DEFAULT_BRAND_RECORDS = [
  {
    setting_key: 'identity',
    value: {
      name: 'Made With These Hands',
      descriptor: 'A journal of heritage craft',
      essence: 'The hand that makes, remembers.',
      story:
        'Made With These Hands keeps company with people who make things slowly and well. It records the tools, places, gestures, and working knowledge behind an object, then connects that story back to the maker.',
      promise: 'Keep the process visible, the maker named, and the next step personal.',
      principles: ['Human before polished', 'Process before product', 'Specific before sweeping', 'Quiet before corporate'],
    },
  },
  {
    setting_key: 'palette',
    value: {
      active: 'cream',
      palettes: {
        cream: {
          name: 'Workshop paper',
          description: 'Warm paper, charcoal ink, and a restrained blue-black accent.',
          tokens: {
            paper: '#f4efe6',
            paper_2: '#ece6d9',
            paper_3: '#e3ddcf',
            ink: '#1b1918',
            ink_80: '#2e2a27',
            ink_60: '#5a534d',
            ink_40: '#8a827a',
            ink_20: '#c6beb2',
            rule: '#cfc6b5',
            accent: '#2a3f4a',
            white: '#faf6ec',
          },
        },
        stone: {
          name: 'Kilkenny stone',
          description: 'Cool mineral neutrals with a blue-black workshop accent.',
          tokens: {
            paper: '#edeae4',
            paper_2: '#e2ddd5',
            paper_3: '#d6d0c6',
            ink: '#17171a',
            ink_80: '#2a2a2e',
            ink_60: '#55565a',
            ink_40: '#8a8b8f',
            ink_20: '#c4c4c8',
            rule: '#c4c1ba',
            accent: '#2a3f4a',
            white: '#f7f4ef',
          },
        },
        ivory: {
          name: 'Archive ivory',
          description: 'A brighter archival sheet with deep brown ink and sealing-wax red.',
          tokens: {
            paper: '#f7f0df',
            paper_2: '#efe7d2',
            paper_3: '#e7dec3',
            ink: '#3a1f12',
            ink_80: '#4d2b1c',
            ink_60: '#6d5040',
            ink_40: '#9a8773',
            ink_20: '#cdbfa9',
            rule: '#cfbe9e',
            accent: '#7a2316',
            white: '#fdf8e9',
          },
        },
      },
    },
  },
  {
    setting_key: 'typography',
    value: {
      display: {
        family: 'Cormorant Garamond',
        stack: '"Cormorant Garamond", "EB Garamond", Georgia, "Times New Roman", serif',
        role: 'Editorial headlines, pull quotes, and maker names',
      },
      body: {
        family: 'Inter Tight',
        stack: '"Inter Tight", "Helvetica Neue", Helvetica, Arial, sans-serif',
        role: 'Reading copy, navigation, forms, and practical information',
      },
      utility: {
        family: 'JetBrains Mono',
        stack: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        role: 'Issue numbers, dates, labels, captions, and archive metadata',
      },
      rules: ['Use sentence case', 'Keep headlines short enough to breathe', 'Use italics as a human aside, not decoration'],
    },
  },
  {
    setting_key: 'voice',
    value: {
      character: ['Warm', 'Tactile', 'Observant', 'Practical', 'Trustworthy'],
      sounds_like: [
        'A knowledgeable person speaking beside the workbench',
        'Specific materials, places, tools, and gestures',
        'Quiet confidence without sales pressure',
      ],
      avoid: ['Corporate superlatives', 'Heritage nostalgia without evidence', 'Guaranteed claims', 'Checkout-first language'],
      example: 'A rotating selection of handmade pieces, chosen slowly and answered for personally.',
    },
  },
  {
    setting_key: 'imagery',
    value: {
      direction: 'Document the work rather than staging a lifestyle.',
      subjects: ['Hands in process', 'Tools with visible wear', 'Maker portraits in their own space', 'Finished objects with material detail'],
      light: 'Natural or practical workshop light, with shadow retained.',
      composition: 'Close, patient, and slightly imperfect. Leave room for captions and editorial crops.',
      avoid: ['Generic stock craft imagery', 'Over-clean white studio scenes', 'Heavy colour grading', 'Uncredited work'],
    },
  },
  {
    setting_key: 'usage',
    value: {
      accent_rule: 'The active accent is a mark, not a wash. Use it for small signals, rules, numerals, and moments of emphasis.',
      surface_rule: 'Paper tones carry the page. Dark ink sections should feel like deliberate plates in a printed issue.',
      interaction_rule: 'Buttons should feel labelled and useful, not glossy or oversized.',
      accessibility: ['Keep body text on paper at strong contrast', 'Never communicate state by accent colour alone', 'Preserve visible focus states'],
    },
  },
  {
    setting_key: 'component_contract',
    value: {
      version: '1.1.0',
      spacing: {
        base_unit_px: 4,
        scale_px: {
          space_0: 0,
          space_1: 4,
          space_2: 8,
          space_3: 12,
          space_4: 16,
          space_5: 24,
          space_6: 32,
          space_7: 48,
          space_8: 64,
          space_9: 96,
          space_10: 128,
        },
        density_choices: ['compact', 'standard', 'generous'],
        density_tokens: {
          compact: { inline: 'space_5', block: 'space_8', gap: 'space_4' },
          standard: { inline: 'space_8', block: 'space_9', gap: 'space_6' },
          generous: { inline: 'space_9', block: 'space_10', gap: 'space_7' },
        },
        section_inline: 'clamp(24px, 6vw, 88px)',
        section_block: 'clamp(64px, 9vw, 132px)',
        control_target_minimum: '44px',
      },
      composition: {
        directus_spacing_field: 'spacing',
        raw_css_in_cms: false,
        raw_numeric_spacing_in_cms: false,
        approved_grids_only: true,
        nested_cards: false,
      },
      grids: ['single-column', 'editorial-split', 'two-column', 'three-column', 'archive-row'],
      image_ratios: ['4 / 3', '3 / 2', '16 / 10', '16 / 8'],
      motion: {
        durations_ms: [180, 300, 600],
        autoplay_minimum_interval_ms: 4000,
        reduced_motion_required: true,
      },
      buttons: ['primaryAction', 'secondaryAction', 'carouselControl'],
      component_sources: {
        preferred: 'shadcn',
        fallback: 'bespoke-after-documented-gap',
        base: 'radix',
      },
      mobile: {
        primary_breakpoint_px: 900,
        compact_breakpoint_px: 640,
        horizontal_overflow: 'Only controlled rails may scroll horizontally.',
      },
      accessibility: {
        visible_focus: true,
        keyboard_operable: true,
        alt_text_required: true,
        colour_alone_forbidden: true,
      },
      nesting: {
        page_slots: ['main', 'before-content', 'after-content', 'related-content'],
        executable_content_in_cms: false,
      },
      performance: {
        maximum_slides: 12,
        stable_media_dimensions: true,
        responsive_images: true,
      },
    },
  },
];

export function brandFromRecords(records = []) {
  const brand = Object.fromEntries(
    DEFAULT_BRAND_RECORDS.map((record) => [record.setting_key, structuredClone(record.value)]),
  );

  for (const record of records) {
    if (record?.setting_key && record.value && typeof record.value === 'object') {
      brand[record.setting_key] = record.value;
    }
  }

  return brand;
}

export function activePalette(brand) {
  const palette = brand?.palette;
  const key = palette?.active || 'cream';
  return palette?.palettes?.[key] || DEFAULT_BRAND_RECORDS[1].value.palettes.cream;
}

export function brandCssVariables(brand) {
  const tokens = activePalette(brand).tokens;
  const defaultContract = DEFAULT_BRAND_RECORDS.find(({ setting_key }) => setting_key === 'component_contract')?.value;
  const variables = Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [`--${key.replaceAll('_', '-')}`, value]),
  );

  if (brand?.typography?.display?.stack) variables['--serif'] = brand.typography.display.stack;
  if (brand?.typography?.body?.stack) variables['--sans'] = brand.typography.body.stack;
  if (brand?.typography?.utility?.stack) variables['--mono'] = brand.typography.utility.stack;

  const spacingScale = brand?.component_contract?.spacing?.scale_px || defaultContract?.spacing?.scale_px || {};
  for (const [key, value] of Object.entries(spacingScale)) {
    if (Number.isFinite(value)) variables[`--${key.replaceAll('_', '-')}`] = `${value}px`;
  }

  return variables;
}
