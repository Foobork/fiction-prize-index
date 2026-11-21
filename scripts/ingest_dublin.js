const fs = require('fs');

const authors = JSON.parse(fs.readFileSync('data/authors.json', 'utf8'));
const books = JSON.parse(fs.readFileSync('data/books.json', 'utf8'));
const nominations = JSON.parse(fs.readFileSync('data/nominations.json', 'utf8'));

const content = fs.readFileSync('wiki_dublin.txt', 'utf8');

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
    .replace(/\{\{N\/A\}\}/gi, '')
    .replace(/\{\{n\/a\}\}/gi, '')
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

const startIdx = content.indexOf('===Winners and shortlists===');
const endIdx = content.indexOf('===Wins by language===');
const section = content.slice(startIdx, endIdx);

const rows = section.split('\n|-');

let currentYear = null;
const shortlists = [];

for (const r of rows) {
  const lines = r.trim().split('\n');
  if (lines.length === 0) continue;

  const yearMatch = r.match(/!\s*(?:rowspan="?\d+"?\s*\|\s*)?(?:\[\[[^\]]*\|)?(19\d{2}|20\d{2})/);
  if (yearMatch) {
    currentYear = parseInt(yearMatch[1], 10);
  }

  const cells = [];
  for (const line of lines) {
    if (line.startsWith('|')) {
      const parts = line.slice(1).split('||');
      for (const p of parts) cells.push(p.trim());
    }
  }

  if (cells.length === 0) continue;

  if (r.includes('Shortlist') || (cells[4] && cells[4].includes('Shortlist')) || (cells[5] && cells[5].includes('Shortlist'))) {
    const author = cleanCell(cells[0]);
    const title = cleanCell(cells[1]);
    const translator = cleanCell(cells[2]);
    const language = cleanCell(cells[3]);
    if (author && title && !title.includes('Title') && currentYear) {
      shortlists.push({ year: currentYear, author, title, translator: translator || undefined, language: language || 'English' });
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
      nationality: 'International',
      bio: `${s.author} was shortlisted for the International Dublin Literary Award in ${s.year} for ${s.title}.`
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
      publicationYear: s.year - 2, // Dublin nomination eligibility spans 2 years prior
      publisher: 'Unknown Publisher',
      genres: ['Literary Fiction'],
      synopsis: `Shortlisted for the ${s.year} International Dublin Literary Award.`,
      countryOfOrigin: 'International'
    };
    if (s.translator) {
      book.translator = s.translator;
      book.genres.push('Translated Fiction');
    }
    if (s.language && s.language !== 'English') {
      book.originalLanguage = s.language;
    }
    books.push(book);
    addedBooks++;
  } else {
    if (s.translator && !book.translator) book.translator = s.translator;
    if (s.language && s.language !== 'English' && !book.originalLanguage) book.originalLanguage = s.language;
  }

  // Check nomination
  const existingNom = nominations.find(n => n.prizeId === 'dublin-literary-award' && n.year === s.year && n.bookId === book.id);
  if (!existingNom) {
    let nomId = `nom-${book.id}-dublin-${s.year}`;
    if (nominations.some(n => n.id === nomId)) {
      nomId = `nom-${book.id}-dla-${s.year}`;
    }
    const nom = {
      id: nomId,
      prizeId: 'dublin-literary-award',
      bookId: book.id,
      year: s.year,
      status: 'shortlist',
      category: 'Best Novel',
      citation: `Shortlisted for the ${s.year} International Dublin Literary Award.`,
      sourceUrl: `https://dublinliteraryaward.ie/the-library/books/`
    };
    if (s.translator) {
      nom.translator = s.translator;
    }
    nominations.push(nom);
    addedNominations++;
  }
}

console.log(`International Dublin Literary Award Ingestion complete:`);
console.log(`- New Authors: ${addedAuthors}`);
console.log(`- New Books: ${addedBooks}`);
console.log(`- New Nominations: ${addedNominations}`);

fs.writeFileSync('data/authors.json', JSON.stringify(authors, null, 2) + '\n');
fs.writeFileSync('data/books.json', JSON.stringify(books, null, 2) + '\n');
fs.writeFileSync('data/nominations.json', JSON.stringify(nominations, null, 2) + '\n');
