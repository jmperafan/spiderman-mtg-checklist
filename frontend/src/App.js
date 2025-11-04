import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Stats from './components/Stats';
import Filters from './components/Filters';
import CardGrid from './components/CardGrid';
import cardService from './services/cardService';
import storageService from './services/storageService';

function App() {
  const [cards, setCards] = useState([]);
  const [filters, setFilters] = useState({
    set: '',
    rarity: '',
    minPrice: '',
    maxPrice: '',
    owned: ''
  });
  const [stats, setStats] = useState({
    totalCards: 0,
    ownedCards: 0,
    percentage: 0,
    totalValue: 0,
    ownedValue: 0
  });
  const [filterOptions, setFilterOptions] = useState({
    sets: [],
    rarities: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('binderOrder');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = () => {
    setLoading(true);
    try {
      // Load filter options
      const options = cardService.getFilterOptions();
      setFilterOptions(options);

      // Load cards with filters
      const filteredCards = cardService.getCards(filters);
      setCards(filteredCards);

      // Load stats based on filtered cards
      const statistics = cardService.getStats(filteredCards);
      setStats(statistics);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCardOwnership = (cardId, foil = false) => {
    try {
      cardService.toggleCardOwnership(cardId, foil);
      loadData();
    } catch (error) {
      console.error('Error toggling card ownership:', error);
    }
  };

  const handleExport = () => {
    try {
      storageService.exportCollection();
    } catch (error) {
      console.error('Error exporting collection:', error);
      alert('Failed to export collection. Please try again.');
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    storageService.importCollection(file)
      .then(() => {
        loadData();
        alert('Collection imported successfully!');
      })
      .catch((error) => {
        console.error('Error importing collection:', error);
        alert(`Failed to import collection: ${error.message}`);
      });

    // Reset file input
    event.target.value = '';
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = () => {
    setFilters({
      set: '',
      rarity: '',
      minPrice: '',
      maxPrice: '',
      owned: ''
    });
    setSearchTerm('');
  };

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.setNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update stats when search term filters the cards
  useEffect(() => {
    if (cards.length > 0) {
      const statistics = cardService.getStats(filteredCards);
      setStats(statistics);
    }
  }, [searchTerm, cards]);

  const sortCards = (cardsToSort) => {
    const sorted = [...cardsToSort];

    switch (sortBy) {
      case 'binderOrder':
        // Binder Order: Sort by set, then by collector number
        // SPM (Main set) -> SPE (Eternal) -> MAR (Marvel Universe)
        const getSetOrder = (subset) => {
          if (subset === 'Welcome Deck' || subset === 'Scene Box') return 2; // SPE
          if (subset === 'Marvel Universe') return 3; // MAR
          return 1; // SPM (all other subsets)
        };

        return sorted.sort((a, b) => {
          // First sort by set
          const setDiff = getSetOrder(a.subset) - getSetOrder(b.subset);
          if (setDiff !== 0) return setDiff;

          // Within same set, sort by collector number
          const aNum = parseInt(a.setNumber) || 0;
          const bNum = parseInt(b.setNumber) || 0;
          return aNum - bNum;
        });

      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));

      case 'priceAsc':
        return sorted.sort((a, b) => a.price - b.price);

      case 'priceDesc':
        return sorted.sort((a, b) => b.price - a.price);

      case 'rarity':
        const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Mythic Rare': 4 };
        return sorted.sort((a, b) => {
          const orderDiff = (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
          if (orderDiff !== 0) return orderDiff;
          return a.name.localeCompare(b.name);
        });

      case 'setNumber':
      default:
        return sorted.sort((a, b) => {
          const aNum = parseInt(a.setNumber) || 0;
          const bNum = parseInt(b.setNumber) || 0;
          return aNum - bNum;
        });
    }
  };

  const sortedCards = sortCards(filteredCards);

  return (
    <div className="App">
      <Header
        onExport={handleExport}
        onImport={handleImport}
      />
      <div className="container">
        <Stats stats={stats} />
        <Filters
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <CardGrid
          cards={sortedCards}
          loading={loading}
          onToggleOwnership={toggleCardOwnership}
        />
      </div>
    </div>
  );
}

export default App;
