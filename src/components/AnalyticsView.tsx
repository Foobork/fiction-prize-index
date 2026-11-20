'use client';

import React from 'react';
import { getAnalytics } from '@/lib/data';
import { BookWithNominations } from '@/types';
import { BarChart3, Trophy, Sparkles, Building2, BookMarked, Layers, Award } from 'lucide-react';

interface AnalyticsViewProps {
  onSelectBook: (book: BookWithNominations) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onSelectBook }) => {
  const analytics = getAnalytics();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-parchment-950 dark:text-parchment-50">
          Literary Analytics & Publishing Insights
        </h2>
        <p className="text-sm text-parchment-700 dark:text-ink-400 mt-1 leading-relaxed">
          Quantitative analysis of prize overlap, publisher market concentration, and genre trends across indexed fiction awards.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-300 dark:border-ink-800">
          <div className="flex items-center space-x-2 text-parchment-500 text-xs">
            <BookMarked className="w-4 h-4 text-gilded-500" />
            <span>Indexed Titles</span>
          </div>
          <div className="font-serif text-3xl font-bold text-parchment-950 dark:text-white mt-1">
            {analytics.totalBooks}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-300 dark:border-ink-800">
          <div className="flex items-center space-x-2 text-parchment-500 text-xs">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Prizes Tracked</span>
          </div>
          <div className="font-serif text-3xl font-bold text-parchment-950 dark:text-white mt-1">
            {analytics.totalPrizes}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-300 dark:border-ink-800">
          <div className="flex items-center space-x-2 text-parchment-500 text-xs">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Cross-Prize Titles</span>
          </div>
          <div className="font-serif text-3xl font-bold text-parchment-950 dark:text-white mt-1">
            {analytics.crossPrizeBooks.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-300 dark:border-ink-800">
          <div className="flex items-center space-x-2 text-parchment-500 text-xs">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>Total Award Records</span>
          </div>
          <div className="font-serif text-3xl font-bold text-parchment-950 dark:text-white mt-1">
            {analytics.totalNominations}
          </div>
        </div>
      </div>

      {/* The Cross-Prize Overlap Club */}
      <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-serif font-bold text-xl text-parchment-950 dark:text-amber-100">
            The Cross-Prize Overlap Club
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-parchment-700 dark:text-amber-200/80 leading-relaxed max-w-3xl">
          Books that achieved rare consensus across distinct jury panels, capturing or contesting multiple premier international and American awards.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {analytics.crossPrizeBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="p-4 rounded-lg bg-parchment-50 dark:bg-ink-900 border border-parchment-300 dark:border-ink-800 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-parchment-500">
                    {book.publicationYear}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200">
                    {book.nominations.length} Honors
                  </span>
                </div>
                <h4 className="font-serif font-bold text-lg text-parchment-950 dark:text-white mt-1">
                  {book.title}
                </h4>
                <p className="font-serif italic text-xs text-parchment-600 dark:text-ink-400">
                  by {book.authorName}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-parchment-200 dark:border-ink-800 flex flex-wrap gap-1">
                {book.nominations.map((n) => (
                  <span
                    key={n.id}
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      n.status === 'winner'
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 font-bold'
                        : 'bg-parchment-200 dark:bg-ink-800 text-parchment-800 dark:text-ink-200'
                    }`}
                  >
                    {n.status === 'winner' ? '🏆 ' : ''}
                    {n.prize.shortName} ({n.year})
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Top Publishers & Genre Frequency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Publishers */}
        <div className="p-6 rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-900 space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-gilded-500" />
            <h3 className="font-serif font-bold text-lg text-parchment-950 dark:text-white">
              Leading Publishers & Imprints
            </h3>
          </div>
          <p className="text-xs text-parchment-600 dark:text-ink-400">
            Publishing houses with the most recognized fiction titles in the index.
          </p>

          <div className="space-y-2.5 pt-2">
            {analytics.topPublishers.slice(0, 8).map(({ publisher, count }) => {
              const maxCount = analytics.topPublishers[0].count;
              const percent = Math.round((count / maxCount) * 100);

              return (
                <div key={publisher} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-parchment-800 dark:text-parchment-200 truncate pr-2">
                      {publisher}
                    </span>
                    <span className="font-mono text-parchment-600 dark:text-ink-400">
                      {count} {count === 1 ? 'title' : 'titles'}
                    </span>
                  </div>
                  <div className="w-full bg-parchment-200 dark:bg-ink-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gilded-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Genres */}
        <div className="p-6 rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-900 space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <h3 className="font-serif font-bold text-lg text-parchment-950 dark:text-white">
              Genre Distribution
            </h3>
          </div>
          <p className="text-xs text-parchment-600 dark:text-ink-400">
            Most prevalent narrative modes and genres across award-recognized fiction.
          </p>

          <div className="space-y-2.5 pt-2">
            {analytics.topGenres.slice(0, 8).map(({ genre, count }) => {
              const maxCount = analytics.topGenres[0].count;
              const percent = Math.round((count / maxCount) * 100);

              return (
                <div key={genre} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-parchment-800 dark:text-parchment-200">
                      {genre}
                    </span>
                    <span className="font-mono text-parchment-600 dark:text-ink-400">
                      {count}
                    </span>
                  </div>
                  <div className="w-full bg-parchment-200 dark:bg-ink-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
