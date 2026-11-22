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

function fetchHtml(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(body));
    });
    req.on('error', () => resolve(''));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve('');
    });
  });
}

function isbn10to13(isbn10) {
  const clean = isbn10.replace(/[^0-9X]/gi, '');
  if (clean.length !== 10) return null;
  const core = '978' + clean.slice(0, 9);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(core[i], 10) * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  return core + check;
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
      let isbn13 = null;
      if (doc.isbn && doc.isbn.length > 0) {
        const i13 = doc.isbn.find(i => i.startsWith('978') || i.startsWith('979'));
        if (i13) isbn13 = i13.replace(/[^0-9]/g, '');
        else if (doc.isbn[0]) {
          isbn13 = isbn10to13(doc.isbn[0]);
        }
      }
      let coverUrl = null;
      if (doc.cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg?default=false`;
      }
      return {
        source: 'OpenLibrary',
        title: doc.title,
        isbn13: isbn13,
        coverUrl: coverUrl,
        pageCount: doc.number_of_pages_median,
        key: doc.key
      };
    }
  }
  return null;
}

async function lookupIsbnSearch(title, author) {
  const query = `${title} ${author}`;
  const url = `https://isbnsearch.org/search?s=${encodeURIComponent(query)}`;
  const body = await fetchHtml(url);
  if (!body) return null;

  const normTitle = normalize(title);
  const authorParts = author.trim().split(/\s+/);
  const lastName = normalize(authorParts[authorParts.length - 1]);

  const matches = body.matchAll(/<li[^>]*>[\s\S]*?<div class="bookinfo">[\s\S]*?<h2><a[^>]*>(.*?)<\/a><\/h2>[\s\S]*?<p>Author:\s*(.*?)<\/p>[\s\S]*?<p>ISBN-13:\s*(\d+)<\/p>([\s\S]*?)<\/li>/gi);
  for (const m of matches) {
    const resTitle = m[1].trim();
    const resAuthor = m[2].trim();
    const isbn13 = m[3].trim();
    const imgMatch = m[0].match(/<img src="([^"]+)"/);
    const coverUrl = imgMatch ? imgMatch[1] : null;

    const normResTitle = normalize(resTitle);
    const normResAuthor = normalize(resAuthor);

    const titleMatches = normResTitle.includes(normTitle) || normTitle.includes(normResTitle);
    const authorMatches = normResAuthor.includes(lastName);

    if (titleMatches && authorMatches) {
      return {
        source: 'ISBNsearch',
        title: resTitle,
        isbn13: isbn13,
        coverUrl: coverUrl
      };
    }
  }
  return null;
}

async function lookupBook(title, author) {
  const ol = await lookupOpenLibrary(title, author);
  if (ol && (ol.coverUrl || ol.isbn13)) {
    return ol;
  }
  const isbns = await lookupIsbnSearch(title, author);
  if (isbns) {
    return isbns;
  }
  return null;
}

async function run() {
  const books = JSON.parse(fs.readFileSync(BOOKS_PATH, 'utf8'));
  const targets = books.filter(b => !b.coverImage || !b.isbn13);
  console.log(`Starting catalog enrichment across ${targets.length} books needing cover or ISBN...`);

  let newlyCovered = 0;
  let newlyIsbn = 0;
  let processed = 0;

  // Process with concurrency 5
  let idx = 0;
  async function worker() {
    while (idx < targets.length) {
      const i = idx++;
      const book = targets[i];
      try {
        const res = await lookupBook(book.title, book.authorName);
        if (res) {
          if (!book.coverImage && res.coverUrl) {
            book.coverImage = res.coverUrl;
            newlyCovered++;
          }
          if (!book.isbn13 && res.isbn13) {
            book.isbn13 = res.isbn13;
            newlyIsbn++;
          }
          if (!book.pageCount && res.pageCount) {
            book.pageCount = res.pageCount;
          }
          if (!book.openLibraryKey && res.key) {
            book.openLibraryKey = res.key;
          }
        }
      } catch (err) {
        // continue
      }

      processed++;
      if (processed % 50 === 0 || processed === targets.length) {
        console.log(`Progress: ${processed}/${targets.length} books processed. (New Covers: ${newlyCovered}, New ISBNs: ${newlyIsbn})`);
        fs.writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2) + '\n');
      }

      await new Promise(r => setTimeout(r, 120));
    }
  }

  const workers = Array.from({ length: 5 }, () => worker());
  await Promise.all(workers);

  // Final save
  fs.writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2) + '\n');

  console.log(`\n========================================`);
  console.log(`ENRICHMENT COMPLETE:`);
  console.log(`Total target books processed: ${targets.length}`);
  console.log(`Newly assigned verified covers: ${newlyCovered}`);
  console.log(`Newly assigned verified ISBNs: ${newlyIsbn}`);
  console.log(`========================================`);
}

run();
