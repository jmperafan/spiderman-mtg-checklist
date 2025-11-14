const fs = require('fs');
const path = require('path');

/**
 * Helper script to add Art Series Spider-Man cards manually
 *
 * Since the Art Series cards are not yet available in Scryfall's API,
 * this script allows you to add them manually by editing the artSeriesCards array below.
 *
 * To use this script:
 * 1. Edit the artSeriesCards array below with the actual card data from TCGPlayer
 * 2. Run: node scripts/add-art-series.js
 * 3. The cards will be merged into backend/data/cards.json
 */

// Art Series Spider-Man cards - Data from MTG Stocks
// Note: These cards are not yet in Scryfall's API
const artSeriesCardsData = [
  { num: "1", name: "Flash Thompson, Spider-Fan", price: 0.83 },
  { num: "2", name: "Friendly Neighborhood", price: 2.25 },
  { num: "3", name: "Peter Parker", price: 1.25 },
  { num: "4", name: "Spider-Man, Web-Slinger", price: 2.20 },
  { num: "5", name: "Chameleon, Master of Disguise", price: 1.38 },
  { num: "7", name: "Behold the Sinister Six!", price: 0.67 },
  { num: "8", name: "Gwenom, Remorseless", price: 1.66 },
  { num: "9", name: "Morlun, Devourer of Spiders", price: 1.56 },
  { num: "10", name: "The Soul Stone", price: 1.37 },
  { num: "11", name: "Swarm, Being of Bees", price: 1.28 },
  { num: "12", name: "Venom, Evil Unleashed", price: 0.67 },
  { num: "13", name: "Gwen Stacy", price: 0.85 },
  { num: "14", name: "Heroes' Hangout", price: 0.65 },
  { num: "15", name: "Hobgoblin, Mantled Marauder", price: 0.85 },
  { num: "16", name: "Wisecrack", price: 1.02 },
  { num: "17", name: "Kapow!", price: 1.02 },
  { num: "18", name: "Lizard, Connors's Curse", price: 0.92 },
  { num: "19", name: "Spider-Ham, Peter Porker", price: 1.54 },
  { num: "20", name: "Spider-Man, Brooklyn Visionary", price: 0.63 },
  { num: "21", name: "Spiders-Man, Heroic Horde", price: 1.02 },
  { num: "22", name: "Strength of Will", price: 2.55 },
  { num: "23", name: "Terrific Team-Up", price: 0.87 },
  { num: "25", name: "Doctor Octopus, Master Planner", price: 0.68 },
  { num: "26", name: "Green Goblin", price: 0.77 },
  { num: "27", name: "Green Goblin, Revenant", price: 0.99 },
  { num: "28", name: "Kraven, Proud Predator", price: 0.93 },
  { num: "30", name: "Spider-Man 2099", price: 1.10 },
  { num: "31", name: "Spider-Man India", price: 0.66 },
  { num: "32", name: "Superior Spider-Man", price: 1.00 },
  { num: "33", name: "Peter Parker", price: 2.27 },
  { num: "34", name: "Gwen Stacy", price: 2.80 },
  { num: "35", name: "Miles Morales", price: 0.89 },
  { num: "36", name: "Amazing Spider-Man", price: 0.96 },
  { num: "37", name: "Arana, Heart of the Spider", price: 0.75 },
  { num: "38", name: "Scarlet Spider, Ben Reilly", price: 0.59 },
  { num: "39", name: "Silk, Web Weaver", price: 1.68 },
  { num: "40", name: "Symbiote Spider-Man", price: 1.16 },
  { num: "41", name: "Ultimate Spider-Man", price: 0.97 },
  { num: "43", name: "Norman Osborn", price: 1.21 },
  { num: "44", name: "Black Cat, Cunning Thief", price: 1.07 },
  { num: "45", name: "Behold the Sinister Six!", price: 1.10 },
  { num: "46", name: "Maximum Carnage", price: 1.22 },
  { num: "47", name: "Carnage, Crimson Chaos", price: 0.87 },
  { num: "48", name: "Doctor Octopus, Master Planner", price: 2.02 },
  { num: "49", name: "Green Goblin", price: 1.69 },
  { num: "50", name: "Mary Jane Watson", price: 0.90 },
  { num: "51", name: "Spider-Woman, Stunning Savior", price: 1.18 },
  { num: "52", name: "Spectacular Spider-Man (Black)", price: 1.21 },
  { num: "53", name: "Spider-Man, Peter Parker", price: 0.60 },
  { num: "54", name: "Grendel, Spawn of Knull", price: 0.93 }
];

const artSeriesCards = artSeriesCardsData.map(card => ({
  id: `aspm-${card.num.padStart(3, '0')}`,
  name: card.name,
  setNumber: card.num,
  set: "ASPM",
  subset: "Art Series",
  rarity: "Common",
  price: card.price,
  foilPrice: card.price * 1.5, // Estimated foil price
  source: ["Art Series Packs"],
  imageUrl: `https://via.placeholder.com/250x350/1a1a2e/dc143c?text=${encodeURIComponent(card.name)}`,
  hasFoil: true,
  hasNonfoil: true,
  type_line: "Art Card"
}));

// Read existing cards
const cardsPath = path.join(__dirname, '../backend/data/cards.json');
let existingCards = [];

if (fs.existsSync(cardsPath)) {
  const cardsData = fs.readFileSync(cardsPath, 'utf8');
  existingCards = JSON.parse(cardsData);
  console.log(`Loaded ${existingCards.length} existing cards`);
}

// Remove any existing Art Series cards (in case we're updating)
const filteredCards = existingCards.filter(card => card.set !== 'ASPM');
console.log(`Removed ${existingCards.length - filteredCards.length} existing Art Series cards`);

// Add new Art Series cards
const mergedCards = [...filteredCards, ...artSeriesCards];
console.log(`Adding ${artSeriesCards.length} Art Series cards`);
console.log(`Total cards: ${mergedCards.length}`);

// Write back to file
fs.writeFileSync(cardsPath, JSON.stringify(mergedCards, null, 2));
console.log(`Successfully wrote cards to ${cardsPath}`);

// Also update frontend copy
const frontendCardsPath = path.join(__dirname, '../frontend/src/data/cards.json');
fs.writeFileSync(frontendCardsPath, JSON.stringify(mergedCards, null, 2));
console.log(`Successfully wrote cards to ${frontendCardsPath}`);

console.log('\nNext steps:');
console.log('1. Edit this file (scripts/add-art-series.js) and replace the placeholder data with actual card names and prices from TCGPlayer');
console.log('2. Run this script again: node scripts/add-art-series.js');
console.log('3. Update App.js to include ASPM in the setOrder');
console.log('4. Restart your application');
