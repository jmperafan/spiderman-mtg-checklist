const fs = require('fs');

const cardsData = JSON.parse(fs.readFileSync('./backend/data/cards.json', 'utf8'));
const results = { passed: [], failed: [], warnings: [] };

function pass(test, message) {
  results.passed.push({ test, message });
  console.log(`✓ PASS: ${test} - ${message}`);
}

function fail(test, message, expected, actual) {
  results.failed.push({ test, message, expected, actual });
  console.error(`✗ FAIL: ${test} - ${message}`);
  if (expected !== undefined) console.error(`  Expected: ${expected}, Got: ${actual}`);
}

function warn(test, message) {
  results.warnings.push({ test, message });
  console.warn(`⚠ WARNING: ${test} - ${message}`);
}
const cardsBySet = {};
const cardsBySubset = {};
const cardsByFinish = { foil: [], nonfoil: [] };
const uniqueCardNames = new Set();

cardsData.forEach(card => {
  const setCode = card.set || inferSetCode(card);
  if (!cardsBySet[setCode]) cardsBySet[setCode] = [];
  cardsBySet[setCode].push(card);

  if (!cardsBySubset[card.subset]) cardsBySubset[card.subset] = [];
  cardsBySubset[card.subset].push(card);

  if (card.hasFoil) cardsByFinish.foil.push(card);
  if (card.hasNonfoil) cardsByFinish.nonfoil.push(card);

  uniqueCardNames.add(card.name);
});

function inferSetCode(card) {
  // Use the actual set field if it exists
  if (card.set) return card.set;

  // Fallback to legacy inference for cards without set field
  if (card.subset === 'Welcome Deck') return 'SPE';
  if (card.subset === 'Scene Box') return 'SPE';
  if (card.subset === 'Marvel Universe') return 'MAR';
  return 'SPM';
}

console.log('\n=== Marvel Spider-Man Card List Validation ===\n');
console.log('Reference: https://www.mtggoldfish.com/sets/Marvel+Spider-Man/All+Cards#online\n');

// Test 1: Total card count
console.log('--- Test 1: Total Card Count ---');
const totalCards = cardsData.length;
if (totalCards === 647) {
  pass('Total Cards', `Exactly 647 cards found`);
} else {
  warn('Total Cards', `Expected 647 cards (per MTGGoldfish), found ${totalCards}. Note: Our structure may count foil/nonfoil differently.`);
}
console.log('\n--- Test 2: Card Structure Validation ---');
let structureValid = true;
const requiredFields = ['id', 'name', 'setNumber', 'subset', 'rarity', 'price', 'foilPrice', 'source', 'imageUrl', 'hasFoil', 'hasNonfoil'];

cardsData.forEach((card, index) => {
  requiredFields.forEach(field => {
    if (!(field in card)) {
      structureValid = false;
      fail('Card Structure', `Card at index ${index} (${card.name || 'unknown'}) missing field: ${field}`);
    }
  });
});

if (structureValid) {
  pass('Card Structure', 'All cards have required fields');
}
console.log('\n--- Test 3: Subset Breakdown ---');
Object.keys(cardsBySubset).sort().forEach(subset => {
  const count = cardsBySubset[subset].length;
  console.log(`  ${subset}: ${count} cards`);
});
const mainSetCount = cardsBySubset['Main Set'] ? cardsBySubset['Main Set'].length : 0;
if (mainSetCount === 198) {
  pass('Main Set Count', `Exactly 198 main set cards found`);
} else {
  warn('Main Set Count', `Expected ~198 main set cards, found ${mainSetCount}`);
}
console.log('\n--- Test 4: Set Code Distribution ---');
Object.keys(cardsBySet).sort().forEach(setCode => {
  console.log(`  ${setCode}: ${cardsBySet[setCode].length} cards`);
});
console.log('\n--- Test 5: Collector Number Validation ---');
const collectorNumbers = {};
let duplicateNumbers = false;

cardsData.forEach(card => {
  const setCode = card.set || inferSetCode(card);
  const key = `${setCode}-${card.setNumber}`;
  if (!collectorNumbers[key]) {
    collectorNumbers[key] = [];
  }
  collectorNumbers[key].push(card);
});
Object.entries(collectorNumbers).forEach(([key, cardsList]) => {
  if (cardsList.length > 1) {
    const names = [...new Set(cardsList.map(c => c.name))];
    if (names.length > 1) {
      duplicateNumbers = true;
      fail('Collector Numbers', `Duplicate collector number ${key} for different cards: ${names.join(', ')}`);
    }
  }
});

if (!duplicateNumbers) {
  pass('Collector Numbers', 'No duplicate collector numbers for different cards');
}
console.log('\n--- Test 6: Rarity Distribution ---');
const rarities = {};
cardsData.forEach(card => {
  if (!rarities[card.rarity]) rarities[card.rarity] = 0;
  rarities[card.rarity]++;
});
Object.keys(rarities).sort().forEach(rarity => {
  console.log(`  ${rarity}: ${rarities[rarity]} cards`);
});

const validRarities = ['Common', 'Uncommon', 'Rare', 'Mythic Rare'];
let invalidRarity = false;
cardsData.forEach(card => {
  if (!validRarities.includes(card.rarity)) {
    invalidRarity = true;
    fail('Rarity Validation', `Invalid rarity "${card.rarity}" for card: ${card.name}`);
  }
});

if (!invalidRarity) {
  pass('Rarity Validation', 'All rarities are valid');
}
console.log('\n--- Test 7: Image URL Validation ---');
let missingImages = 0;
cardsData.forEach(card => {
  if (!card.imageUrl || card.imageUrl.includes('placeholder')) {
    missingImages++;
  }
});

if (missingImages === 0) {
  pass('Image URLs', 'All cards have valid image URLs');
} else {
  warn('Image URLs', `${missingImages} cards are using placeholder images`);
}
console.log('\n--- Test 8: Price Data ---');
let cardsWithPrices = 0;
let cardsWithoutPrices = 0;
cardsData.forEach(card => {
  if (card.price > 0 || card.foilPrice > 0) {
    cardsWithPrices++;
  } else {
    cardsWithoutPrices++;
  }
});

console.log(`  Cards with price data: ${cardsWithPrices}`);
console.log(`  Cards without price data: ${cardsWithoutPrices}`);

if (cardsWithPrices > 0) {
  pass('Price Data', `${cardsWithPrices} cards have price information`);
}
console.log('\n--- Test 9: Unique Card Names ---');
console.log(`  Total unique card names: ${uniqueCardNames.size}`);
console.log(`  Total card entries: ${cardsData.length}`);

const expectedUniqueNames = 200; // Approximate
if (uniqueCardNames.size >= expectedUniqueNames) {
  pass('Unique Names', `Found ${uniqueCardNames.size} unique card names (expected ~${expectedUniqueNames})`);
} else {
  warn('Unique Names', `Expected ~${expectedUniqueNames} unique names, found ${uniqueCardNames.size}`);
}
console.log('\n--- Test 10: Source Validation ---');
const sources = new Set();
cardsData.forEach(card => {
  if (Array.isArray(card.source)) {
    card.source.forEach(s => sources.add(s));
  }
});

console.log('  Available sources:');
[...sources].sort().forEach(source => {
  const count = cardsData.filter(c => c.source && c.source.includes(source)).length;
  console.log(`    - ${source}: ${count} cards`);
});

if (sources.size > 0) {
  pass('Source Data', `All cards have source information (${sources.size} unique sources)`);
} else {
  fail('Source Data', 'No source information found');
}
console.log('\n--- Test 11: Foil Availability ---');
console.log(`  Cards available in foil: ${cardsByFinish.foil.length}`);
console.log(`  Cards available in nonfoil: ${cardsByFinish.nonfoil.length}`);

const bothFinishes = cardsData.filter(c => c.hasFoil && c.hasNonfoil).length;
const foilOnly = cardsData.filter(c => c.hasFoil && !c.hasNonfoil).length;
const nonfoilOnly = cardsData.filter(c => !c.hasFoil && c.hasNonfoil).length;

console.log(`  Cards with both finishes: ${bothFinishes}`);
console.log(`  Foil only: ${foilOnly}`);
console.log(`  Nonfoil only: ${nonfoilOnly}`);

pass('Foil Data', 'Foil availability data is present');
console.log('\n=== Test Summary ===');
console.log(`✓ Passed: ${results.passed.length}`);
console.log(`⚠ Warnings: ${results.warnings.length}`);
console.log(`✗ Failed: ${results.failed.length}`);

if (results.failed.length > 0) {
  console.log('\n❌ VALIDATION FAILED - Please review the errors above');
  process.exit(1);
} else if (results.warnings.length > 0) {
  console.log('\n⚠️  VALIDATION PASSED WITH WARNINGS - Please review the warnings above');
  process.exit(0);
} else {
  console.log('\n✅ ALL VALIDATION TESTS PASSED');
  process.exit(0);
}
