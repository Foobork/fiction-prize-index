import prizesData from '../../data/prizes.json';
import authorsData from '../../data/authors.json';
import booksData from '../../data/books.json';
import nominationsData from '../../data/nominations.json';
import { Prize, Author, Book, Nomination, BookWithNominations } from '@/types';

export const prizes: Prize[] = prizesData as Prize[];
export const authors: Author[] = authorsData as Author[];
export const books: Book[] = booksData as Book[];
export const nominations: Nomination[] = nominationsData as Nomination[];

const prizeMap = new Map<string, Prize>(prizes.map((p) => [p.id, p]));
const authorMap = new Map<string, Author>(authors.map((a) => [a.id, a]));

export function getEnrichedBooks(): BookWithNominations[] {
  const booksMap = new Map<string, BookWithNominations>();

  for (const book of books) {
    booksMap.set(book.id, {
      ...book,
      nominations: [],
      totalWins: 0,
      totalNominations: 0,
    });
  }

  for (const nom of nominations) {
    const book = booksMap.get(nom.bookId);
    const prize = prizeMap.get(nom.prizeId);

    if (book && prize) {
      book.nominations.push({
        ...nom,
        prize,
      });
      book.totalNominations += 1;
      if (nom.status === 'winner') {
        book.totalWins += 1;
      }
    }
  }

  return Array.from(booksMap.values());
}

export function getAnalytics() {
  const enriched = getEnrichedBooks();

  // Multi-award winners (books with >1 win or nomination across different major prizes)
  const crossPrizeBooks = enriched.filter((b) => b.nominations.length > 1);

  // Author statistics
  const authorWinCounts: Record<string, { author: Author; wins: number; noms: number; books: string[] }> = {};
  for (const book of enriched) {
    const author = authorMap.get(book.authorId) || { id: book.authorId, name: book.authorName };
    if (!authorWinCounts[author.id]) {
      authorWinCounts[author.id] = { author, wins: 0, noms: 0, books: [] };
    }
    authorWinCounts[author.id].wins += book.totalWins;
    authorWinCounts[author.id].noms += book.totalNominations;
    authorWinCounts[author.id].books.push(book.title);
  }

  const topAuthors = Object.values(authorWinCounts)
    .filter((a) => a.noms > 0)
    .sort((a, b) => b.wins - a.wins || b.noms - a.noms);

  // Publisher breakdown
  const publisherCounts: Record<string, number> = {};
  for (const book of enriched) {
    const pub = book.imprint ? `${book.publisher} (${book.imprint})` : book.publisher;
    publisherCounts[pub] = (publisherCounts[pub] || 0) + 1;
  }
  const topPublishers = Object.entries(publisherCounts)
    .map(([publisher, count]) => ({ publisher, count }))
    .sort((a, b) => b.count - a.count);

  // Decade / Year distribution
  const yearCounts: Record<number, number> = {};
  for (const nom of nominations) {
    yearCounts[nom.year] = (yearCounts[nom.year] || 0) + 1;
  }

  // Genre frequency
  const genreCounts: Record<string, number> = {};
  for (const book of books) {
    for (const g of book.genres) {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    }
  }
  const topGenres = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalBooks: books.length,
    totalPrizes: prizes.length,
    totalAuthors: authors.length,
    totalNominations: nominations.length,
    crossPrizeBooks,
    topAuthors,
    topPublishers,
    topGenres,
    yearCounts,
  };
}
