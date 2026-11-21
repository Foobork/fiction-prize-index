const fs = require('fs');
const https = require('https');

const books = JSON.parse(fs.readFileSync('data/books.json', 'utf8'));

// Find books with isbn13
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

async function audit() {
  // Let's audit books with publicationYear >= 2024 first
  const targets = withIsbn.filter(b => b.publicationYear >= 2023);
  console.log(`Auditing ${targets.length} books from 2023-2026 with ISBN...`);

  const mismatches = [];

  for (const b of targets) {
    try {
      const res = await getWithRedirect(`https://openlibrary.org/isbn/${b.isbn13}.json`);
      if (res.status === 200) {
        const data = JSON.parse(res.body);
        const olTitle = data.title;
        const normBookTitle = normalize(b.title);
        const normOlTitle = normalize(olTitle);
        
        // Check if normBookTitle is contained in normOlTitle or vice-versa
        const match = normOlTitle.includes(normBookTitle) || normBookTitle.includes(normOlTitle);
        if (!match) {
          console.log(`[MISMATCH] "${b.title}" by ${b.authorName} (${b.publicationYear})`);
          console.log(`   Our ISBN: ${b.isbn13}`);
          console.log(`   Open Library Title: "${olTitle}"\n`);
          mismatches.push({ book: b, olTitle, isbn: b.isbn13 });
        } else {
          console.log(`[OK] "${b.title}" matches "${olTitle}"`);
        }
      } else {
        console.log(`[NOT FOUND 404] "${b.title}" (${b.isbn13})`);
      }
    } catch (e) {
      console.log(`[ERROR] "${b.title}": ${e.message}`);
    }
    // slight delay
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nAudit complete! Found ${mismatches.length} mismatches out of ${targets.length} recent books.`);
}

audit();
