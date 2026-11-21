'use client';

import React, { useState, useMemo } from 'react';
import { BookWithNominations, Prize, AwardStatus } from '@/types';
import { Search, Trophy, Filter, LayoutGrid, List, Sparkles, X, ChevronRight } from 'lucide-react';

interface IndexTableProps {
  books: BookWithNominations[];
  prizes: Prize[];
  onSelectBook: (book: BookWithNominations) => void;
}

export const IndexTable: React.FC<IndexTableProps> = ({
  books,
  prizes,
  onSelectBook,
}) => {
  const [search, setSearch] = useState('');
  const [selectedPrize, setSelectedPrize] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [onlyMultipleWins, setOnlyMultipleWins] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'year-desc' | 'year-asc' | 'title' | 'wins'>('year-desc');

  const genres = useMemo(() => {
    return Array.from(new Set(books.flatMap((b) => b.genres))).sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    const query = search.toLowerCase().trim();

    return books.filter((book) => {
      // Search text
      if (query) {
        const matchTitle = book.title.toLowerCase().includes(query);
        const matchAuthor = book.authorName.toLowerCase().includes(query);
        const matchPublisher = book.publisher.toLowerCase().includes(query);
        const matchSynopsis = book.synopsis.toLowerCase().includes(query);
        const matchGenres = book.genres.some((g) => g.toLowerCase().includes(query));
        if (!matchTitle && !matchAuthor && !matchPublisher && !matchSynopsis && !matchGenres) {
          return false;
        }
      }

      // Prize filter
      if (selectedPrize !== 'all') {
        const hasPrize = book.nominations.some((n) => n.prizeId === selectedPrize);
        if (!hasPrize) return false;
      }

      // Status filter
      if (selectedStatus === 'winner') {
        const hasStatus = book.nominations.some((n) => n.status === 'winner');
        if (!hasStatus) return false;
      } else if (selectedStatus === 'shortlist') {
        const hasStatus = book.nominations.some((n) => n.status === 'shortlist' || n.status === 'finalist');
        if (!hasStatus) return false;
      }

      // Genre filter
      if (selectedGenre !== 'all') {
        if (!book.genres.includes(selectedGenre)) return false;
      }

      // Multiple wins filter
      if (onlyMultipleWins && book.nominations.length < 2) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'year-desc') return b.publicationYear - a.publicationYear;
      if (sortBy === 'year-asc') return a.publicationYear - b.publicationYear;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'wins') return b.totalWins - a.totalWins || b.totalNominations - a.totalNominations;
      return 0;
    });
  }, [books, search, selectedPrize, selectedStatus, selectedGenre, onlyMultipleWins, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedPrize('all');
    setSelectedStatus('all');
    setSelectedGenre('all');
    setOnlyMultipleWins(false);
  };

  const hasActiveFilters = search || selectedPrize !== 'all' || selectedStatus !== 'all' || selectedGenre !== 'all' || onlyMultipleWins;

  return (
    <div className="space-y-6">
      {/* Search & Control Header */}
      <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-300 dark:border-ink-800 rounded-xl p-4 sm:p-6 space-y-4 shadow-xs">
        {/* Omni Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-parchment-500 dark:text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by book title, author, synopsis, genre, or publisher..."
            className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-parchment-50 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 text-sm text-parchment-950 dark:text-parchment-50 placeholder-parchment-500 focus:outline-none focus:ring-2 focus:ring-gilded-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment-400 hover:text-parchment-700 dark:hover:text-parchment-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Faceted Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-parchment-200 dark:border-ink-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Prize Selector */}
            <select
              value={selectedPrize}
              onChange={(e) => setSelectedPrize(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-parchment-50 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 text-parchment-900 dark:text-parchment-100 font-medium"
            >
              <option value="all">All Fiction Prizes</option>
              {prizes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-parchment-50 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 text-parchment-900 dark:text-parchment-100"
            >
              <option value="all">All Outcomes</option>
              <option value="winner">🏆 Winners Only</option>
              <option value="shortlist">⭐ Shortlists & Finalists</option>
            </select>

            {/* Genre Filter */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-parchment-50 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 text-parchment-900 dark:text-parchment-100"
            >
              <option value="all">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {/* Cross-Prize Winner Toggle */}
            <button
              onClick={() => setOnlyMultipleWins((prev) => !prev)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md border transition-all ${
                onlyMultipleWins
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-semibold'
                  : 'bg-parchment-50 dark:bg-ink-800 border-parchment-300 dark:border-ink-700 text-parchment-700 dark:text-ink-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-gilded-500" />
              <span>Multi-Award Titles</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline px-1 py-0.5"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Sort & View Mode Controls */}
          <div className="flex items-center space-x-2 ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-md bg-parchment-50 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 text-parchment-900 dark:text-parchment-100 text-xs"
            >
              <option value="year-desc">Newest First</option>
              <option value="year-asc">Oldest First</option>
              <option value="wins">Most Awards Won</option>
              <option value="title">Title (A-Z)</option>
            </select>

            <div className="flex items-center border border-parchment-300 dark:border-ink-700 rounded-md overflow-hidden bg-parchment-50 dark:bg-ink-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-parchment-300 dark:bg-ink-700 text-parchment-950 dark:text-white'
                    : 'text-parchment-600 dark:text-ink-400'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 ${
                  viewMode === 'table'
                    ? 'bg-parchment-300 dark:bg-ink-700 text-parchment-950 dark:text-white'
                    : 'text-parchment-600 dark:text-ink-400'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between text-xs text-parchment-600 dark:text-ink-400 px-1">
        <span>
          Showing <strong>{filteredBooks.length}</strong> of {books.length} indexed titles
        </span>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="group cursor-pointer rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-300 dark:border-ink-800 p-5 hover:shadow-lg hover:border-parchment-400 dark:hover:border-ink-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Ribbon with Spine Color */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: book.spineColor || '#b45309' }}
                    />
                    <span className="text-xs font-semibold text-parchment-600 dark:text-ink-400">
                      {book.publicationYear}
                    </span>
                  </div>
                  {book.nominations.length > 1 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-200">
                      {book.nominations.length} Honors
                    </span>
                  )}
                </div>

                {/* Title & Author */}
                <div>
                  <h3 className="font-serif font-bold text-lg text-parchment-950 dark:text-white group-hover:text-gilded-600 dark:group-hover:text-gilded-400 transition-colors leading-snug">
                    {book.title}
                  </h3>
                  <p className="font-serif italic text-sm text-parchment-700 dark:text-parchment-300 mt-0.5">
                    by {book.authorName}
                  </p>
                </div>

                {/* Synopsis snippet */}
                <p className="text-xs text-parchment-700 dark:text-ink-400 line-clamp-2 leading-relaxed">
                  {book.synopsis}
                </p>
              </div>

              {/* Honors & Footer */}
              <div className="mt-4 pt-3 border-t border-parchment-200 dark:border-ink-800 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {book.nominations.map((nom) => (
                    <span
                      key={nom.id}
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        nom.status === 'winner'
                          ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 font-semibold'
                          : 'bg-parchment-200 dark:bg-ink-800 text-parchment-800 dark:text-ink-300'
                      }`}
                    >
                      {nom.status === 'winner' ? '🏆 ' : nom.status === 'finalist' ? '🎖️ ' : '⭐ '}
                      {nom.prize.shortName} '{String(nom.year).slice(2)}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-parchment-500 dark:text-ink-400">
                  <span>{book.publisher}</span>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center text-gilded-600 dark:text-gilded-400 font-medium">
                    View Details <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="rounded-xl border border-parchment-300 dark:border-ink-800 overflow-hidden bg-parchment-50 dark:bg-ink-900 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-parchment-100 dark:bg-ink-950 text-xs font-semibold text-parchment-800 dark:text-ink-300 border-b border-parchment-300 dark:border-ink-800">
                <tr>
                  <th className="px-4 py-3">Title & Author</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Prizes & Honors</th>
                  <th className="px-4 py-3">Publisher</th>
                  <th className="px-4 py-3">Genres</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment-200 dark:divide-ink-800">
                {filteredBooks.map((book) => (
                  <tr
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="hover:bg-parchment-100/70 dark:hover:bg-ink-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-serif font-bold text-parchment-950 dark:text-white">
                        {book.title}
                      </div>
                      <div className="text-xs text-parchment-600 dark:text-ink-400 font-serif italic">
                        {book.authorName}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-parchment-700 dark:text-ink-300">
                      {book.publicationYear}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {book.nominations.map((nom) => (
                          <span
                            key={nom.id}
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              nom.status === 'winner'
                                ? 'bg-amber-100 text-amber-900 font-bold dark:bg-amber-900/50 dark:text-amber-200'
                                : 'bg-parchment-200 text-parchment-800 dark:bg-ink-800 dark:text-ink-300'
                            }`}
                          >
                            {nom.status === 'winner' ? '🏆 ' : nom.status === 'finalist' ? '🎖️ ' : '⭐ '}
                            {nom.prize.shortName} ({nom.year})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-parchment-700 dark:text-ink-300">
                      {book.publisher}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {book.genres.slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="px-1.5 py-0.2 rounded text-[10px] bg-parchment-100 dark:bg-ink-800 text-parchment-600 dark:text-ink-400"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs text-gilded-600 dark:text-gilded-400 font-medium">
                      Inspect →
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
