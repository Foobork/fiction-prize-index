import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { books, getEnrichedBooks, prizes } from '@/lib/data';
import { BookCover } from '@/components/BookCover';
import { MooseIcon } from '@/components/MooseIcon';
import { Trophy, BookOpen, Share2, ArrowLeft, ExternalLink } from 'lucide-react';

interface BookPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return books.map((b) => ({
    id: b.id,
  }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const enrichedBooks = getEnrichedBooks();
  const book = enrichedBooks.find((b) => b.id === params.id);

  if (!book) {
    return {
      title: 'Book Not Found | Mostly Fiction',
    };
  }

  // Construct winning / nomination summary
  const wins = book.nominations.filter((n) => n.status === 'winner');
  let prizeText = '';
  if (wins.length > 0) {
    prizeText = `Winner of the ${wins.map((w) => `${w.year} ${w.prize.name}`).join(' and ')}.`;
  } else if (book.nominations.length > 0) {
    const firstNom = book.nominations[0];
    prizeText = `${firstNom.status.toUpperCase()} for the ${firstNom.year} ${firstNom.prize.name}.`;
  }

  const desc = `${prizeText} ${book.synopsis || ''}`.trim();
  const coverUrl = book.coverImage || 'https://foobork.github.io/fiction-prize-index/og-image.jpg';
  const pageUrl = `https://foobork.github.io/fiction-prize-index/book/${book.id}/`;

  return {
    title: `${book.title} by ${book.authorName} | Mostly Fiction`,
    description: desc,
    openGraph: {
      title: `${book.title} by ${book.authorName}`,
      description: desc,
      url: pageUrl,
      type: 'book',
      siteName: 'Mostly Fiction',
      images: [
        {
          url: coverUrl,
          alt: `${book.title} cover`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${book.title} by ${book.authorName}`,
      description: desc,
      images: [coverUrl],
    },
  };
}

export default function BookPage({ params }: BookPageProps) {
  const enrichedBooks = getEnrichedBooks();
  const book = enrichedBooks.find((b) => b.id === params.id);

  if (!book) {
    notFound();
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const appUrl = `${basePath}/?book=${book.id}`;
  const shareText = encodeURIComponent(
    `Check out "${book.title}" by ${book.authorName} on Mostly Fiction: https://foobork.github.io/fiction-prize-index/book/${book.id}/`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <div className="min-h-screen bg-parchment-50 dark:bg-ink-950 text-parchment-950 dark:text-parchment-100 antialiased py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between border-b border-parchment-200 dark:border-ink-800 pb-4">
        <Link
          href="/"
          className="flex items-center space-x-3 text-parchment-900 dark:text-parchment-100 hover:opacity-80 transition-opacity"
        >
          <MooseIcon className="w-8 h-8 text-gilded-600 dark:text-gilded-400" />
          <div>
            <span className="font-serif font-bold text-lg tracking-wide block">MOSTLY FICTION</span>
            <span className="text-xs text-parchment-500 dark:text-ink-400 tracking-wider uppercase block">
              The Literary Prize Index
            </span>
          </div>
        </Link>
        <Link
          href={appUrl}
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium px-4 py-2 rounded-lg bg-gilded-600 hover:bg-gilded-700 text-white shadow-sm transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Open in Library Shelf</span>
        </Link>
      </div>

      {/* Main Book Card */}
      <main className="max-w-4xl mx-auto bg-white dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Cover Art Column */}
          <div className="md:col-span-5 flex flex-col items-center">
            <BookCover book={book} size="xl" showHonorsBadge className="shadow-2xl rounded-lg" />
            
            {/* Share Buttons */}
            <div className="w-full max-w-xs mt-6 space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow transition-colors"
              >
                <span>Share on WhatsApp</span>
              </a>
              <Link
                href={appUrl}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-parchment-100 hover:bg-parchment-200 dark:bg-ink-800 dark:hover:bg-ink-700 text-parchment-900 dark:text-parchment-200 text-xs sm:text-sm font-medium rounded-lg border border-parchment-300 dark:border-ink-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Browse All Winners in Shelf</span>
              </Link>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {book.genres.map((genre) => (
                  <span
                    key={genre}
                    className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-parchment-100 dark:bg-ink-800 text-parchment-700 dark:text-parchment-300 border border-parchment-200 dark:border-ink-700"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-parchment-950 dark:text-parchment-50 leading-tight">
                {book.title}
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-parchment-700 dark:text-parchment-300 mt-1">
                by {book.authorName}
              </p>
              {book.translator && (
                <p className="text-xs text-parchment-500 dark:text-ink-400 mt-0.5">
                  Translated by {book.translator}
                </p>
              )}
            </div>

            {/* Honors & Nominations */}
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-wider font-bold text-parchment-500 dark:text-ink-400">
                Honors & Prizes
              </h2>
              <div className="space-y-2.5">
                {book.nominations.map((nom) => (
                  <div
                    key={nom.id}
                    className="p-3 rounded-xl bg-parchment-50 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700"
                  >
                    <div className="flex items-center space-x-2">
                      <Trophy
                        className={`w-4 h-4 ${
                          nom.status === 'winner'
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-parchment-400 dark:text-ink-400'
                        }`}
                      />
                      <span className="font-serif font-bold text-sm text-parchment-900 dark:text-parchment-100">
                        {nom.year} {nom.prize.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          nom.status === 'winner'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200'
                            : 'bg-parchment-200 text-parchment-700 dark:bg-ink-700 dark:text-ink-300'
                        }`}
                      >
                        {nom.status}
                      </span>
                    </div>
                    {nom.citation && (
                      <p className="text-xs text-parchment-700 dark:text-parchment-300 italic mt-1.5 pl-6 border-l-2 border-gilded-500/40">
                        "{nom.citation}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            {book.synopsis && (
              <div>
                <h2 className="text-xs uppercase tracking-wider font-bold text-parchment-500 dark:text-ink-400 mb-2">
                  Synopsis
                </h2>
                <p className="text-sm leading-relaxed text-parchment-800 dark:text-parchment-200 font-serif">
                  {book.synopsis}
                </p>
              </div>
            )}

            {/* Publishing Metadata */}
            <div className="pt-4 border-t border-parchment-200 dark:border-ink-800 text-xs text-parchment-600 dark:text-ink-400 grid grid-cols-2 gap-4">
              <div>
                <span className="block font-bold">Published:</span>
                <span>
                  {book.publicationYear} ({book.publisher})
                </span>
              </div>
              {book.isbn13 && (
                <div>
                  <span className="block font-bold">ISBN:</span>
                  <span className="font-mono">{book.isbn13}</span>
                </div>
              )}
              {book.pageCount && (
                <div>
                  <span className="block font-bold">Length:</span>
                  <span>{book.pageCount} pages</span>
                </div>
              )}
              {book.countryOfOrigin && (
                <div>
                  <span className="block font-bold">Country:</span>
                  <span>{book.countryOfOrigin}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
