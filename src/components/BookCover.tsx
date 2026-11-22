'use client';

import React, { useState } from 'react';
import { Book, BookWithNominations } from '@/types';
import { Award, BookOpen } from 'lucide-react';

interface BookCoverProps {
  book: Book | BookWithNominations;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showHonorsBadge?: boolean;
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  book,
  size = 'md',
  showHonorsBadge = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Dimension presets (standard 2:3 book ratio)
  const sizeStyles = {
    xs: 'w-10 h-15 text-[8px]',
    sm: 'w-16 h-24 text-[10px]',
    md: 'w-24 h-36 text-xs',
    lg: 'w-44 h-64 text-sm',
    xl: 'w-52 h-76 text-base',
  };

  const coverUrl = book.coverImage || null;

  const hasWinner = 'nominations' in book && book.nominations.some((n) => n.status === 'winner');

  return (
    <div
      className={`relative flex-shrink-0 select-none overflow-hidden rounded-r-md rounded-l-xs shadow-md group-hover:shadow-xl transition-all duration-300 ${sizeStyles[size]} ${className}`}
      style={{
        backgroundColor: book.spineColor || '#78350f',
      }}
    >
      {/* 3D Spine Crease / Lighting Overlay */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-black/40 via-white/10 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[3%] bg-gradient-to-l from-black/25 to-transparent z-10" />

      {/* Actual Cover Image */}
      {coverUrl && !imageError ? (
        <>
          <img
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
          {/* Subtle sheen highlight over real image */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
        </>
      ) : (
        /* Typographic Dust Jacket Fallback (Rendered when image is unavailable or fails to load) */
        <div
          className="absolute inset-0 p-2 sm:p-2.5 flex flex-col justify-between text-white border border-white/20"
          style={{ backgroundColor: book.spineColor || '#78350f' }}
        >
          {/* Decorative Framing */}
          <div className="border border-white/30 h-full w-full p-1.5 flex flex-col justify-between rounded-xs">
            {/* Header / Year */}
            <div className="text-[9px] uppercase tracking-wider text-white/80 font-mono text-center truncate">
              {book.publicationYear}
            </div>

            {/* Title & Author */}
            <div className="text-center my-auto px-0.5 space-y-0.5">
              <h4 className="font-serif font-bold text-white leading-tight drop-shadow-xs line-clamp-3">
                {book.title}
              </h4>
              <p className="font-serif italic text-white/85 text-[10px] leading-tight truncate">
                {book.authorName}
              </p>
              {book.translator && (
                <p className="font-sans text-white/75 text-[8px] leading-tight truncate">
                  trans. {book.translator}
                </p>
              )}
            </div>

            {/* Foil Seal / Publisher */}
            <div className="text-center pt-1 border-t border-white/20">
              <span className="text-[8px] font-sans text-white/75 truncate block uppercase tracking-tight">
                {book.publisher}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Honors Badge */}
      {showHonorsBadge && (
        <div className="absolute top-1 right-1 z-20">
          <span
            className={`inline-flex items-center justify-center p-1 rounded-full shadow-md text-[9px] font-bold ${
              hasWinner
                ? 'bg-amber-400 text-amber-950 ring-1 ring-amber-600'
                : 'bg-parchment-100 text-parchment-900 ring-1 ring-parchment-300'
            }`}
            title={hasWinner ? 'Award Winner' : 'Shortlisted / Finalist'}
          >
            {hasWinner ? '🏆' : '⭐'}
          </span>
        </div>
      )}
    </div>
  );
};
