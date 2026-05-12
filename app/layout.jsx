import './globals.css';

export const metadata = {
  title: 'Made With These Hands',
  description: 'A journal of heritage craft, makers, stories, podcast episodes, and slow commerce.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
