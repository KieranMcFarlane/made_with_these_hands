import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://madewiththesehands.ie'),
  title: {
    default: 'Made With These Hands',
    template: '%s | Made With These Hands',
  },
  description: 'A journal of heritage craft, makers, objects, podcast episodes, and workshop notes.',
  openGraph: {
    title: 'Made With These Hands',
    description: 'A journal of heritage craft, makers, objects, podcast episodes, and workshop notes.',
    type: 'website',
    images: ['/images/mwth-hero-glass-engraving.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Made With These Hands',
    description: 'A journal of heritage craft, makers, objects, podcast episodes, and workshop notes.',
    images: ['/images/mwth-hero-glass-engraving.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
