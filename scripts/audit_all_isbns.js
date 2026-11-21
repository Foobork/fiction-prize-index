const fs = require('fs');
const https = require('https');

const books = JSON.parse(fs.readFileSync('data/books.json', 'utf8'));
const withIsbn = books.filter(b => b.isbn13);

function getWithRedirect(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let nextUrl = res.headers.location;
        if (nextUrl.startsWith('/')) nextUrl = 'https://openlibrary.org' + nextUrl;
        getWithRedirect(nextUrl).then(resolve).catch(reject);
      } else {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    }).on('error', reject);
  });
}

function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
  console.log(`Starting comprehensive audit of all ${withIsbn.length} books with ISBNs...`);
  
  const mismatches = [];
  const valid = [];
  const notFound = [];
  
  // Concurrency limit of 5
  let index = 0;
  async function worker() {
    while (index < withIsbn.length) {
      const i = index++;
      const b = withIsbn[i];
      try {
        const res = await getWithRedirect(`https://openlibrary.org/isbn/${b.isbn13}.json`);
        if (res.status === 200) {
          const data = JSON.parse(res.body);
          const olTitle = data.title || '';
          const normBookTitle = normalize(b.title);
          const normOlTitle = normalize(olTitle);
          
          const isMatch = normOlTitle.includes(normBookTitle) || normBookTitle.includes(normOlTitle) ||
            // check first 4 letters or major words
            normBookTitle.slice(0, 8) === normOlTitle.slice(0, 8);

          if (!isMatch) {
            mismatches.push({
              id: b.id,
              title: b.title,
              author: b.authorName,
              isbn13: b.isbn13,
              olTitle: olTitle
            });
            console.log(`[MISMATCH ${mismatches.length}] "${b.title}" != "${olTitle}" (ISBN: ${b.isbn13})`);
          } else {
            valid.push(b.id);
          }
        } else {
          notFound.push({ id: b.id, title: b.title, isbn13: b.isbn13 });
        }
      } catch (err) {
        // error
      }
      if (i % 50 === 0) {
        console.log(`Processed ${i}/${withIsbn.length}...`);
      }
    }
  }

  const workers = Array.from({ length: 5 }, () => worker());
  await Promise.all(workers);

  console.log(`\n========================================`);
  console.log(`AUDIT FINISHED:`);
  console.log(`Total checked: ${withIsbn.length}`);
  console.log(`Confirmed Valid: ${valid.length}`);
  console.log(`404 Not Found on OL: ${notFound.length}`);
  console.log(`Mismatched ISBNs: ${mismatches.length}`);
  console.log(`========================================`);

  fs.writeFileSync('scripts/mismatches.json', JSON.stringify(mismatches, null, 2));
}

run();
