'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { IndexTable } from '@/components/IndexTable';
import { VirtualBookshelf } from '@/components/VirtualBookshelf';
import { PrizeDirectory } from '@/components/PrizeDirectory';
import { AuthorDirectory } from '@/components/AuthorDirectory';
import { AnalyticsView } from '@/components/AnalyticsView';
import { ReadingListView } from '@/components/ReadingListView';
import { BookModal } from '@/components/BookModal';
import { prizes, authors, getEnrichedBooks } from '@/lib/data';
import { getSavedBooks, saveBookStatus, removeSavedBook } from '@/lib/storage';
import { BookWithNominations, ReadingStatus, UserSavedBook } from '@/types';
import { BookOpen, Trophy, Sparkles, Library, Layers } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('index');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookWithNominations | null>(null);
  const [savedBooks, setSavedBooks] = useState<Record<string, UserSavedBook>>({});

  const enrichedBooks = useMemo(() => getEnrichedBooks(), []);

  // Initialize theme & local reading list
  useEffect(() => {
    setSavedBooks(getSavedBooks());

    // Check system preference for dark mode
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Synchronize darkMode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleUpdateStatus = (bookId: string, status: ReadingStatus) => {
    const updated = saveBookStatus(bookId, status);
    setSavedBooks({ ...updated });
  };

  const handleRemoveStatus = (bookId: string) => {
    const updated = removeSavedBook(bookId);
    setSavedBooks({ ...updated });
  };

  const savedCount = Object.keys(savedBooks).length;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedCount={savedCount}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Hero Banner (Only shown on index / shelf / initial visit) */}
        {(activeTab === 'index' || activeTab === 'shelf') && (
          <section className="relative overflow-hidden bg-gradient-to-b from-parchment-200/50 to-parchment-50 dark:from-ink-900/60 dark:to-ink-950 border-b border-parchment-300 dark:border-ink-800 py-10 sm:py-14 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-300/80 dark:border-amber-700/60">
                  <Sparkles className="w-3.5 h-3.5 text-gilded-600" />
                  <span>The Curated Public Index of World-Class Fiction</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-parchment-950 dark:text-white leading-tight">
                  Fiction Prize Index
                </h1>
                <p className="text-sm sm:text-base text-parchment-700 dark:text-ink-300 leading-relaxed">
                  A static-first, verifiable directory indexing laureates, shortlists, publishers, and citations from the Booker, Pulitzer, National Book Award, Women's Prize, Hugo, and beyond.
                </p>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('shelf')}
                  className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                    activeTab === 'shelf'
                      ? 'bg-parchment-800 text-white dark:bg-gilded-500 dark:text-ink-950'
                      : 'bg-parchment-100 dark:bg-ink-800 hover:bg-parchment-200 text-parchment-900 dark:text-parchment-100 border border-parchment-300 dark:border-ink-700'
                  }`}
                >
                  <Library className="w-4 h-4 text-gilded-500" />
                  <span>Virtual Bookshelf Simulator</span>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-parchment-100 dark:bg-ink-800 hover:bg-parchment-200 text-parchment-900 dark:text-parchment-100 border border-parchment-300 dark:border-ink-700 transition-all shadow-xs"
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Cross-Prize Overlap Insights</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {activeTab === 'index' && (
            <IndexTable
              books={enrichedBooks}
              prizes={prizes}
              onSelectBook={(book) => setSelectedBook(book)}
            />
          )}

          {activeTab === 'shelf' && (
            <VirtualBookshelf
              books={enrichedBooks}
              onSelectBook={(book) => setSelectedBook(book)}
            />
          )}

          {activeTab === 'prizes' && (
            <PrizeDirectory
              prizes={prizes}
              books={enrichedBooks}
              onSelectBook={(book) => setSelectedBook(book)}
            />
          )}

          {activeTab === 'authors' && (
            <AuthorDirectory
              authors={authors}
              books={enrichedBooks}
              onSelectBook={(book) => setSelectedBook(book)}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              onSelectBook={(book) => setSelectedBook(book)}
            />
          )}

          {activeTab === 'reading-list' && (
            <ReadingListView
              savedBooks={savedBooks}
              allBooks={enrichedBooks}
              onSelectBook={(book) => setSelectedBook(book)}
              onUpdateStatus={handleUpdateStatus}
              onRemoveStatus={handleRemoveStatus}
            />
          )}
        </main>
      </div>

      {/* Book Inspection Modal */}
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        savedStatus={selectedBook ? savedBooks[selectedBook.id]?.status : undefined}
        onUpdateStatus={handleUpdateStatus}
        onRemoveStatus={handleRemoveStatus}
      />

      <Footer />
    </div>
  );
}
