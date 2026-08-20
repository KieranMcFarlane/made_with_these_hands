import fs from 'node:fs/promises';
import path from 'node:path';
import PodcastPlayerBlock from '../../../podcast-player-block';
import SlideshowBlock from '../../../slideshow-block';

export const dynamic = 'force-dynamic';

async function readProposal(id) {
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return null;
  const filename = path.join(process.cwd(), 'component-system', 'proposals', id, 'proposal.json');
  try {
    return JSON.parse(await fs.readFile(filename, 'utf8'));
  } catch {
    return null;
  }
}

function SlideshowPreview() {
  return (
    <SlideshowBlock
      item={{
        eyebrow: 'Component proposal / slideshow',
        title: 'Workshop images, in sequence.',
        dek: 'A live preview using the approved shadcn Carousel and Button primitives.',
        variant: 'thumbnail-rail',
        show_captions: true,
        show_counter: true,
        autoplay: false,
        slides: [
          { image: '/images/mwth-hero-glass-engraving.jpg', image_alt: 'Glass engraving in the workshop', caption: 'At the engraving wheel', credit: 'Made With These Hands' },
          { image: '/images/mwth-maker-portrait.jpg', image_alt: 'Maker portrait in a workshop', caption: 'The maker in their own space', credit: 'Made With These Hands' },
          { image: '/images/mwth-podcast-bench.jpg', image_alt: 'Field recording equipment on a workshop bench', caption: 'Recording beside the work', credit: 'Made With These Hands' },
        ],
      }}
    />
  );
}

function PodcastPlayerPreview() {
  return (
    <PodcastPlayerBlock
      content={{
        products: [
          {
            slug: 'lobster-pot-small',
            name: 'Lobster pot, small',
            craft: 'Basketry',
            price: 'GBP 220',
          },
        ],
      }}
      item={{
        eyebrow: 'Tenant-safe proposal / Media Chrome',
        title: 'A branded player, not an embed.',
        dek: 'The CMS stores only episode data and links. Media Chrome supplies trusted open-source playback controls.',
        variant: 'feature',
        episode: 'podbean-navah-langmeyer',
        episode_title: 'Hugh McNeill of Made With These Hands interviews Navah Langmeyer',
        guest: 'Navah Langmeyer',
        audio_url: 'https://mcdn.podbean.com/mf/web/i7xb5qh4kg3t4ztz/riverside_magic_episode_02_hugh_mcneill_s_stud87wfy.mp3',
        duration: '36 min',
        published_date: 'Jul 27, 2026',
        transcript: 'Transcript content can be stored as plain text and edited through Directus MCP.',
        podbean_url: 'https://hughmn.podbean.com/',
        related_products: ['lobster-pot-small'],
      }}
    />
  );
}

export default async function ComponentProposalPreview({ params }) {
  const { id } = await params;
  const proposal = await readProposal(id);

  if (!proposal) {
    return (
      <main style={{ minHeight: '100vh', padding: '8vw', background: 'var(--paper)', color: 'var(--ink)' }}>
        <p>Component proposal not found.</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)' }}>
      <header style={{ padding: '48px clamp(24px, 6vw, 88px)', borderBottom: '1px solid var(--rule)' }}>
        <p style={{ fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Proposal / {proposal.status}</p>
        <h1 style={{ maxWidth: '16ch', margin: '12px 0', fontFamily: 'var(--serif)', fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 400 }}>
          {proposal.component_key}
        </h1>
        <p>{proposal.request}</p>
      </header>
      {proposal.component_key === 'block_slideshow' ? <SlideshowPreview /> : proposal.component_key === 'block_podcast_player' ? <PodcastPlayerPreview /> : (
        <section style={{ padding: '64px clamp(24px, 6vw, 88px)' }}>
          <h2>Declarative proposal</h2>
          <pre style={{ overflow: 'auto', whiteSpace: 'pre-wrap' }}>{JSON.stringify(proposal.proposal || proposal, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}
