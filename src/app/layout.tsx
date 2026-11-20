import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fiction Prize Index | Open Catalog of Major Literary Fiction Awards',
  description:
    'An open-access, static-first catalog of major literary fiction prizes, winners, shortlists, and publishing metadata. Modeled after Benjamin Breen\'s Book Prize Index.',
  keywords: [
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
  authors: [{ name: 'Fiction Prize Index Curators' }],
  openGraph: {
    title: 'Fiction Prize Index',
    description: 'An open-access catalog and virtual bookshelf of world-class fiction honors.',
    type: 'website',
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
