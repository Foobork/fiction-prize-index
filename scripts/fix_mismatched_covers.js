const fs = require('fs');

const books = JSON.parse(fs.readFileSync('data/books.json', 'utf8'));
const mismatches = JSON.parse(fs.readFileSync('scripts/mismatches.json', 'utf8'));

const mismatchMap = new Map();
mismatches.forEach(m => mismatchMap.set(m.id, m));

// Curated verified correct ISBN-13s for prominent winners/shortlists that had wrong ISBNs
const verifiedIsbns = {
  'the-things-we-never-say': '9780241814307',
  'the-disappearers': '9780593717202',
  'marzahn-mon-amour': '9781908670694',
  'bring-up-the-bodies': '9780805090031',
  'the-inheritance-of-loss': '9780802142818',
  'the-gathering': '9780802143945',
  'the-discomfort-of-evening': '9781644450345',
  'at-night-all-blood-is-black': '9780374154134',
  'how-late-it-was-how-late': '9780436202490',
  'paddy-clarke-ha-ha-ha': '9780436201332',
  'the-bone-people': '9780807111307',
  'hotel-du-lac': '9780394542157',
  'amsterdam': '9780385494236',
  'staying-on': '9780434681129',
  'offshore': '9780006543596',
  'g': '9780670333424',
  'creation-lake': '9781668046425',
  'not-a-river': '9781913505967',
  'brotherless-night': '9781982186982',
  'the-trees': '9781644450635',
  'washington-black': '9780525521426',
  'an-orchestra-of-minorities': '9780316415415',
  'the-shadow-king': '9780393079418',
  'everything-under': '9781984820709',
  'nw': '9781594203978',
  'we-need-to-talk-about-kevin': '9781844080465',
  'may-we-be-forgiven': '9780670025435',
  'the-glorious-heresies': '9781473612266',
  'the-silence-of-the-girls': '9780385545990',
  'a-thousand-ships': '9781529014037',
  'the-paying-guests': '9781594633119',
  'outline': '9780374228347',
  'stay-with-me': '9780451494603'
};

let strippedCount = 0;
let replacedCount = 0;

for (const book of books) {
  if (mismatchMap.has(book.id)) {
    const verified = verifiedIsbns[book.id];
    if (verified) {
      book.isbn13 = verified;
      book.coverImage = `https://covers.openlibrary.org/b/isbn/${verified}-L.jpg?default=false`;
      replacedCount++;
    } else {
      // Strip bad isbn13 and bad coverImage so it renders the clean typographic fallback
      delete book.isbn13;
      delete book.coverImage;
      delete book.openLibraryKey;
      strippedCount++;
    }
  }
}

// Also ensure marzahn-mon-amour has the correct ISBN
const marzahn = books.find(b => b.id === 'marzahn-mon-amour');
if (marzahn) {
  marzahn.isbn13 = '9781908670694';
  delete marzahn.coverImage; // Open Library returns 404 for this edition, so typographic dust jacket will render cleanly
}

console.log(`Cleansed ${mismatchMap.size} mismatched books:`);
console.log(`- ${replacedCount} books updated with verified correct ISBN-13`);
console.log(`- ${strippedCount} books stripped of erroneous ISBNs/covers (rendering clean typographic dust jackets)`);

fs.writeFileSync('data/books.json', JSON.stringify(books, null, 2) + '\n');
