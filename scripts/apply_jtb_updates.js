const fs = require('fs');
const path = require('path');

const booksPath = path.join(__dirname, '../data/books.json');
const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

const updates = {
  'lote': {
    isbn13: '9781478018728',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1478018720.01.LZZZZZZZ.jpg'
  },
  'attrib-and-other-stories': {
    isbn13: '9781910692271',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1910692271.01.LZZZZZZZ.jpg'
  },
  'you-don-t-have-to-live-like-this': {
    isbn13: '9780571321797',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0571321798.01.LZZZZZZZ.jpg'
  },
  'jouvert': {
    isbn13: '9781786827838',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1786827836.01.LZZZZZZZ.jpg'
  },
  'dance-nation': {
    isbn13: '9781786824837',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1786824837.01.LZZZZZZZ.jpg'
  },
  'lions-and-tigers': {
    isbn13: '9781786821843',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1786821846.01.LZZZZZZZ.jpg'
  },
  'cyprus-avenue': {
    isbn13: '9781474298216',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1474298214.01.LZZZZZZZ.jpg'
  },
  'iphigenia-in-splott': {
    isbn13: '9781783198917',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1783198913.01.LZZZZZZZ.jpg'
  },
  'cannibals': {
    isbn13: '9781472529466',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1472529464.01.LZZZZZZZ.jpg'
  },
  'the-radicalisation-of-bradley-manning': {
    isbn13: '9781408172872',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1408172873.01.LZZZZZZZ.jpg'
  }
};

let modified = 0;
for (const book of books) {
  if (updates[book.id]) {
    const u = updates[book.id];
    book.isbn13 = u.isbn13;
    book.coverImage = u.coverImage;
    modified++;
    console.log(`Updated: ${book.title} (${book.id})`);
  }
}

fs.writeFileSync(booksPath, JSON.stringify(books, null, 2) + '\n', 'utf8');
console.log(`Updated ${modified} books.`);
