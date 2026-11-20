import { UserSavedBook, ReadingStatus, BookWithNominations } from '@/types';

const STORAGE_KEY = 'fiction_prize_index_saved_books';

export function getSavedBooks(): Record<string, UserSavedBook> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load saved books from localStorage', e);
    return {};
  }
}

export function saveBookStatus(bookId: string, status: ReadingStatus, notes?: string): Record<string, UserSavedBook> {
  if (typeof window === 'undefined') return {};
  const current = getSavedBooks();
  current[bookId] = {
    bookId,
    status,
    savedAt: new Date().toISOString(),
    notes: notes ?? current[bookId]?.notes,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
  return current;
}

export function removeSavedBook(bookId: string): Record<string, UserSavedBook> {
  if (typeof window === 'undefined') return {};
  const current = getSavedBooks();
  delete current[bookId];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to remove from localStorage', e);
  }
  return current;
}

export function exportToMarkdown(savedList: UserSavedBook[], allBooks: BookWithNominations[]): string {
  const booksMap = new Map(allBooks.map((b) => [b.id, b]));
  let md = `# My Fiction Prize Reading List\n\nGenerated from the Fiction Prize Index on ${new Date().toLocaleDateString()}.\n\n`;

  const sections: { title: string; status: ReadingStatus }[] = [
    { title: 'Currently Reading', status: 'reading' },
    { title: 'Want to Read', status: 'want-to-read' },
    { title: 'Completed', status: 'completed' },
  ];

  for (const sec of sections) {
    const items = savedList.filter((item) => item.status === sec.status);
    md += `## ${sec.title} (${items.length})\n\n`;
    if (items.length === 0) {
      md += `*No books currently marked as "${sec.title.toLowerCase()}".*\n\n`;
      continue;
    }

    for (const item of items) {
      const book = booksMap.get(item.bookId);
      if (!book) continue;
      const awards = book.nominations.map((n) => `${n.status === 'winner' ? '🏆' : '⭐'} ${n.prize.shortName} (${n.year})`).join(', ');
      md += `- **${book.title}** by ${book.authorName} (${book.publicationYear})\n`;
      md += `  - *Publisher*: ${book.publisher}\n`;
      md += `  - *Honors*: ${awards || 'None'}\n`;
      if (item.notes) {
        md += `  - *Notes*: ${item.notes}\n`;
      }
      md += '\n';
    }
  }

  return md;
}

export function exportToCSV(savedList: UserSavedBook[], allBooks: BookWithNominations[]): string {
  const booksMap = new Map(allBooks.map((b) => [b.id, b]));
  const headers = ['Title', 'Author', 'Publication Year', 'Reading Status', 'Publisher', 'Awards Won', 'Saved Date', 'Notes'];

  const rows = savedList.map((item) => {
    const book = booksMap.get(item.bookId);
    if (!book) return [];
    const wins = book.nominations.filter((n) => n.status === 'winner').map((n) => `${n.prize.shortName} ${n.year}`).join('; ');
    return [
      `"${book.title.replace(/"/g, '""')}"`,
      `"${book.authorName.replace(/"/g, '""')}"`,
      book.publicationYear,
      item.status,
      `"${book.publisher.replace(/"/g, '""')}"`,
      `"${wins}"`,
      item.savedAt.slice(0, 10),
      `"${(item.notes || '').replace(/"/g, '""')}"`,
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
