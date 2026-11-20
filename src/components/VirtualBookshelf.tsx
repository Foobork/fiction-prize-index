'use client';

import React, { useState } from 'react';
import { BookWithNominations } from '@/types';
import { Trophy, ArrowUpDown, Filter, Sparkles, BookOpen } from 'lucide-react';

interface VirtualBookshelfProps {
  books: BookWithNominations[];
  onSelectBook: (book: BookWithNominations) => void;
}

export const VirtualBookshelf: React.FC<VirtualBookshelfProps> = ({
  books,
  onSelectBook,
}) => {
  const [shelfSort, setShelfSort] = useState<'year' | 'pages' | 'wins' | 'title'>('year');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const genres = Array.from(new Set(books.flatMap((b) => b.genres))).sort();

  const filteredBooks = books.filter((b) => {
    if (selectedGenre === 'all') return true;
    return b.genres.includes(selectedGenre);
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (shelfSort === 'year') return b.publicationYear - a.publicationYear;
    if (shelfSort === 'pages') return (b.pageCount || 300) - (a.pageCount || 300);
    if (shelfSort === 'wins') return b.totalWins - a.totalWins || b.totalNominations - a.totalNominations;
    return a.title.localeCompare(b.title);
  });

  // Split into rows (shelves) of ~10-12 books
  const booksPerShelf = 12;
  const shelves: BookWithNominations[][] = [];
  for (let i = 0; i < sortedBooks.length; i += booksPerShelf) {
    shelves.push(sortedBooks.slice(i, i + booksPerShelf));
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-parchment-100 dark:bg-ink-900 border border-parchment-300 dark:border-ink-700">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-gilded-600 dark:text-gilded-400" />
          <h3 className="font-serif font-bold text-lg text-parchment-900 dark:text-parchment-100">
            Virtual Library Shelf
          </h3>
          <span className="text-xs text-parchment-600 dark:text-ink-400 ml-2">
            ({sortedBooks.length} books on shelf)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Genre filter */}
          <div className="flex items-center space-x-1.5 text-xs text-parchment-700 dark:text-ink-300">
            <Filter className="w-3.5 h-3.5" />
            <span>Genre:</span>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-parchment-50 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 rounded px-2 py-1 text-xs text-parchment-900 dark:text-parchment-100"
            >
              <option value="all">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center space-x-1.5 text-xs text-parchment-700 dark:text-ink-300">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort Shelf:</span>
            <select
              value={shelfSort}
              onChange={(e) => setShelfSort(e.target.value as any)}
              className="bg-parchment-50 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 rounded px-2 py-1 text-xs text-parchment-900 dark:text-parchment-100 font-medium"
            >
              <option value="year">Publication Year</option>
              <option value="wins">Award Wins / Honors</option>
              <option value="pages">Spine Thickness (Pages)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookcase Container */}
      <div className="space-y-12">
        {shelves.map((shelf, shelfIdx) => (
          <div key={shelfIdx} className="relative">
            {/* Books Row */}
            <div className="flex items-end justify-start space-x-1.5 sm:space-x-3 px-4 sm:px-8 overflow-x-auto pb-0 min-h-[320px]">
              {shelf.map((book) => {
                // Determine spine height based on page count (min 230px, max 300px)
                const pages = book.pageCount || 320;
                const heightPx = Math.min(300, Math.max(220, 200 + Math.round((pages / 700) * 90)));
                const widthPx = Math.min(54, Math.max(34, 30 + Math.round((pages / 600) * 18)));
                const hasWonMajor = book.totalWins > 0;

                return (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    style={{
                      height: `${heightPx}px`,
                      width: `${widthPx}px`,
                      backgroundColor: book.spineColor || '#334155',
                    }}
                    className="relative group cursor-pointer rounded-t-sm shadow-md transition-all duration-300 hover:-translate-y-4 hover:shadow-2xl flex flex-col justify-between py-3 px-1 text-white border-l border-white/20 border-r border-black/30 select-none flex-shrink-0"
                    title={`${book.title} by ${book.authorName} (${book.publicationYear})`}
                  >
                    {/* Top Spine Foil Accent */}
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-1 bg-amber-400/80 rounded-full mb-1" />
                      {hasWonMajor && (
                        <Trophy className="w-3.5 h-3.5 text-amber-300 group-hover:scale-125 transition-transform drop-shadow" />
                      )}
                    </div>

                    {/* Vertical Title & Author */}
                    <div 
                      className="flex-1 flex items-center justify-center overflow-hidden my-2"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      <span className="font-serif font-bold text-[11px] sm:text-xs tracking-tight truncate leading-tight text-parchment-100">
                        {book.title}
                      </span>
                      <span className="text-[9px] text-parchment-300 ml-1.5 truncate opacity-80">
                        {book.authorName}
                      </span>
                    </div>

                    {/* Bottom Spine: Year / Publisher Mark */}
                    <div className="flex flex-col items-center border-t border-white/20 pt-1 text-[9px] font-mono text-parchment-300">
                      <span>{book.publicationYear}</span>
                    </div>

                    {/* Pull-out Hover Tooltip */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-ink-950 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap z-30 font-sans">
                      {book.title} ({book.publicationYear})
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Wooden Shelf Beam */}
            <div className="w-full h-5 rounded-sm bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 dark:from-stone-800 dark:via-stone-900 dark:to-stone-950 shadow-lg border-t-2 border-amber-700/60 dark:border-stone-700 flex items-center justify-center">
              <div className="w-full h-1 bg-black/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
