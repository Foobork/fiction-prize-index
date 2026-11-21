const fs = require('fs');
const path = require('path');

const authors = JSON.parse(fs.readFileSync('data/authors.json', 'utf8'));
const books = JSON.parse(fs.readFileSync('data/books.json', 'utf8'));
const nominations = JSON.parse(fs.readFileSync('data/nominations.json', 'utf8'));

const content = fs.readFileSync('wiki_intl_booker.txt', 'utf8');

function cleanCell(c) {
  if (!c) return '';
  return c
    .replace(/<ref[^>]*>.*?<\/ref>/gs, '')
    .replace(/<ref[^>]*\/>/g, '')
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/''+/g, '')
    .replace(/{{small\|(.*?)}}/g, '')
    .replace(/{{lang\|[^|]+\|(.*?)}}/g, '$1')
    .replace(/{{[Ff]lag\|([^}]+)}}/g, '$1')
    .replace(/{{ill\|([^|]+)\|.*?}}/g, '$1')
    .replace(/<br\s*\/?>.*/gs, '')
    .replace(/&amp;/g, '&')
    .replace(/style="[^"]*"\s*\|\s*/g, '')
    .trim();
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

const shortlists = [];

for (let year = 2016; year <= 2026; year++) {
  const startMark = '===' + year + '===';
  const endMark = '===' + (year + 1) + '===';
  const startIdx = content.indexOf(startMark);
  const endIdx = content.indexOf(endMark, startIdx);
  const section = content.slice(startIdx, endIdx !== -1 ? endIdx : undefined);
  
  const lines = section.split('\n');
  const rows = [];
  let curRow = [];
  let inTable = false;
  for (const line of lines) {
    if (line.startsWith('{|')) {
      inTable = true;
      continue;
    }
    if (line.startsWith('|}')) {
      if (curRow.length) rows.push(curRow);
      inTable = false;
      break;
    }
    if (!inTable) continue;
    if (line.startsWith('|-')) {
      if (curRow.length) rows.push(curRow);
      curRow = [];
    } else {
      curRow.push(line);
    }
  }
  if (curRow.length) rows.push(curRow);

  let currentAward = '';
  for (const r of rows) {
    const text = r.join('\n');
    if (text.includes('!Award') || text.includes('!Author')) continue;
    if (text.includes('Winner')) currentAward = 'winner';
    else if (text.includes('Shortlist')) currentAward = 'shortlist';
    else if (text.includes('Longlist')) currentAward = 'longlist';

    if (currentAward === 'shortlist' && !text.includes('Longlist')) {
      const rawCells = [];
      for (const line of r) {
        if (line.startsWith('|')) {
          const parts = line.slice(1).split('||');
          for (const p of parts) rawCells.push(p.trim());
        }
      }
      if (rawCells[0] && rawCells[0].includes('Shortlist')) {
        rawCells.shift();
      }
      if (rawCells.length >= 5) {
        const author = cleanCell(rawCells[0]);
        const country = cleanCell(rawCells[1]);
        const language = cleanCell(rawCells[2]);
        const translator = cleanCell(rawCells[3]);
        const title = cleanCell(rawCells[4]);
        const publisher = cleanCell(rawCells[5] || '');
        shortlists.push({ year, author, country, language, translator, title, publisher });
      }
    }
  }
}

let addedAuthors = 0;
let addedBooks = 0;
let addedNominations = 0;

for (const s of shortlists) {
  // Check if nomination exists for year and prize
  // First match author
  const normAuth = normalizeName(s.author);
  let author = authors.find(a => normalizeName(a.name) === normAuth);
  if (!author) {
    // Generate id
    let baseAuthId = slugify(s.author);
    let authId = baseAuthId;
    let c = 1;
    while (authors.some(a => a.id === authId)) {
      authId = `${baseAuthId}-${++c}`;
    }
    author = {
      id: authId,
      name: s.author,
      nationality: s.country,
      bio: `${s.author} is an acclaimed writer from ${s.country}.`
    };
    authors.push(author);
    addedAuthors++;
  }

  // Match book
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
      publicationYear: s.year - 1,
      publisher: s.publisher || 'Unknown Publisher',
      genres: ['Literary Fiction', 'Translated Fiction'],
      synopsis: `Shortlisted for the ${s.year} International Booker Prize.`,
      countryOfOrigin: s.country,
      translator: s.translator,
      originalLanguage: s.language
    };
    books.push(book);
    addedBooks++;
  } else {
    // Ensure translator and original language are populated if missing
    if (!book.translator && s.translator) book.translator = s.translator;
    if (!book.originalLanguage && s.language) book.originalLanguage = s.language;
  }

  // Check nomination
  const existingNom = nominations.find(n => n.prizeId === 'international-booker' && n.year === s.year && n.bookId === book.id);
  if (!existingNom) {
    let nomId = `nom-${book.id}-intl-booker-${s.year}`;
    if (nominations.some(n => n.id === nomId)) {
      nomId = `nom-${book.id}-ib-${s.year}`;
    }
    const nom = {
      id: nomId,
      prizeId: 'international-booker',
      bookId: book.id,
      year: s.year,
      status: 'shortlist',
      category: 'Translated Fiction',
      citation: `Shortlisted for the ${s.year} International Booker Prize.`,
      sourceUrl: `https://thebookerprizes.com/the-international-booker-prize`,
      translator: s.translator
    };
    nominations.push(nom);
    addedNominations++;
  }
}

console.log(`International Booker Ingestion complete:`);
console.log(`- New Authors: ${addedAuthors}`);
console.log(`- New Books: ${addedBooks}`);
console.log(`- New Nominations: ${addedNominations}`);

fs.writeFileSync('data/authors.json', JSON.stringify(authors, null, 2) + '\n');
fs.writeFileSync('data/books.json', JSON.stringify(books, null, 2) + '\n');
fs.writeFileSync('data/nominations.json', JSON.stringify(nominations, null, 2) + '\n');
