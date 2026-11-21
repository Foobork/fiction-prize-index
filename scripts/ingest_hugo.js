const fs = require('fs');

const authors = JSON.parse(fs.readFileSync('data/authors.json', 'utf8'));
const books = JSON.parse(fs.readFileSync('data/books.json', 'utf8'));
const nominations = JSON.parse(fs.readFileSync('data/nominations.json', 'utf8'));

const content = fs.readFileSync('wiki_hugo.txt', 'utf8');

function cleanSortname(str) {
  return str.replace(/\{\{[Ss]ortname\|([^}]+)\}\}/g, (match, body) => {
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
    .replace(/\{\{[Ss]ort\|[^|]+\|(.*?)\}\}/g, '$1')
    .replace(/\{\{small\|(.*?)\}\}/g, '')
    .replace(/<small>.*?<\/small>/gs, '')
    .replace(/\{\{lang\|[^|]+\|(.*?)\}\}/g, '$1')
    .replace(/\{\{[Ff]lag\|([^}]+)\}\}/g, '$1')
    .replace(/\{\{ill\|([^|]+)\|.*?\}\}/g, '$1')
    .replace(/<br\s*\/?>.*/gs, '')
    .replace(/&amp;/g, '&')
    .replace(/style="[^"]*"\s*\|\s*/g, '')
    .replace(/\*+$/, '')
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

const startIdx = content.indexOf('==Winners and finalists==');
const endIdx = content.indexOf('=== Retro-Hugos ===');
const section = content.slice(startIdx, endIdx);

const rows = section.split('\n|-');

let currentYear = null;
const finalists = [];

for (const r of rows) {
  const lines = r.trim().split('\n');
  if (lines.length === 0) continue;

  const yearMatch = r.match(/!\s*(?:scope="rowgroup"|scope="row")?[^|]*\|\s*(?:\[\[[^\]]*\|)?(19\d{2}|20\d{2})/);
  if (yearMatch) {
    currentYear = parseInt(yearMatch[1], 10);
  }

  const isWinner = r.includes('background:lightyellow') || r.includes('background:#FAEB86') || r.includes('*');

  if (!isWinner) {
    const cells = [];
    for (const line of lines) {
      if (line.startsWith('|')) {
        const parts = line.slice(1).split('||');
        for (const p of parts) cells.push(p.trim());
      }
    }
    if (cells.length >= 2 && currentYear) {
      let author = cleanCell(cells[0]);
      let title = cleanCell(cells[1]);
      const publisher = cleanCell(cells[2] || '');
      title = title.replace(/\s*\(also known as.*?\)/i, '').trim();
      // Handle pseudonyms like "Ursula Vernon (as T. Kingfisher)"
      const asMatch = author.match(/^(.*?)\s*\(as\s+([^)]+)\)$/i);
      if (asMatch) {
        author = asMatch[2].trim();
      }
      if (author && title && !title.includes('Novel') && !author.includes('Author')) {
        finalists.push({ year: currentYear, author, title, publisher });
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
      bio: `${f.author} was nominated for the Hugo Award for Best Novel in ${f.year} for ${f.title}.`
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
      publicationYear: f.year - 1, // Hugo awards previous calendar year's publications
      publisher: f.publisher || 'Unknown Publisher',
      genres: ['Science Fiction', 'Speculative'],
      synopsis: `Nominated for the ${f.year} Hugo Award for Best Novel.`,
      countryOfOrigin: 'United States'
    };
    books.push(book);
    addedBooks++;
  }

  // Check nomination
  const existingNom = nominations.find(n => n.prizeId === 'hugo-award-novel' && n.year === f.year && n.bookId === book.id);
  if (!existingNom) {
    let nomId = `nom-${book.id}-hugo-${f.year}`;
    if (nominations.some(n => n.id === nomId)) {
      nomId = `nom-${book.id}-hugof-${f.year}`;
    }
    const nom = {
      id: nomId,
      prizeId: 'hugo-award-novel',
      bookId: book.id,
      year: f.year,
      status: 'finalist',
      category: 'Best Novel',
      citation: `Finalist for the ${f.year} Hugo Award for Best Novel.`,
      sourceUrl: `https://www.thehugoawards.org/hugo-history/${f.year}-hugo-awards/`
    };
    nominations.push(nom);
    addedNominations++;
  }
}

console.log(`Hugo Award Ingestion complete:`);
console.log(`- New Authors: ${addedAuthors}`);
console.log(`- New Books: ${addedBooks}`);
console.log(`- New Nominations: ${addedNominations}`);

fs.writeFileSync('data/authors.json', JSON.stringify(authors, null, 2) + '\n');
fs.writeFileSync('data/books.json', JSON.stringify(books, null, 2) + '\n');
fs.writeFileSync('data/nominations.json', JSON.stringify(nominations, null, 2) + '\n');
