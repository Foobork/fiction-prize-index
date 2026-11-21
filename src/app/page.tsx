'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Trophy, Sparkles, Library } from 'lucide-react';

const VALID_TABS = new Set([
  'index',
  'shelf',
  'prizes',
  'authors',
  'analytics',
  'reading-list',
]);

const DEFAULT_TITLE = 'Fiction Prize Index | Open Catalog of Major Literary Fiction Awards';

function buildNavigationUrl(tab: string, bookId: string | null, genre: string | null = null): string {
  const url = new URL(window.location.href);
  if (tab && tab !== 'index' && VALID_TABS.has(tab)) {
    url.searchParams.set('tab', tab);
  } else {
    url.searchParams.delete('tab');
  }
  if (bookId) {
    url.searchParams.set('book', bookId);
  } else {
    url.searchParams.delete('book');
  }
  if (genre && genre !== 'all') {
    url.searchParams.set('genre', genre);
  } else {
    url.searchParams.delete('genre');
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('index');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookWithNominations | null>(null);
  const [savedBooks, setSavedBooks] = useState<Record<string, UserSavedBook>>({});
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const enrichedBooks = useMemo(() => getEnrichedBooks(), []);
  const booksById = useMemo(
    () => new Map(enrichedBooks.map((book) => [book.id, book])),
    [enrichedBooks]
  );

  // Sync state from current URL query params (?tab=...&book=...&genre=...)
  const syncFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const bookParam = params.get('book');
    const genreParam = params.get('genre');

    setActiveTab(tabParam && VALID_TABS.has(tabParam) ? tabParam : 'index');
    setSelectedBook(bookParam ? booksById.get(bookParam) ?? null : null);
    if (genreParam) {
      setSelectedGenre(genreParam);
    }
  }, [booksById]);

  // Initialize theme, local reading list, deep link state, and popstate listener
  useEffect(() => {
    setSavedBooks(getSavedBooks());

    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);

      syncFromUrl();
      window.addEventListener('popstate', syncFromUrl);
      return () => {
        window.removeEventListener('popstate', syncFromUrl);
      };
    }
  }, [syncFromUrl]);

  // Synchronize darkMode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Keep document title in sync with selected book for browser history & sharing
  useEffect(() => {
    if (selectedBook) {
      document.title = `${selectedBook.title} by ${selectedBook.authorName} | Fiction Prize Index`;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, [selectedBook]);

  const handleSelectTab = useCallback(
    (tab: string) => {
      const normalizedTab = VALID_TABS.has(tab) ? tab : 'index';
      if (normalizedTab === activeTab && !selectedBook) return;

      setActiveTab(normalizedTab);
      setSelectedBook(null);

      if (typeof window !== 'undefined') {
        const nextUrl = buildNavigationUrl(normalizedTab, null);
        window.history.pushState({ tab: normalizedTab, bookId: null }, '', nextUrl);
      }
    },
    [activeTab, selectedBook]
  );

  const handleSelectBook = useCallback(
    (book: BookWithNominations) => {
      setSelectedBook(book);

      if (typeof window !== 'undefined') {
        const nextUrl = buildNavigationUrl(activeTab, book.id);
        window.history.pushState(
          { tab: activeTab, bookId: book.id, inAppBook: true },
          '',
          nextUrl
        );
      }
    },
    [activeTab]
  );

  const handleCloseBook = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.state?.inAppBook) {
      window.history.back();
      return;
    }

    setSelectedBook(null);
    if (typeof window !== 'undefined') {
      const nextUrl = buildNavigationUrl(activeTab, null, selectedGenre);
      window.history.replaceState({ tab: activeTab, bookId: null }, '', nextUrl);
    }
  }, [activeTab, selectedGenre]);

  const handleSelectGenre = useCallback((genre: string) => {
    setSelectedGenre(genre);
    setActiveTab('index');
    setSelectedBook(null);

    if (typeof window !== 'undefined') {
      const nextUrl = buildNavigationUrl('index', null, genre);
      window.history.pushState({ tab: 'index', bookId: null, genre }, '', nextUrl);
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const handleSelectAuthor = useCallback((authorName: string) => {
    setSearchQuery(authorName);
    setSelectedGenre('all');
    setActiveTab('index');
    setSelectedBook(null);

    if (typeof window !== 'undefined') {
      const nextUrl = buildNavigationUrl('index', null, null);
      window.history.pushState({ tab: 'index', bookId: null }, '', nextUrl);
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

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
          setActiveTab={handleSelectTab}
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
                  A static-first, verifiable directory indexing laureates, shortlists, publishers, and citations from the Booker, Pulitzer, National Book Award, Women&apos;s Prize, Hugo, and beyond.
                </p>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleSelectTab('shelf')}
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
                  onClick={() => handleSelectTab('analytics')}
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
              onSelectBook={handleSelectBook}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {activeTab === 'shelf' && (
            <VirtualBookshelf
              books={enrichedBooks}
              onSelectBook={handleSelectBook}
            />
          )}

          {activeTab === 'prizes' && (
            <PrizeDirectory
              prizes={prizes}
              books={enrichedBooks}
              onSelectBook={handleSelectBook}
            />
          )}

          {activeTab === 'authors' && (
            <AuthorDirectory
              authors={authors}
              books={enrichedBooks}
              onSelectBook={handleSelectBook}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              onSelectBook={handleSelectBook}
            />
          )}

          {activeTab === 'reading-list' && (
            <ReadingListView
              savedBooks={savedBooks}
              allBooks={enrichedBooks}
              onSelectBook={handleSelectBook}
              onUpdateStatus={handleUpdateStatus}
              onRemoveStatus={handleRemoveStatus}
            />
          )}
        </main>
      </div>

      {/* Book Inspection Modal */}
      <BookModal
        book={selectedBook}
        onClose={handleCloseBook}
        savedStatus={selectedBook ? savedBooks[selectedBook.id]?.status : undefined}
        onUpdateStatus={handleUpdateStatus}
        onRemoveStatus={handleRemoveStatus}
        onSelectGenre={handleSelectGenre}
        onSelectAuthor={handleSelectAuthor}
      />

      <Footer />
    </div>
  );
}
