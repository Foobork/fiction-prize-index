'use client';

import React from 'react';
import { UserSavedBook, BookWithNominations, ReadingStatus } from '@/types';
import { exportToMarkdown, exportToCSV } from '@/lib/storage';
import { Bookmark, Download, FileText, Trash2, CheckCircle2, BookOpen, Clock } from 'lucide-react';
import { BookCover } from './BookCover';

interface ReadingListViewProps {
  savedBooks: Record<string, UserSavedBook>;
  allBooks: BookWithNominations[];
  onSelectBook: (book: BookWithNominations) => void;
  onUpdateStatus: (bookId: string, status: ReadingStatus) => void;
  onRemoveStatus: (bookId: string) => void;
}

export const ReadingListView: React.FC<ReadingListViewProps> = ({
  savedBooks,
  allBooks,
  onSelectBook,
  onUpdateStatus,
  onRemoveStatus,
}) => {
  const savedList = Object.values(savedBooks);
  const booksMap = new Map(allBooks.map((b) => [b.id, b]));

  const reading = savedList.filter((s) => s.status === 'reading');
  const wantToRead = savedList.filter((s) => s.status === 'want-to-read');
  const completed = savedList.filter((s) => s.status === 'completed');

  const handleDownloadMarkdown = () => {
    const md = exportToMarkdown(savedList, allBooks);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiction-prize-reading-list-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const csv = exportToCSV(savedList, allBooks);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiction-prize-reading-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl bg-parchment-100 dark:bg-ink-900 border border-parchment-300 dark:border-ink-800">
        <div>
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-gilded-600 dark:text-gilded-400" />
            <h2 className="font-serif font-bold text-2xl text-parchment-950 dark:text-parchment-50">
              My Personal Shelf
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-parchment-700 dark:text-ink-400 mt-1">
            Local-first reading tracker persisted in your browser. {savedList.length} total saved titles.
          </p>
        </div>

        {savedList.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-parchment-50 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-200 dark:hover:bg-ink-700 text-parchment-900 dark:text-parchment-100 transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-gilded-500" />
              <span>Export Markdown</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-parchment-50 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-200 dark:hover:bg-ink-700 text-parchment-900 dark:text-parchment-100 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>Export CSV</span>
            </button>
          </div>
        )}
      </div>

      {savedList.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-parchment-300 dark:border-ink-800 bg-parchment-50/50 dark:bg-ink-900/40">
          <BookOpen className="w-12 h-12 text-parchment-400 dark:text-ink-600 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-parchment-900 dark:text-parchment-100">
            Your personal shelf is empty
          </h3>
          <p className="text-xs text-parchment-600 dark:text-ink-400 max-w-sm mx-auto mt-1">
            Click on any book in the Master Index or Virtual Bookshelf to add it to your "Want to Read", "Currently Reading", or "Completed" shelves.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Currently Reading Section */}
          {reading.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-serif font-bold text-lg">
                <Clock className="w-4 h-4" />
                <h3>Currently Reading ({reading.length})</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reading.map((item) => {
                  const book = booksMap.get(item.bookId);
                  if (!book) return null;
                  return (
                    <SavedBookCard
                      key={item.bookId}
                      book={book}
                      item={item}
                      onSelectBook={onSelectBook}
                      onUpdateStatus={onUpdateStatus}
                      onRemoveStatus={onRemoveStatus}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Want to Read Section */}
          {wantToRead.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-gilded-400 font-serif font-bold text-lg">
                <Bookmark className="w-4 h-4" />
                <h3>Want to Read ({wantToRead.length})</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wantToRead.map((item) => {
                  const book = booksMap.get(item.bookId);
                  if (!book) return null;
                  return (
                    <SavedBookCard
                      key={item.bookId}
                      book={book}
                      item={item}
                      onSelectBook={onSelectBook}
                      onUpdateStatus={onUpdateStatus}
                      onRemoveStatus={onRemoveStatus}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Section */}
          {completed.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-serif font-bold text-lg">
                <CheckCircle2 className="w-4 h-4" />
                <h3>Completed ({completed.length})</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map((item) => {
                  const book = booksMap.get(item.bookId);
                  if (!book) return null;
                  return (
                    <SavedBookCard
                      key={item.bookId}
                      book={book}
                      item={item}
                      onSelectBook={onSelectBook}
                      onUpdateStatus={onUpdateStatus}
                      onRemoveStatus={onRemoveStatus}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SavedBookCard: React.FC<{
  book: BookWithNominations;
  item: UserSavedBook;
  onSelectBook: (book: BookWithNominations) => void;
  onUpdateStatus: (bookId: string, status: ReadingStatus) => void;
  onRemoveStatus: (bookId: string) => void;
}> = ({ book, item, onSelectBook, onUpdateStatus, onRemoveStatus }) => {
  return (
    <div className="p-4 rounded-xl bg-parchment-50 dark:bg-ink-900 border border-parchment-300 dark:border-ink-800 flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-parchment-500">
            Saved {item.savedAt.slice(0, 10)}
          </span>
          <button
            onClick={() => onRemoveStatus(book.id)}
            className="text-parchment-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded"
            title="Remove from shelf"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div onClick={() => onSelectBook(book)} className="cursor-pointer group flex gap-3 items-start">
          <BookCover book={book} size="xs" className="group-hover:scale-105 transition-transform" />
          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-bold text-sm text-parchment-950 dark:text-white group-hover:text-gilded-600 dark:group-hover:text-gilded-400 transition-colors line-clamp-2">
              {book.title}
            </h4>
            <p className="font-serif italic text-xs text-parchment-700 dark:text-parchment-300 mt-0.5 truncate">
              by {book.authorName} ({book.publicationYear})
            </p>
            {book.translator && (
              <p className="font-sans text-[11px] text-purple-700 dark:text-purple-300 truncate mt-0.5">
                trans. {book.translator}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-parchment-200 dark:border-ink-800 flex items-center justify-between text-xs">
        <select
          value={item.status}
          onChange={(e) => onUpdateStatus(book.id, e.target.value as ReadingStatus)}
          className="bg-parchment-100 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 rounded px-2 py-1 text-[11px] text-parchment-900 dark:text-parchment-100"
        >
          <option value="want-to-read">Want to Read</option>
          <option value="reading">Currently Reading</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={() => onSelectBook(book)}
          className="text-gilded-600 dark:text-gilded-400 font-medium text-[11px] hover:underline"
        >
          View Book →
        </button>
      </div>
    </div>
  );
};
