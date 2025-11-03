const cards = require('./backend/data/cards.json');

const subsets = {};
cards.forEach(c => {
  if (!subsets[c.subset]) {
    subsets[c.subset] = {total: 0, nonfoil: 0, foil: 0};
  }
  subsets[c.subset].total++;
  if (c.hasNonfoil) subsets[c.subset].nonfoil++;
  if (c.hasFoil) subsets[c.subset].foil++;
});

console.log('\nSubset Analysis:');
console.log('================');
Object.keys(subsets).sort().forEach(s => {
  const data = subsets[s];
  const master = data.nonfoil + data.foil;
  console.log(`${s}:`);
  console.log(`  Total unique cards: ${data.total}`);
  console.log(`  Nonfoil versions: ${data.nonfoil}`);
  console.log(`  Foil versions: ${data.foil}`);
  console.log(`  Master set count: ${master}`);
  console.log('');
});

const totalNonfoil = cards.filter(c => c.hasNonfoil).length;
const totalFoil = cards.filter(c => c.hasFoil).length;
console.log('Overall Totals:');
console.log(`  Unique cards: ${cards.length}`);
console.log(`  Nonfoil versions: ${totalNonfoil}`);
console.log(`  Foil versions: ${totalFoil}`);
console.log(`  Master set total: ${totalNonfoil + totalFoil}`);
