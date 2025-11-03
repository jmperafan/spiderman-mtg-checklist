const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data paths
const CARDS_FILE = path.join(__dirname, 'data', 'cards.json');
const COLLECTION_FILE = path.join(__dirname, 'data', 'user-collection.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize collection file if it doesn't exist
if (!fs.existsSync(COLLECTION_FILE)) {
  fs.writeFileSync(COLLECTION_FILE, JSON.stringify({ owned: [], ownedFoil: [] }, null, 2));
}

// Helper functions
const readCards = () => {
  const data = fs.readFileSync(CARDS_FILE, 'utf8');
  return JSON.parse(data);
};

const readCollection = () => {
  const data = fs.readFileSync(COLLECTION_FILE, 'utf8');
  const collection = JSON.parse(data);

  // Migrate old format to new format with ownedFoil
  if (!collection.ownedFoil) {
    collection.ownedFoil = [];
  }

  return collection;
};

const writeCollection = (collection) => {
  fs.writeFileSync(COLLECTION_FILE, JSON.stringify(collection, null, 2));
};

// Routes

// Get all cards with optional filters
app.get('/api/cards', (req, res) => {
  try {
    let cards = readCards();
    const { subset, source, minPrice, maxPrice, rarity, owned } = req.query;

    // Apply filters
    if (subset) {
      cards = cards.filter(card => card.subset === subset);
    }

    if (source) {
      cards = cards.filter(card => card.source.includes(source));
    }

    if (minPrice) {
      cards = cards.filter(card => card.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      cards = cards.filter(card => card.price <= parseFloat(maxPrice));
    }

    if (rarity) {
      cards = cards.filter(card => card.rarity === rarity);
    }

    // Add owned status
    const collection = readCollection();
    cards = cards.map(card => ({
      ...card,
      owned: collection.owned.includes(card.id),
      ownedFoil: collection.ownedFoil.includes(card.id)
    }));

    // Filter by owned status if requested
    if (owned === 'true') {
      cards = cards.filter(card => card.owned || card.ownedFoil);
    } else if (owned === 'false') {
      cards = cards.filter(card => !card.owned && !card.ownedFoil);
    }

    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// Get unique filter values
app.get('/api/filters', (req, res) => {
  try {
    const cards = readCards();

    const subsets = [...new Set(cards.map(c => c.subset))].sort();
    const sources = [...new Set(cards.flatMap(c => c.source))].sort();
    const rarities = [...new Set(cards.map(c => c.rarity))].sort();

    res.json({ subsets, sources, rarities });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

// Get collection stats
app.get('/api/stats', (req, res) => {
  try {
    const cards = readCards();
    const collection = readCollection();

    const totalCards = cards.length;
    const ownedCards = collection.owned.length;
    const ownedFoils = collection.ownedFoil.length;

    // Calculate unique cards owned (either regular or foil)
    const uniqueOwned = new Set([...collection.owned, ...collection.ownedFoil]).size;

    // Master set includes both regular and foil versions
    const totalMasterCards = cards.filter(c => c.hasNonfoil).length + cards.filter(c => c.hasFoil).length;
    const ownedMasterCards = ownedCards + ownedFoils;

    const totalValue = cards.reduce((sum, card) => sum + card.price, 0);
    const ownedValue = cards
      .filter(card => collection.owned.includes(card.id))
      .reduce((sum, card) => sum + card.price, 0);
    const ownedFoilValue = cards
      .filter(card => collection.ownedFoil.includes(card.id))
      .reduce((sum, card) => sum + (card.foilPrice || card.price), 0);

    res.json({
      totalCards,
      ownedCards,
      ownedFoils,
      uniqueOwned,
      percentage: totalCards > 0 ? ((uniqueOwned / totalCards) * 100).toFixed(1) : 0,
      totalMasterCards,
      ownedMasterCards,
      masterPercentage: totalMasterCards > 0 ? ((ownedMasterCards / totalMasterCards) * 100).toFixed(1) : 0,
      totalValue: totalValue.toFixed(2),
      ownedValue: (ownedValue + ownedFoilValue).toFixed(2)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Toggle card ownership
app.post('/api/collection/toggle/:cardId', (req, res) => {
  try {
    const { cardId } = req.params;
    const { foil } = req.body;
    const collection = readCollection();

    const targetArray = foil ? collection.ownedFoil : collection.owned;
    const index = targetArray.indexOf(cardId);

    if (index > -1) {
      targetArray.splice(index, 1);
    } else {
      targetArray.push(cardId);
    }

    writeCollection(collection);
    res.json({ owned: collection.owned, ownedFoil: collection.ownedFoil });
  } catch (error) {
    console.error('Error toggling card:', error);
    res.status(500).json({ error: 'Failed to toggle card' });
  }
});

// Get collection
app.get('/api/collection', (req, res) => {
  try {
    const collection = readCollection();
    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
