const fs = require('fs');

const authors = JSON.parse(fs.readFileSync('data/authors.json', 'utf8'));
const books = JSON.parse(fs.readFileSync('data/books.json', 'utf8'));
const nominations = JSON.parse(fs.readFileSync('data/nominations.json', 'utf8'));

const content = fs.readFileSync('wiki_booker_shortlists.txt', 'utf8');

function cleanSortname(str) {
  return str.replace(/\{\{sortname\|([^|}]+)\|([^|}]+)(?:\|link=([^|}]+))?\}\}/g, (match, p1, p2, p3) => {
    if (p1.includes('=')) {
      const mFirst = str.match(/first=([^|}]+)/);
      const mLast = str.match(/last=([^|}]+)/);
      if (mFirst && mLast) return `${mFirst[1].trim()} ${mLast[1].trim()}`;
    }
    return `${p1.trim()} ${p2.trim()}`;
  });
}

function cleanCell(c) {
  if (!c) return '';
  let s = c;
  s = cleanSortname(s);
  s = s
    .replace(/<ref[^>]*>.*?<\/ref>/gs, '')
    .replace(/<ref[^>]*\/>/g, '')
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/''+/g, '')
    .replace(/{{sort\|[^|]+\|(.*?)}}/g, '$1')
    .replace(/{{small\|(.*?)}}/g, '')
    .replace(/{{lang\|[^|]+\|(.*?)}}/g, '$1')
    .replace(/{{[Ff]lag\|([^}]+)}}/g, '$1')
    .replace(/{{ill\|([^|]+)\|.*?}}/g, '$1')
    .replace(/<br\s*\/?>.*/gs, '')
    .replace(/&amp;/g, '&')
    .replace(/style="[^"]*"\s*\|\s*/g, '')
    .trim();
  return s;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeTitle(t) {
  return t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function normalizeName(n) {
  return n
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

const startIdx = content.indexOf('== Winners, shortlists and longlists ==');
const endIdx = content.indexOf('== Writers with multiple awards ==');
const tableContent = content.slice(startIdx, endIdx);

const rows = tableContent.split('\n|-');

let currentYear = null;
let currentAward = '';
let isLostBooker = false;
const shortlists = [];

for (const r of rows) {
  const lines = r.trim().split('\n');
  if (lines.length === 0) continue;
  
  const yearMatch = r.match(/!\s*(?:rowspan="?\d+"?\s*\|\s*)?(?:\[\[[^\]]*\|)?(19\d{2}|20\d{2})/);
  if (yearMatch) {
    currentYear = parseInt(yearMatch[1], 10);
    isLostBooker = r.includes('Lost Man Booker Prize');
  }

  if (r.includes('Winner')) {
    currentAward = 'winner';
  } else if (r.includes('Shortlist')) {
    currentAward = 'shortlist';
  } else if (r.includes('Longlist')) {
    currentAward = 'longlist';
  }

  if (currentAward === 'shortlist' && !r.includes('Longlist')) {
    const cells = [];
    for (const line of lines) {
      if (line.startsWith('|')) {
        const parts = line.slice(1).split('||');
        for (const p of parts) cells.push(p.trim());
      }
    }
    if (cells[0] && cells[0].includes('Shortlist')) {
      cells.shift();
    }
    if (cells.length >= 2 && currentYear) {
      const author = cleanCell(cells[0]);
      const title = cleanCell(cells[1]);
      const publisher = cleanCell(cells[2] || '');
      if (author && title && !title.includes('Title')) {
        shortlists.push({ year: currentYear, author, title, publisher, isLostBooker });
      }
    }
  }
}

let addedAuthors = 0;
let addedBooks = 0;
let addedNominations = 0;

for (const s of shortlists) {
  const normAuth = normalizeName(s.author);
  let author = authors.find(a => normalizeName(a.name) === normAuth);
  if (!author) {
    let baseAuthId = slugify(s.author);
    let authId = baseAuthId;
    let c = 1;
    while (authors.some(a => a.id === authId)) {
      authId = `${baseAuthId}-${++c}`;
    }
    author = {
      id: authId,
      name: s.author,
      nationality: 'British',
      bio: `${s.author} was shortlisted for the Booker Prize in ${s.year} for ${s.title}.`
    };
    authors.push(author);
    addedAuthors++;
  }

  const normT = normalizeTitle(s.title);
  let book = books.find(b => normalizeTitle(b.title) === normT || (b.authorId === author.id && normalizeTitle(b.title).includes(normT)));
  if (!book) {
    let baseBookId = slugify(s.title);
    let bookId = baseBookId;
    let c = 1;
    while (books.some(b => b.id === bookId)) {
      bookId = `${baseBookId}-${author.id.split('-').pop()}`;
      if (books.some(b => b.id === bookId)) {
        bookId = `${baseBookId}-${++c}`;
      }
    }
    book = {
      id: bookId,
      title: s.title,
      authorId: author.id,
      authorName: author.name,
      publicationYear: s.year,
      publisher: s.publisher || 'Unknown Publisher',
      genres: ['Literary Fiction'],
      synopsis: `Shortlisted for the ${s.year} Booker Prize.`,
      countryOfOrigin: 'United Kingdom'
    };
    books.push(book);
    addedBooks++;
  }

  // Check nomination
  const existingNom = nominations.find(n => n.prizeId === 'booker-prize' && n.year === s.year && n.bookId === book.id);
  if (!existingNom) {
    let nomId = `nom-${book.id}-booker-${s.year}`;
    if (nominations.some(n => n.id === nomId)) {
      nomId = `nom-${book.id}-bp-${s.year}`;
    }
    const nom = {
      id: nomId,
      prizeId: 'booker-prize',
      bookId: book.id,
      year: s.year,
      status: 'shortlist',
      category: s.isLostBooker ? 'Lost Man Booker Prize' : 'Best Novel',
      citation: `Shortlisted for the ${s.year} Booker Prize.`,
      sourceUrl: `https://thebookerprizes.com/the-booker-library/books/${book.id}`
    };
    nominations.push(nom);
    addedNominations++;
  }
}

console.log(`The Booker Prize Ingestion complete:`);
console.log(`- New Authors: ${addedAuthors}`);
console.log(`- New Books: ${addedBooks}`);
console.log(`- New Nominations: ${addedNominations}`);

fs.writeFileSync('data/authors.json', JSON.stringify(authors, null, 2) + '\n');
fs.writeFileSync('data/books.json', JSON.stringify(books, null, 2) + '\n');
fs.writeFileSync('data/nominations.json', JSON.stringify(nominations, null, 2) + '\n');
