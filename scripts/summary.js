const fs = require('fs');
const noms = JSON.parse(fs.readFileSync('data/nominations.json', 'utf8'));
const prizes = JSON.parse(fs.readFileSync('data/prizes.json', 'utf8'));

console.log('=== Prize Ingestion Summary ===');
prizes.forEach(p => {
  const pNoms = noms.filter(n => n.prizeId === p.id);
  const winners = pNoms.filter(n => n.status === 'winner').length;
  const shortlists = pNoms.filter(n => n.status === 'shortlist' || n.status === 'finalist').length;
  console.log(`${p.name.padEnd(38)}: ${winners.toString().padStart(3)} winners, ${shortlists.toString().padStart(3)} shortlists/finalists (Total: ${pNoms.length})`);
});
console.log('===============================');
