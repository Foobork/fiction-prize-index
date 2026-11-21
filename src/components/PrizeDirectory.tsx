'use client';

import React, { useState } from 'react';
import { Prize, BookWithNominations } from '@/types';
import { Trophy, ExternalLink, Calendar, MapPin, DollarSign, Award, ChevronDown } from 'lucide-react';

interface PrizeDirectoryProps {
  prizes: Prize[];
  books: BookWithNominations[];
  onSelectBook: (book: BookWithNominations) => void;
}

export const PrizeDirectory: React.FC<PrizeDirectoryProps> = ({
  prizes,
  books,
  onSelectBook,
}) => {
  const [expandedPrize, setExpandedPrize] = useState<string>(prizes[0]?.id || '');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="max-w-3xl">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-parchment-950 dark:text-parchment-50">
          The Major Fiction Prizes
        </h2>
        <p className="text-sm text-parchment-700 dark:text-ink-400 mt-1 leading-relaxed">
          Comprehensive archives, judging philosophies, prize purses, and full chronological timelines for each tracked award foundation.
        </p>
      </div>

      <div className="space-y-4">
        {prizes.map((prize) => {
          const isExpanded = expandedPrize === prize.id;

          // Find all nominations for this prize
          const prizeNominations = books.flatMap((b) =>
            b.nominations
              .filter((n) => n.prizeId === prize.id)
              .map((n) => ({ book: b, nom: n }))
          ).sort((a, b) => b.nom.year - a.nom.year);

          return (
            <div
              key={prize.id}
              className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-900 overflow-hidden shadow-xs transition-all"
            >
              {/* Prize Header / Accordion Click */}
              <div
                onClick={() => setExpandedPrize(isExpanded ? '' : prize.id)}
                className="p-5 sm:p-6 cursor-pointer flex items-start sm:items-center justify-between hover:bg-parchment-100/60 dark:hover:bg-ink-800/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: prize.color || '#b45309' }}
                    />
                    <h3 className="font-serif font-bold text-xl text-parchment-950 dark:text-white">
                      {prize.name}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-parchment-200 dark:bg-ink-800 text-parchment-700 dark:text-ink-300 font-mono">
                      Est. {prize.establishedYear}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-parchment-700 dark:text-ink-400 max-w-2xl">
                    {prize.description}
                  </p>
                </div>

                <div className="flex items-center space-x-3 ml-4">
                  <span className="text-xs text-parchment-600 dark:text-ink-400 hidden sm:inline">
                    {prizeNominations.length} recorded titles
                  </span>
                  <div className={`p-1.5 rounded-full bg-parchment-200 dark:bg-ink-800 text-parchment-700 dark:text-ink-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Expanded Timeline & Details */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-parchment-200 dark:border-ink-800 space-y-6">
                  {/* Prize Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-parchment-700 dark:text-ink-300 bg-parchment-100 dark:bg-ink-950 p-3 rounded-lg">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-parchment-500" />
                      {prize.country}
                    </span>
                    {prize.purse && (
                      <span className="flex items-center font-semibold text-emerald-700 dark:text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                        Prize Purse: {prize.purse}
                      </span>
                    )}
                    <span>
                      Sponsor: <strong>{prize.sponsor}</strong>
                    </span>
                    <a
                      href={prize.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-gilded-600 dark:text-gilded-400 font-medium hover:underline flex items-center"
                    >
                      Official Foundation Site <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>

                  {/* Chronological Timeline */}
                  <div>
                    <h4 className="font-serif font-bold text-sm text-parchment-900 dark:text-parchment-100 mb-3 flex items-center">
                      <Trophy className="w-4 h-4 mr-1.5 text-gilded-500" />
                      Recorded Honors & Timeline
                    </h4>

                    {prizeNominations.length === 0 ? (
                      <p className="text-xs text-parchment-500 italic">No recorded books yet for this prize.</p>
                    ) : (
                      <div className="space-y-2">
                        {prizeNominations.map(({ book, nom }) => (
                          <div
                            key={nom.id}
                            onClick={() => onSelectBook(book)}
                            className="p-3 rounded-lg border border-parchment-200 dark:border-ink-800 bg-parchment-50 dark:bg-ink-900/60 hover:bg-parchment-100 dark:hover:bg-ink-800 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-parchment-200 dark:bg-ink-800 text-parchment-900 dark:text-parchment-100">
                                {nom.year}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  nom.status === 'winner'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                                    : 'bg-parchment-200 text-parchment-800 dark:bg-ink-800 dark:text-ink-300'
                                }`}
                              >
                                {nom.status === 'winner' ? '🏆 Winner' : nom.status === 'finalist' ? '🎖️ Finalist' : '⭐ Shortlist'}
                              </span>
                              <div>
                                <span className="font-serif font-bold text-sm text-parchment-950 dark:text-white">
                                  {book.title}
                                </span>
                                <span className="font-serif italic text-xs text-parchment-600 dark:text-ink-400 ml-2">
                                  by {book.authorName}
                                </span>
                              </div>
                            </div>

                            <div className="text-xs text-parchment-500 dark:text-ink-400 flex items-center justify-between sm:justify-end gap-3">
                              <span>{book.publisher}</span>
                              <span className="text-gilded-600 dark:text-gilded-400 font-medium">Inspect →</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
