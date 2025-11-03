import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Stats from './components/Stats';
import Filters from './components/Filters';
import CardGrid from './components/CardGrid';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [cards, setCards] = useState([]);
  const [filters, setFilters] = useState({
    subset: '',
    source: '',
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
    subsets: [],
    sources: [],
    rarities: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('binderOrder');

  useEffect(() => {
    fetchFilterOptions();
    fetchCards();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCards();
    fetchStats();
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/filters`);
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchCards = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`${API_URL}/api/cards?${params}`);
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const toggleCardOwnership = async (cardId, foil = false) => {
    try {
      await axios.post(`${API_URL}/api/collection/toggle/${cardId}`, { foil });
      fetchCards();
      fetchStats();
    } catch (error) {
      console.error('Error toggling card ownership:', error);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = () => {
    setFilters({
      subset: '',
      source: '',
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
      <Header />
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
