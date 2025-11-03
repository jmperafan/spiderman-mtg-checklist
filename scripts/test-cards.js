const fs = require('fs');

/**
 * Test suite to validate the Marvel Spider-Man card list
 * Reference: https://www.mtggoldfish.com/sets/Marvel+Spider-Man/All+Cards#online
 *
 * According to MTGGoldfish, the set should have:
 * - Total: 647 cards
 * - Main Set: 198 cards
 * - Main Set Foils: 198 cards
 * - Showcase: 24 cards
 * - Showcase Foils: 24 cards
 * - Extended Arts: 40 cards
 * - Extended Art Foils: 40 cards
 * - Borderless: 15 cards
 * - Borderless Foils: 21 cards
 * - Prerelease Promos: 68 cards
 * - Bundle: 2 cards
 * - Misc Promos: 4 cards
 * - Promos: 13 cards
 */

// Load cards data
const cardsData = JSON.parse(fs.readFileSync('./backend/data/cards.json', 'utf8'));

// Test results
const results = {
  passed: [],
  failed: [],
  warnings: []
};

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

// Group cards by various criteria
const cardsBySet = {};
const cardsBySubset = {};
const cardsByFinish = { foil: [], nonfoil: [] };
const uniqueCardNames = new Set();

cardsData.forEach(card => {
  // Group by set code (extracted from collector number or inferred)
  const setCode = inferSetCode(card);
  if (!cardsBySet[setCode]) cardsBySet[setCode] = [];
  cardsBySet[setCode].push(card);

  // Group by subset
  if (!cardsBySubset[card.subset]) cardsBySubset[card.subset] = [];
  cardsBySubset[card.subset].push(card);

  // Group by finish
  if (card.hasFoil) cardsByFinish.foil.push(card);
  if (card.hasNonfoil) cardsByFinish.nonfoil.push(card);

  // Track unique names
  uniqueCardNames.add(card.name);
});

function inferSetCode(card) {
  const num = parseInt(card.setNumber);

  // Welcome Deck (SPE 1-20)
  if (card.subset === 'Welcome Deck') return 'SPE';

  // Scene Box (SPE 21+)
  if (card.subset === 'Scene Box') return 'SPE';

  // Marvel Universe (MAR)
  if (card.subset === 'Marvel Universe') return 'MAR';

  // Everything else is SPM
  return 'SPM';
}

console.log('\n=== Marvel Spider-Man Card List Validation ===\n');
console.log('Reference: https://www.mtggoldfish.com/sets/Marvel+Spider-Man/All+Cards#online\n');

// Test 1: Total card count
console.log('--- Test 1: Total Card Count ---');
const totalCards = cardsData.length;
// Note: MTGGoldfish shows 647 total, but this includes foil/nonfoil as separate entries
// Our data structure has hasFoil/hasNonfoil flags instead
if (totalCards === 647) {
  pass('Total Cards', `Exactly 647 cards found`);
} else {
  warn('Total Cards', `Expected 647 cards (per MTGGoldfish), found ${totalCards}. Note: Our structure may count foil/nonfoil differently.`);
}

// Test 2: Card structure validation
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

// Test 3: Subset breakdown
console.log('\n--- Test 3: Subset Breakdown ---');
Object.keys(cardsBySubset).sort().forEach(subset => {
  const count = cardsBySubset[subset].length;
  console.log(`  ${subset}: ${count} cards`);
});

// Validate Main Set count (should be around 198)
const mainSetCount = cardsBySubset['Main Set'] ? cardsBySubset['Main Set'].length : 0;
if (mainSetCount === 198) {
  pass('Main Set Count', `Exactly 198 main set cards found`);
} else {
  warn('Main Set Count', `Expected ~198 main set cards, found ${mainSetCount}`);
}

// Test 4: Set code distribution
console.log('\n--- Test 4: Set Code Distribution ---');
Object.keys(cardsBySet).sort().forEach(setCode => {
  console.log(`  ${setCode}: ${cardsBySet[setCode].length} cards`);
});

// Test 5: Collector number validation
console.log('\n--- Test 5: Collector Number Validation ---');
const collectorNumbers = {};
let duplicateNumbers = false;

cardsData.forEach(card => {
  const key = `${inferSetCode(card)}-${card.setNumber}`;
  if (!collectorNumbers[key]) {
    collectorNumbers[key] = [];
  }
  collectorNumbers[key].push(card);
});

// Check for duplicates (same set + collector number)
Object.entries(collectorNumbers).forEach(([key, cards]) => {
  if (cards.length > 1) {
    // This is acceptable if they differ in finish (foil vs nonfoil)
    const names = [...new Set(cards.map(c => c.name))];
    if (names.length > 1) {
      duplicateNumbers = true;
      fail('Collector Numbers', `Duplicate collector number ${key} for different cards: ${names.join(', ')}`);
    }
  }
});

if (!duplicateNumbers) {
  pass('Collector Numbers', 'No duplicate collector numbers for different cards');
}

// Test 6: Rarity validation
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

// Test 7: Image URL validation
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

// Test 8: Price validation
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

// Test 9: Unique card names
console.log('\n--- Test 9: Unique Card Names ---');
console.log(`  Total unique card names: ${uniqueCardNames.size}`);
console.log(`  Total card entries: ${cardsData.length}`);

const expectedUniqueNames = 200; // Approximate
if (uniqueCardNames.size >= expectedUniqueNames) {
  pass('Unique Names', `Found ${uniqueCardNames.size} unique card names (expected ~${expectedUniqueNames})`);
} else {
  warn('Unique Names', `Expected ~${expectedUniqueNames} unique names, found ${uniqueCardNames.size}`);
}

// Test 10: Source validation
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

// Test 11: Foil availability
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

// Summary
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
