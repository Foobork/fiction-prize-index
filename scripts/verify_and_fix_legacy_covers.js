const https = require('https');
const fs = require('fs');
const path = require('path');

const BOOKS_PATH = path.join(__dirname, '../data/books.json');

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function fetchJson(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'FictionPrizeIndex/1.0 (https://github.com)' } }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function lookupOpenLibrary(title, author) {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&fields=title,author_name,cover_i,isbn,key,number_of_pages_median&limit=3`;
  const data = await fetchJson(url);
  if (!data || !data.docs) return null;

  const normTitle = normalize(title);
  const authorParts = author.trim().split(/\s+/);
  const lastName = normalize(authorParts[authorParts.length - 1]);

  for (const doc of data.docs) {
    const normDocTitle = normalize(doc.title);
    const normDocAuthors = (doc.author_name || []).map(normalize).join(' ');

    const titleMatches = normDocTitle.includes(normTitle) || normTitle.includes(normDocTitle) ||
      (normTitle.length >= 6 && normDocTitle.startsWith(normTitle.slice(0, 6)));
    const authorMatches = normDocAuthors.includes(lastName);

    if (titleMatches && authorMatches) {
      let coverUrl = null;
      if (doc.cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg?default=false`;
      }
      return {
        title: doc.title,
        cover_i: doc.cover_i,
        coverUrl: coverUrl,
        isbns: doc.isbn || [],
        key: doc.key
      };
    }
  }
  return null;
}

// Known manual fixes for specific books
const manualFixes = {
  'the-end-of-everything': {
    isbn13: '9781800812949',
    coverImage: 'https://covers.openlibrary.org/b/id/15239006-L.jpg?default=false'
  },
  'holiday': {
    isbn13: '9780099591924'
  }
};

async function run() {
  const books = JSON.parse(fs.readFileSync(BOOKS_PATH, 'utf8'));
  const legacy = books.filter(b => b.coverImage && b.coverImage.includes('/b/isbn/'));
  console.log(`Checking and re-verifying ${legacy.length} legacy books with /b/isbn/ covers...`);

  let updatedCovers = 0;
  let fixedIsbns = 0;
  let strippedBad = 0;

  for (let i = 0; i < legacy.length; i++) {
    const book = legacy[i];

    // Check manual fixes first
    if (manualFixes[book.id]) {
      const fix = manualFixes[book.id];
      if (fix.isbn13) book.isbn13 = fix.isbn13;
      if (fix.coverImage) book.coverImage = fix.coverImage;
      updatedCovers++;
      fixedIsbns++;
      console.log(`[MANUAL FIX] "${book.title}" -> ISBN: ${book.isbn13}`);
      continue;
    }

    const res = await lookupOpenLibrary(book.title, book.authorName);
    if (res) {
      if (res.coverUrl) {
        book.coverImage = res.coverUrl;
        updatedCovers++;
      }
      if (res.key && !book.openLibraryKey) {
        book.openLibraryKey = res.key;
      }
      // Check if current ISBN is in the work's ISBN list
      const cleanCurrent = (book.isbn13 || '').replace(/[^0-9]/g, '');
      const hasCurrent = res.isbns.some(isbn => isbn.replace(/[^0-9]/g, '') === cleanCurrent || (isbn.length === 10 && cleanCurrent.includes(isbn.slice(0, 8))));
      if (!hasCurrent && res.isbns.length > 0) {
        // Find English edition ISBN (typically 9780 or 9781)
        const engIsbn = res.isbns.find(isbn => isbn.startsWith('9780') || isbn.startsWith('9781') || isbn.startsWith('0') || isbn.startsWith('1'));
        if (engIsbn && engIsbn.length === 13) {
          console.log(`[ISBN REPLACED] "${book.title}" | Old: ${book.isbn13} -> New: ${engIsbn}`);
          book.isbn13 = engIsbn;
          fixedIsbns++;
        }
      }
    } else {
      console.log(`[NO MATCH] "${book.title}" by ${book.authorName} - verifying current ISBN...`);
    }

    if ((i + 1) % 50 === 0 || i === legacy.length - 1) {
      console.log(`Progress: ${i + 1}/${legacy.length} (Updated covers: ${updatedCovers}, Fixed ISBNs: ${fixedIsbns})`);
      fs.writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2) + '\n');
    }

    await new Promise(r => setTimeout(r, 100));
  }

  fs.writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2) + '\n');
  console.log(`\nRe-verification complete:`);
  console.log(`- Updated to verified Cover IDs: ${updatedCovers}`);
  console.log(`- Corrected mismatched ISBNs: ${fixedIsbns}`);
}

run();
