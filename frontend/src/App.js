import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Stats from './components/Stats';
import Filters from './components/Filters';
import CardGrid from './components/CardGrid';
import cardService from './services/cardService';
import storageService from './services/storageService';

function App() {
  // Helper function to parse filters from URL
  const getFiltersFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const urlFilters = {
      sets: params.get('sets') ? params.get('sets').split(',') : [],
      rarity: params.get('rarity') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      owned: params.get('owned') || ''
    };
    return urlFilters;
  };

  const getSearchFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  };

  const getSortFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('sort') || 'binderOrder';
  };

  const [cards, setCards] = useState([]);
  const [filters, setFilters] = useState(getFiltersFromURL());
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
  const [searchTerm, setSearchTerm] = useState(getSearchFromURL());
  const [sortBy, setSortBy] = useState(getSortFromURL());

  // Update URL when filters, search, or sort change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.sets.length > 0) {
      params.set('sets', filters.sets.join(','));
    }
    if (filters.rarity) {
      params.set('rarity', filters.rarity);
    }
    if (filters.minPrice) {
      params.set('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
      params.set('maxPrice', filters.maxPrice);
    }
    if (filters.owned) {
      params.set('owned', filters.owned);
    }
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    if (sortBy !== 'binderOrder') {
      params.set('sort', sortBy);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [filters, searchTerm, sortBy]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setFilters(getFiltersFromURL());
      setSearchTerm(getSearchFromURL());
      setSortBy(getSortFromURL());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
      sets: [],
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
        // Order: SPM -> SPE -> MAR -> TSPM -> LMAR -> PSPM
        const getSetOrder = (set) => {
          const setOrder = {
            'SPM': 1,   // Main set with all variants
            'SPE': 2,   // Welcome Deck + Scene Box
            'MAR': 3,   // Marvel Universe crossover
            'TSPM': 4,  // Tokens
            'LMAR': 5,  // Marvel Legends Inserts
            'ASPM': 6,  // Art Series
            'PSPM': 7   // Promos
          };
          return setOrder[set] || 999;
        };

        return sorted.sort((a, b) => {
          // First sort by set
          const setDiff = getSetOrder(a.set) - getSetOrder(b.set);
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
