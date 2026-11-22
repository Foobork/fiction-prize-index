import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Mostly Fiction | Open Catalog of Major Literary Fiction Awards',
  description:
    'An open-access, static-first catalog of major literary fiction prizes, winners, shortlists, and publishing metadata. Modeled after Benjamin Breen\'s Book Prize Index.',
  keywords: [
    'Mostly Fiction',
    'Fiction Prize Index',
    'Booker Prize',
    'Pulitzer Prize for Fiction',
    'National Book Award',
    'Women\'s Prize for Fiction',
    'International Booker Prize',
    'Hugo Award',
    'Goldsmiths Prize',
    'Literary Awards',
  ],
  authors: [
    { name: 'foobork', url: 'https://github.com/foobork' },
    { name: 'midlevels', url: 'https://github.com/midlevels' },
  ],
  openGraph: {
    title: 'Mostly Fiction',
    description: 'An open-access catalog and virtual bookshelf of world-class fiction honors.',
    type: 'website',
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
