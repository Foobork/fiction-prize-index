const fs = require('fs');
const path = require('path');

const booksPath = path.join(__dirname, '../data/books.json');
const nomsPath = path.join(__dirname, '../data/nominations.json');

const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
const noms = JSON.parse(fs.readFileSync(nomsPath, 'utf8'));

const updates = {
  'study-for-obedience': {
    isbn13: '9781803510019',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1803510013.01.LZZZZZZZ.jpg'
  },
  'happy': {
    isbn13: '9781785151149',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1785151142.01.LZZZZZZZ.jpg'
  },
  'crudo': {
    isbn13: '9781509892846',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1509892842.01.LZZZZZZZ.jpg'
  },
  'praiseworthy': {
    isbn13: '9781922725325',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1922725323.01.LZZZZZZZ.jpg'
  },
  'the-catch': {
    isbn13: '9781324092513',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1324092513.01.LZZZZZZZ.jpg'
  },
  'a-new-name-septology-vi-vii': {
    isbn13: '9781913097721',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1913097722.01.LZZZZZZZ.jpg'
  },
  'what-i-d-rather-not-think-about': {
    isbn13: '9781914484711',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1914484711.01.LZZZZZZZ.jpg'
  },
  'the-end-of-drum-time': {
    isbn13: '9781250822901',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1250822904.01.LZZZZZZZ.jpg'
  },
  'a-leopard-skin-hat': {
    isbn13: '9780811234511',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0811234517.01.LZZZZZZZ.jpg'
  },
  'perspective-s': {
    isbn13: '9780374614607',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0374614601.01.LZZZZZZZ.jpg'
  },
  'in-late-summer': {
    isbn13: '9781068740428',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1068740426.01.LZZZZZZZ.jpg'
  },
  'all-my-precious-madness': {
    isbn13: '9781913111724',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1913111725.01.LZZZZZZZ.jpg'
  },
  'holiday': {
    isbn13: '9780099591924',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0099591928.01.LZZZZZZZ.jpg'
  },
  'we-live-here-now': {
    isbn13: '9781685892012',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1685892019.01.LZZZZZZZ.jpg'
  },
  'mrs-eckdorf-in-o-neill-s-hotel': {
    isbn13: '9780241969311',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/024196931X.01.LZZZZZZZ.jpg'
  },
  'peter-smart-s-confessions': {
    isbn13: '9780007264903',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0007264909.01.LZZZZZZZ.jpg'
  },
  'when-we-were-real': {
    isbn13: '9781668060049',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1668060043.01.LZZZZZZZ.jpg'
  },
  'the-light-in-the-piazza-and-other-italian-tales': {
    isbn13: '9780878058372',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0878058370.01.LZZZZZZZ.jpg'
  },
  'live-fast': {
    isbn13: '9780063346734',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0063346737.01.LZZZZZZZ.jpg'
  },
  'the-bridal-canopy': {
    isbn13: '9781592643547',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/159264354X.01.LZZZZZZZ.jpg'
  },
  'rogue-dragon': {
    isbn13: '9781600104916',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/1600104916.01.LZZZZZZZ.jpg'
  },
  'rowspan-2-sylva': {
    newId: 'sylva',
    isbn13: '9782246166627',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/2246166624.01.LZZZZZZZ.jpg'
  },
  'the-body-of-a-young-man': {
    isbn13: '9780803297876',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0803297874.01.LZZZZZZZ.jpg'
  }
};

let booksModified = 0;
for (const book of books) {
  if (updates[book.id]) {
    const u = updates[book.id];
    if (u.newId) {
      for (const nom of noms) {
        if (nom.bookId === book.id) {
          nom.bookId = u.newId;
          nom.id = nom.id.replace(book.id, u.newId);
        }
      }
      book.id = u.newId;
    }
    book.isbn13 = u.isbn13;
    book.coverImage = u.coverImage;
    booksModified++;
    console.log(`Updated: ${book.title} (${book.id}) -> ${u.isbn13}`);
  }
}

fs.writeFileSync(booksPath, JSON.stringify(books, null, 2) + '\n', 'utf8');
fs.writeFileSync(nomsPath, JSON.stringify(noms, null, 2) + '\n', 'utf8');

console.log(`Successfully updated ${booksModified} books and synced nominations.`);
