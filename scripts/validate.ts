import * as fs from 'fs';
import * as path from 'path';

interface Prize {
  id: string;
  name: string;
  shortName: string;
  establishedYear: number;
  country: string;
  websiteUrl: string;
  category: string;
}

interface Author {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  publicationYear: number;
  publisher: string;
  genres: string[];
  synopsis: string;
}

interface Nomination {
  id: string;
  prizeId: string;
  bookId: string;
  year: number;
  status: string;
  sourceUrl: string;
}

function loadJson<T>(relPath: string): T {
  const fullPath = path.join(process.cwd(), relPath);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(raw) as T;
}

function validateDataset() {
  console.log('🔍 Validating Fiction Prize Index datasets...');
  let errors: string[] = [];

  const prizes = loadJson<Prize[]>('data/prizes.json');
  const authors = loadJson<Author[]>('data/authors.json');
  const books = loadJson<Book[]>('data/books.json');
  const nominations = loadJson<Nomination[]>('data/nominations.json');

  const prizeIds = new Set(prizes.map((p) => p.id));
  const authorIds = new Set(authors.map((a) => a.id));
  const bookIds = new Set(books.map((b) => b.id));
  const nominationIds = new Set<string>();

  // Check duplicate prize IDs
  if (prizeIds.size !== prizes.length) {
    errors.push('Duplicate prize IDs detected in data/prizes.json');
  }

  // Check duplicate author IDs
  if (authorIds.size !== authors.length) {
    errors.push('Duplicate author IDs detected in data/authors.json');
  }

  // Check duplicate book IDs
  if (bookIds.size !== books.length) {
    errors.push('Duplicate book IDs detected in data/books.json');
  }

  // Validate books -> authors
  for (const book of books) {
    if (!book.id || !book.title || !book.authorId || !book.publicationYear) {
      errors.push(`Book "${book.title || book.id}" is missing required fields.`);
    }
    if (!authorIds.has(book.authorId)) {
      errors.push(`Book "${book.title}" references missing author ID: "${book.authorId}".`);
    }
  }

  // Validate nominations
  for (const nom of nominations) {
    if (nominationIds.has(nom.id)) {
      errors.push(`Duplicate nomination ID detected: "${nom.id}".`);
    }
    nominationIds.add(nom.id);

    if (!prizeIds.has(nom.prizeId)) {
      errors.push(`Nomination "${nom.id}" references missing prize ID: "${nom.prizeId}".`);
    }
    if (!bookIds.has(nom.bookId)) {
      errors.push(`Nomination "${nom.id}" references missing book ID: "${nom.bookId}".`);
    }
    if (!['winner', 'shortlist', 'longlist', 'finalist'].includes(nom.status)) {
      errors.push(`Nomination "${nom.id}" has invalid status: "${nom.status}".`);
    }
    if (!nom.sourceUrl || !nom.sourceUrl.startsWith('http')) {
      errors.push(`Nomination "${nom.id}" is missing a valid HTTP sourceUrl.`);
    }
  }

  if (errors.length > 0) {
    console.error(`❌ Validation failed with ${errors.length} error(s):`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log('✅ All datasets validated successfully!');
  console.log(`📊 Index Summary:`);
  console.log(`   - Total Prizes:      ${prizes.length}`);
  console.log(`   - Total Authors:     ${authors.length}`);
  console.log(`   - Total Books:       ${books.length}`);
  console.log(`   - Total Nominations: ${nominations.length}`);
}

validateDataset();
