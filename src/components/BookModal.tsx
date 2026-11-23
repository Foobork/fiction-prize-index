'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  X,
  ExternalLink,
  Link2,
  Share2,
  Trophy,
  Building,
  Globe,
  Languages,
  Tag,
} from 'lucide-react';
import { BookWithNominations, ReadingStatus } from '@/types';
import { BookCover } from './BookCover';

interface BookModalProps {
  book: BookWithNominations | null;
  onClose: () => void;
  savedStatus?: ReadingStatus;
  onUpdateStatus: (bookId: string, status: ReadingStatus) => void;
  onRemoveStatus: (bookId: string) => void;
  onSelectGenre?: (genre: string) => void;
  onSelectAuthor?: (authorName: string) => void;
}

export const BookModal: React.FC<BookModalProps> = ({
  book,
  onClose,
  savedStatus,
  onUpdateStatus,
  onRemoveStatus,
  onSelectGenre,
  onSelectAuthor,
}) => {
  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!book) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [book, onClose]);

  useEffect(() => {
    setCopied(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [book?.id]);

  if (!book) return null;

  const canonicalBookUrl = `https://foobork.github.io/fiction-prize-index/book/${book.id}/`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `"${book.title}" by ${book.authorName} on Mostly Fiction: ${canonicalBookUrl}`
  )}`;

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(canonicalBookUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older mobile browsers without clipboard permission
      const input = document.createElement('input');
      input.value = canonicalBookUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-6 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-modal-title"
    >
      <div
        className="relative flex flex-col bg-parchment-50 dark:bg-ink-900 sm:border border-parchment-300 dark:border-ink-700 w-full h-[100dvh] sm:h-auto sm:max-h-[90dvh] sm:max-w-2xl rounded-none sm:rounded-xl shadow-2xl overflow-hidden transition-all text-parchment-900 dark:text-parchment-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon / Color bar */}
        <div
          className="h-2 sm:h-3 w-full shrink-0"
          style={{ backgroundColor: book.spineColor || '#b45309' }}
        />

        {/* Sticky Top Navigation Bar */}
        <div className="shrink-0 flex items-center justify-between gap-2 px-4 sm:px-6 py-2.5 pt-[calc(0.625rem+env(safe-area-inset-top))] sm:pt-2.5 border-b border-parchment-200 dark:border-ink-800 bg-parchment-50/95 dark:bg-ink-900/95 backdrop-blur-sm">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 -ml-2 rounded-lg text-sm font-semibold text-parchment-800 dark:text-parchment-100 hover:bg-parchment-200 dark:hover:bg-ink-800 active:bg-parchment-300 dark:active:bg-ink-700 transition-colors"
            aria-label="Back to catalog"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 transition-colors"
              title="Share on WhatsApp with cover preview"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-parchment-700 dark:text-ink-300 hover:text-parchment-950 dark:hover:text-parchment-100 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors"
              aria-label="Copy link to book"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex p-1.5 rounded-full text-parchment-500 hover:text-parchment-900 dark:hover:text-parchment-100 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pb-8 space-y-6"
        >
          {/* Hero Section with Cover Art & Book Identity */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
            <BookCover
              book={book}
              size="lg"
              className="mx-auto sm:mx-0 shadow-xl !w-36 !h-52 sm:!w-44 sm:!h-64"
              showHonorsBadge
            />

            <div className="flex-1 min-w-0 w-full space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-parchment-200 dark:bg-ink-800 text-parchment-800 dark:text-gilded-400">
                  {book.publicationYear}
                </span>
                {book.countryOfOrigin && (
                  <span className="flex items-center text-xs text-parchment-600 dark:text-ink-400">
                    <Globe className="w-3.5 h-3.5 mr-1" />
                    {book.countryOfOrigin}
                  </span>
                )}
                {book.pageCount && (
                  <span className="text-xs text-parchment-500 dark:text-ink-400">
                    • {book.pageCount} pages
                  </span>
                )}
              </div>

              <div>
                <h2
                  id="book-modal-title"
                  className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-parchment-950 dark:text-white leading-tight"
                >
                  {book.title}
                </h2>
                {onSelectAuthor ? (
                  <button
                    type="button"
                    onClick={() => onSelectAuthor(book.authorName)}
                    className="font-serif italic text-lg text-parchment-700 dark:text-parchment-300 hover:text-gilded-600 dark:hover:text-gilded-400 transition-colors text-left hover:underline mt-1 cursor-pointer"
                    title={`Browse other works by ${book.authorName}`}
                  >
                    by {book.authorName} →
                  </button>
                ) : (
                  <p className="font-serif italic text-lg text-parchment-700 dark:text-parchment-300 mt-1">
                    by {book.authorName}
                  </p>
                )}
                {book.translator && (
                  <p className="text-xs sm:text-sm font-sans text-purple-700 dark:text-purple-300 mt-1.5 flex items-center flex-wrap gap-x-1.5">
                    <span className="flex items-center font-medium">
                      <Languages className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400 shrink-0" />
                      Translated from {book.originalLanguage ? `the ${book.originalLanguage}` : 'the original'} by
                    </span>
                    <strong className="font-semibold text-purple-950 dark:text-purple-100">
                      {book.translator}
                    </strong>
                    {book.originalTitle && (
                      <span className="text-xs text-parchment-500 dark:text-ink-400 italic">
                        (Original: <em>{book.originalTitle}</em>)
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Publisher & Metadata */}
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-parchment-700 dark:text-ink-300 pt-1">
                <span className="flex items-center">
                  <Building className="w-3.5 h-3.5 mr-1.5 text-parchment-500 shrink-0" />
                  <span>
                    Publisher:{' '}
                    <strong className="text-parchment-900 dark:text-parchment-100">
                      {book.publisher}
                      {book.imprint ? ` (${book.imprint})` : ''}
                    </strong>
                  </span>
                </span>
                {book.isbn13 && (
                  <span>
                    ISBN: <code className="font-mono">{book.isbn13}</code>
                  </span>
                )}
              </div>

              {/* Interactive Genres & Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                <span className="text-xs text-parchment-500 dark:text-ink-400 flex items-center mr-1">
                  <Tag className="w-3 h-3 mr-1 text-gilded-500" />
                  Genres:
                </span>
                {book.genres.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => onSelectGenre?.(g)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-parchment-100 hover:bg-gilded-100 hover:text-gilded-950 dark:bg-ink-800 dark:hover:bg-gilded-950/60 dark:hover:text-gilded-200 border border-parchment-300 dark:border-ink-700 hover:border-gilded-400 dark:hover:border-gilded-600 text-parchment-800 dark:text-ink-200 transition-all cursor-pointer group shadow-2xs hover:scale-105 active:scale-95"
                    title={`Filter catalog by genre: "${g}"`}
                  >
                    <span>{g}</span>
                    <span className="text-[10px] text-gilded-600 dark:text-gilded-400 opacity-60 group-hover:opacity-100 transition-opacity">
                      ↗
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="pt-2 border-t border-parchment-200 dark:border-ink-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-parchment-500 dark:text-ink-400 mb-2">
              Synopsis
            </h4>
            <p className="text-sm leading-relaxed text-parchment-800 dark:text-parchment-200">
              {book.synopsis}
            </p>
          </div>

          {/* Award Nominations & Honors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-parchment-500 dark:text-ink-400 mb-3 flex items-center">
              <Trophy className="w-3.5 h-3.5 mr-1.5 text-gilded-500" />
              Prize Recognition & Source Records
            </h4>
            <div className="space-y-3">
              {book.nominations.map((nom) => (
                <div
                  key={nom.id}
                  className="p-3.5 rounded-lg border border-parchment-200 dark:border-ink-800 bg-parchment-100/60 dark:bg-ink-950/60 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                          nom.status === 'winner'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700'
                            : 'bg-parchment-200 text-parchment-800 dark:bg-ink-800 dark:text-ink-300'
                        }`}
                      >
                        {nom.status === 'winner' ? '🏆 Winner' : nom.status === 'finalist' ? '🎖️ Finalist' : '⭐ Shortlist'}
                      </span>
                      <span className="font-semibold text-sm text-parchment-900 dark:text-parchment-100">
                        {nom.prize.name} ({nom.year})
                      </span>
                    </div>
                    {nom.sourceUrl && (
                      <a
                        href={nom.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gilded-600 dark:text-gilded-400 hover:underline flex items-center font-medium shrink-0"
                      >
                        Official Citation <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                  {nom.citation && (
                    <blockquote className="text-xs italic text-parchment-600 dark:text-ink-400 pl-3 border-l-2 border-gilded-500/50">
                      &ldquo;{nom.citation}&rdquo;
                    </blockquote>
                  )}
                  {nom.translator && (
                    <div className="flex items-center text-xs text-purple-700 dark:text-purple-300 font-sans pt-0.5">
                      <Languages className="w-3.5 h-3.5 mr-1 text-purple-500 shrink-0" />
                      <span>
                        Translated by <strong className="font-semibold text-purple-900 dark:text-purple-200">{nom.translator}</strong>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reading Shelf Actions */}
          <div className="pt-4 border-t border-parchment-200 dark:border-ink-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-parchment-600 dark:text-ink-400">
                Personal Shelf:
              </span>
              <button
                type="button"
                onClick={() => onUpdateStatus(book.id, 'want-to-read')}
                className={`px-3 py-2 sm:py-1.5 rounded text-xs font-medium transition-colors ${
                  savedStatus === 'want-to-read'
                    ? 'bg-gilded-500 text-white font-semibold'
                    : 'bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 text-parchment-800 dark:text-parchment-200'
                }`}
              >
                Want to Read
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus(book.id, 'reading')}
                className={`px-3 py-2 sm:py-1.5 rounded text-xs font-medium transition-colors ${
                  savedStatus === 'reading'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 text-parchment-800 dark:text-parchment-200'
                }`}
              >
                Reading
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus(book.id, 'completed')}
                className={`px-3 py-2 sm:py-1.5 rounded text-xs font-medium transition-colors ${
                  savedStatus === 'completed'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 text-parchment-800 dark:text-parchment-200'
                }`}
              >
                Completed
              </button>
              {savedStatus && (
                <button
                  type="button"
                  onClick={() => onRemoveStatus(book.id)}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline px-1.5 py-1"
                >
                  Remove
                </button>
              )}
            </div>

            <a
              href={`https://openlibrary.org/search?q=${encodeURIComponent(book.title + ' ' + book.authorName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-parchment-600 dark:text-ink-400 hover:text-parchment-900 dark:hover:text-parchment-100 flex items-center py-1"
            >
              Open Library <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
