import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://foobork.github.io/fiction-prize-index/'),
  title: 'Mostly Fiction | Open Catalog of Major Literary Fiction Awards',
  description:
    'An open-access catalog and virtual bookshelf of world-class fiction honors. Discover 4,000+ prize-winning and shortlisted novels across 22 major awards from 1903 to 2026.',
  keywords: [
    'Mostly Fiction',
    'Fiction Prize Index',
    'Booker Prize',
    'Pulitzer Prize for Fiction',
    'National Book Award',
    'Women\'s Prize for Fiction',
    'International Booker Prize',
    'Prix Goncourt',
    'Hugo Award',
    'Nobel Prize Literature',
    'Goldsmiths Prize',
    'Literary Awards',
  ],
  authors: [
    { name: 'foobork', url: 'https://github.com/foobork' },
    { name: 'midlevels', url: 'https://github.com/midlevels' },
  ],
  openGraph: {
    title: 'Mostly Fiction | Open Literary Prize Index & Virtual Bookshelf',
    description:
      'Explore 4,000+ prize-winning novels across 22 major honors: Booker, Pulitzer, Nobel, Goncourt, Hugo, and more. Browse timelines, author overlap, and the interactive 3D bookshelf.',
    url: 'https://foobork.github.io/fiction-prize-index/',
    siteName: 'Mostly Fiction',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mostly Fiction — The Open Literary Prize Index & Virtual Bookshelf',
        type: 'image/jpeg',
      },
      {
        url: 'og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mostly Fiction — The Open Literary Prize Index & Virtual Bookshelf',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mostly Fiction | Major Literary Fiction Prize Index',
    description:
      'Explore 4,000+ prize-winning novels across 22 major literary honors (1903–2026). Virtual bookshelf, author dossiers, and reading lists.',
    images: ['og-image.jpg'],
    creator: '@foobork',
  },
  icons: {
    icon: [
      { url: 'favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: 'moose-192.png', sizes: '192x192', type: 'image/png' },
      { url: 'moose.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: 'moose-192.png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-parchment-50 text-parchment-950 dark:bg-ink-950 dark:text-parchment-100 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
