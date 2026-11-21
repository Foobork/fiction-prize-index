'use client';

import React, { useState } from 'react';
import { Author, BookWithNominations } from '@/types';
import { Trophy, Award, BookOpen, ChevronRight, Globe, Star, Medal } from 'lucide-react';

interface AuthorDirectoryProps {
  authors: Author[];
  books: BookWithNominations[];
  onSelectBook: (book: BookWithNominations) => void;
}

export const AuthorDirectory: React.FC<AuthorDirectoryProps> = ({
  authors,
  books,
  onSelectBook,
}) => {
  const [filterNationality, setFilterNationality] = useState<string>('all');
  const [onlyNobel, setOnlyNobel] = useState<boolean>(false);

  const nationalities = Array.from(
    new Set(authors.map((a) => a.nationality).filter(Boolean))
  ).sort();

  // Map author -> books
  const authorsWithBooks = authors.map((author) => {
    const authorBooks = books.filter((b) => b.authorId === author.id);
    const totalWins = authorBooks.reduce((sum, b) => sum + b.totalWins, 0);
    const totalNoms = authorBooks.reduce((sum, b) => sum + b.totalNominations, 0);
    return {
      author,
      books: authorBooks,
      totalWins,
      totalNoms,
    };
  }).filter((a) => {
    if (onlyNobel && !a.author.nobelYear) return false;
    if (filterNationality === 'all') return true;
    return a.author.nationality === filterNationality;
  }).sort((a, b) => {
    // Sort Nobel winners first when filtering or by wins
    if (a.author.nobelYear && !b.author.nobelYear) return -1;
    if (!a.author.nobelYear && b.author.nobelYear) return 1;
    return b.totalWins - a.totalWins || b.totalNoms - a.totalNoms || a.author.name.localeCompare(b.author.name);
  });

  const nobelCount = authors.filter((a) => a.nobelYear).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-parchment-950 dark:text-parchment-50">
            Author Dossiers & Hall of Fame
          </h2>
          <p className="text-sm text-parchment-700 dark:text-ink-400 mt-1 leading-relaxed">
            Spotlighting Nobel laureates, double-winners, and prominent fiction voices in the global prize ecosystem.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Nobel Filter Toggle */}
          <button
            onClick={() => setOnlyNobel((prev) => !prev)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md border font-semibold transition-all ${
              onlyNobel
                ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-200 shadow-xs'
                : 'bg-parchment-100 dark:bg-ink-800 border-parchment-300 dark:border-ink-700 text-parchment-700 dark:text-ink-300 hover:bg-parchment-200'
            }`}
          >
            <Medal className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span>Nobel Laureates ({nobelCount})</span>
          </button>

          {/* Filter Nationality */}
          <div className="flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-parchment-500" />
            <select
              value={filterNationality}
              onChange={(e) => setFilterNationality(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-parchment-100 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 text-parchment-900 dark:text-parchment-100 font-medium"
            >
              <option value="all">All Nationalities</option>
              {nationalities.map((nat) => (
                <option key={nat} value={nat as string}>
                  {nat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {authorsWithBooks.map(({ author, books: authorBooks, totalWins, totalNoms }) => {
          const isMultipleWinner = totalWins > 1;
          const isNobel = Boolean(author.nobelYear);

          return (
            <div
              key={author.id}
              className={`rounded-xl border p-5 bg-parchment-50 dark:bg-ink-900 transition-all flex flex-col justify-between ${
                isNobel
                  ? 'border-yellow-400/80 dark:border-yellow-600/60 shadow-md ring-1 ring-yellow-400/30'
                  : isMultipleWinner
                  ? 'border-amber-300/80 dark:border-amber-700/60 shadow-xs ring-1 ring-amber-400/20'
                  : 'border-parchment-300 dark:border-ink-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif font-bold text-xl text-parchment-950 dark:text-white">
                        {author.name}
                      </h3>
                      {isNobel && (
                        <span className="flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-200 border border-yellow-400/80 dark:border-yellow-600/60">
                          <Medal className="w-3 h-3 mr-1 text-yellow-600 dark:text-yellow-400 fill-yellow-500" />
                          Nobel Prize ({author.nobelYear})
                        </span>
                      )}
                      {isMultipleWinner && !isNobel && (
                        <span className="flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                          <Star className="w-3 h-3 mr-0.5 fill-amber-400 text-amber-400" />
                          Multi-Winner ({totalWins} Wins)
                        </span>
                      )}
                    </div>
                    {author.nationality && (
                      <span className="text-xs text-parchment-600 dark:text-ink-400 block mt-0.5">
                        {author.nationality} {author.birthYear && `• b. ${author.birthYear}`}
                        {author.deathYear && ` – d. ${author.deathYear}`}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-gilded-600 dark:text-gilded-400 block">
                      {totalWins} {totalWins === 1 ? 'Win' : 'Wins'}
                    </span>
                    <span className="text-[11px] text-parchment-500 dark:text-ink-500">
                      {totalNoms} Total Honors
                    </span>
                  </div>
                </div>

                {author.bio && (
                  <p className="text-xs text-parchment-700 dark:text-ink-300 leading-relaxed">
                    {author.bio}
                  </p>
                )}
              </div>

              {/* Indexed Books under this author */}
              <div className="mt-4 pt-3 border-t border-parchment-200 dark:border-ink-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-parchment-500 dark:text-ink-400">
                  Indexed Masterpieces ({authorBooks.length})
                </span>
                <div className="space-y-1.5">
                  {authorBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => onSelectBook(book)}
                      className="p-2 rounded-lg bg-parchment-100/70 dark:bg-ink-800/60 hover:bg-parchment-200 dark:hover:bg-ink-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <BookOpen className="w-3.5 h-3.5 text-parchment-500 flex-shrink-0" />
                        <span className="font-serif font-bold text-parchment-900 dark:text-parchment-100 truncate">
                          {book.title}
                        </span>
                        <span className="text-parchment-500 font-mono text-[10px]">
                          ({book.publicationYear})
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        {book.nominations.map((n) => (
                          <span
                            key={n.id}
                            className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                              n.prizeId === 'nobel-prize-literature'
                                ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/60 dark:text-yellow-200 font-bold border border-yellow-300 dark:border-yellow-700'
                                : n.status === 'winner'
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 font-bold'
                                : 'bg-parchment-200 dark:bg-ink-700 text-parchment-800 dark:text-ink-200'
                            }`}
                          >
                            {n.prizeId === 'nobel-prize-literature' ? '🎖️ Nobel' : n.prize.shortName}
                          </span>
                        ))}
                        <ChevronRight className="w-3.5 h-3.5 text-parchment-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
