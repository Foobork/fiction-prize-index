'use client';

import React from 'react';
import { X, ExternalLink, Bookmark, CheckCircle2, BookOpen, Trophy, Award, Calendar, Building, Globe } from 'lucide-react';
import { BookWithNominations, ReadingStatus } from '@/types';

interface BookModalProps {
  book: BookWithNominations | null;
  onClose: () => void;
  savedStatus?: ReadingStatus;
  onUpdateStatus: (bookId: string, status: ReadingStatus) => void;
  onRemoveStatus: (bookId: string) => void;
}

export const BookModal: React.FC<BookModalProps> = ({
  book,
  onClose,
  savedStatus,
  onUpdateStatus,
  onRemoveStatus,
}) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-parchment-50 dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden transition-all text-parchment-900 dark:text-parchment-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon / Color bar */}
        <div 
          className="h-3 w-full" 
          style={{ backgroundColor: book.spineColor || '#b45309' }} 
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-parchment-500 hover:text-parchment-900 dark:hover:text-parchment-100 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Title & Author Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
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

            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-parchment-950 dark:text-white leading-tight">
              {book.title}
            </h2>
            <p className="font-serif italic text-lg text-parchment-700 dark:text-parchment-300 mt-1">
              by {book.authorName}
            </p>
          </div>

          {/* Publisher & Metadata */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-parchment-700 dark:text-ink-300 py-2 border-y border-parchment-200 dark:border-ink-800">
            <span className="flex items-center">
              <Building className="w-3.5 h-3.5 mr-1.5 text-parchment-500" />
              Publisher: <strong className="ml-1 text-parchment-900 dark:text-parchment-100">{book.publisher}{book.imprint ? ` (${book.imprint})` : ''}</strong>
            </span>
            {book.isbn13 && (
              <span>
                ISBN: <code className="font-mono">{book.isbn13}</code>
              </span>
            )}
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-parchment-500 dark:text-ink-400 mb-2">
              Synopsis
            </h4>
            <p className="text-sm leading-relaxed text-parchment-800 dark:text-parchment-200">
              {book.synopsis}
            </p>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5">
            {book.genres.map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 rounded text-xs bg-parchment-100 dark:bg-ink-800 border border-parchment-200 dark:border-ink-700 text-parchment-700 dark:text-ink-300"
              >
                {g}
              </span>
            ))}
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                          nom.status === 'winner'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700'
                            : 'bg-parchment-200 text-parchment-800 dark:bg-ink-800 dark:text-ink-300'
                        }`}
                      >
                        {nom.status === 'winner' ? '🏆 Winner' : '⭐ Shortlist'}
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
                        className="text-xs text-gilded-600 dark:text-gilded-400 hover:underline flex items-center font-medium"
                      >
                        Official Citation <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                  {nom.citation && (
                    <blockquote className="text-xs italic text-parchment-600 dark:text-ink-400 pl-3 border-l-2 border-gilded-500/50">
                      "{nom.citation}"
                    </blockquote>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reading Shelf Actions */}
          <div className="pt-4 border-t border-parchment-200 dark:border-ink-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-parchment-600 dark:text-ink-400">
                Personal Shelf:
              </span>
              <button
                onClick={() => onUpdateStatus(book.id, 'want-to-read')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  savedStatus === 'want-to-read'
                    ? 'bg-gilded-500 text-white font-semibold'
                    : 'bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 text-parchment-800 dark:text-parchment-200'
                }`}
              >
                Want to Read
              </button>
              <button
                onClick={() => onUpdateStatus(book.id, 'reading')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  savedStatus === 'reading'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 text-parchment-800 dark:text-parchment-200'
                }`}
              >
                Reading
              </button>
              <button
                onClick={() => onUpdateStatus(book.id, 'completed')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  savedStatus === 'completed'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 text-parchment-800 dark:text-parchment-200'
                }`}
              >
                Completed
              </button>
              {savedStatus && (
                <button
                  onClick={() => onRemoveStatus(book.id)}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline ml-2"
                >
                  Remove
                </button>
              )}
            </div>

            <a
              href={`https://openlibrary.org/search?q=${encodeURIComponent(book.title + ' ' + book.authorName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-parchment-600 dark:text-ink-400 hover:text-parchment-900 dark:hover:text-parchment-100 flex items-center"
            >
              Open Library <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
