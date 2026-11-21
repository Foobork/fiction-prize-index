const fs = require('fs');

const authors = JSON.parse(fs.readFileSync('data/authors.json', 'utf8'));
const books = JSON.parse(fs.readFileSync('data/books.json', 'utf8'));
const nominations = JSON.parse(fs.readFileSync('data/nominations.json', 'utf8'));

const content = fs.readFileSync('wiki_nba.txt', 'utf8');

function cleanSortname(str) {
  return str.replace(/\{\{sortname\|([^}]+)\}\}/g, (match, body) => {
    const parts = body.split('|');
    const paramMap = {};
    const positional = [];
    for (const p of parts) {
      if (p.includes('=')) {
        const [k, v] = p.split('=', 2);
        paramMap[k.trim()] = v.trim();
      } else {
        positional.push(p.trim());
      }
    }
    if (paramMap.first && paramMap.last) {
      return `${paramMap.first} ${paramMap.last}`;
    }
    if (paramMap['1'] && paramMap['2']) {
      return `${paramMap['1']} ${paramMap['2']}`;
    }
    if (positional.length >= 2) {
      return `${positional[0]} ${positional[1]}`;
    }
    return positional[0] || '';
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

const startIdx = content.indexOf('==Honorees, general fiction==');
const endIdx = content.indexOf('== Early awards for fiction ==');
const section = content.slice(startIdx, endIdx);

const rows = section.split('\n|-');

let currentYear = null;
const finalists = [];

for (const r of rows) {
  const lines = r.trim().split('\n');
  if (lines.length === 0) continue;

  const yearMatch = r.match(/!\s*(?:rowspan="?\d+"?\s*\|\s*)?(?:\[\[[^\]]*\|)?(19\d{2}|20\d{2})/);
  if (yearMatch) {
    currentYear = parseInt(yearMatch[1], 10);
  }

  if (r.includes('Finalist')) {
    const cells = [];
    for (const line of lines) {
      if (line.startsWith('|')) {
        const parts = line.slice(1).split('||');
        for (const p of parts) cells.push(p.trim());
      }
    }
    let author = '';
    let title = '';
    if (cells.length >= 3) {
      if (currentYear >= 1980 && currentYear <= 1983 && cells.length >= 4) {
        author = cleanCell(cells[1]);
        title = cleanCell(cells[2]);
      } else {
        author = cleanCell(cells[0]);
        title = cleanCell(cells[1]);
      }
      if (author && title && !title.includes('Title') && currentYear) {
        finalists.push({ year: currentYear, author, title });
      }
    }
  }
}

let addedAuthors = 0;
let addedBooks = 0;
let addedNominations = 0;

for (const f of finalists) {
  const normAuth = normalizeName(f.author);
  let author = authors.find(a => normalizeName(a.name) === normAuth);
  if (!author) {
    let baseAuthId = slugify(f.author);
    let authId = baseAuthId;
    let c = 1;
    while (authors.some(a => a.id === authId)) {
      authId = `${baseAuthId}-${++c}`;
    }
    author = {
      id: authId,
      name: f.author,
      nationality: 'American',
      bio: `${f.author} was a finalist for the National Book Award for Fiction in ${f.year} for ${f.title}.`
    };
    authors.push(author);
    addedAuthors++;
  }

  const normT = normalizeTitle(f.title);
  let book = books.find(b => normalizeTitle(b.title) === normT || (b.authorId === author.id && normalizeTitle(b.title).includes(normT)));
  if (!book) {
    let baseBookId = slugify(f.title);
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
      title: f.title,
      authorId: author.id,
      authorName: author.name,
      publicationYear: f.year - 1, // NBA awards previous calendar year publications
      publisher: 'Unknown Publisher',
      genres: ['Literary Fiction'],
      synopsis: `Finalist for the ${f.year} National Book Award for Fiction.`,
      countryOfOrigin: 'United States'
    };
    books.push(book);
    addedBooks++;
  }

  // Check nomination
  const existingNom = nominations.find(n => n.prizeId === 'national-book-award' && n.year === f.year && n.bookId === book.id);
  if (!existingNom) {
    let nomId = `nom-${book.id}-nba-${f.year}`;
    if (nominations.some(n => n.id === nomId)) {
      nomId = `nom-${book.id}-nbaf-${f.year}`;
    }
    const nom = {
      id: nomId,
      prizeId: 'national-book-award',
      bookId: book.id,
      year: f.year,
      status: 'finalist',
      category: 'Fiction',
      citation: `Finalist for the ${f.year} National Book Award for Fiction.`,
      sourceUrl: `https://www.nationalbook.org/awards-prizes/national-book-awards-${f.year}/`
    };
    nominations.push(nom);
    addedNominations++;
  }
}

console.log(`National Book Award Ingestion complete:`);
console.log(`- New Authors: ${addedAuthors}`);
console.log(`- New Books: ${addedBooks}`);
console.log(`- New Nominations: ${addedNominations}`);

fs.writeFileSync('data/authors.json', JSON.stringify(authors, null, 2) + '\n');
fs.writeFileSync('data/books.json', JSON.stringify(books, null, 2) + '\n');
fs.writeFileSync('data/nominations.json', JSON.stringify(nominations, null, 2) + '\n');
