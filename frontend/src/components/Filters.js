import React from 'react';
import './Filters.css';

function Filters({ filters, filterOptions, onFilterChange, onReset, searchTerm, onSearchChange, sortBy, onSortChange }) {
  return (
    <div className="filters-container">
      <div className="filters-header">
        <h2>🔍 Filters</h2>
        <button className="reset-btn" onClick={onReset}>
          Reset All
        </button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
          >
            <option value="binderOrder">Binder Order</option>
            <option value="setNumber">Set Number</option>
            <option value="name">Name (A-Z)</option>
            <option value="priceAsc">Price (Low to High)</option>
            <option value="priceDesc">Price (High to Low)</option>
            <option value="rarity">Rarity</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Card name or number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Subset</label>
          <select
            value={filters.subset}
            onChange={(e) => onFilterChange('subset', e.target.value)}
            className="filter-select"
          >
            <option value="">All Subsets</option>
            {filterOptions.subsets.map(subset => (
              <option key={subset} value={subset}>{subset}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Set</label>
          <select
            value={filters.set}
            onChange={(e) => onFilterChange('set', e.target.value)}
            className="filter-select"
          >
            <option value="">All Sets</option>
            {filterOptions.sets.map(set => (
              <option key={set} value={set}>{set}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Rarity</label>
          <select
            value={filters.rarity}
            onChange={(e) => onFilterChange('rarity', e.target.value)}
            className="filter-select"
          >
            <option value="">All Rarities</option>
            {filterOptions.rarities.map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Min Price</label>
          <input
            type="number"
            placeholder="$0"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="filter-input"
            min="0"
            step="0.01"
          />
        </div>

        <div className="filter-group">
          <label>Max Price</label>
          <input
            type="number"
            placeholder="$999"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="filter-input"
            min="0"
            step="0.01"
          />
        </div>

        <div className="filter-group">
          <label>Ownership</label>
          <select
            value={filters.owned}
            onChange={(e) => onFilterChange('owned', e.target.value)}
            className="filter-select"
          >
            <option value="">All Cards</option>
            <option value="true">Owned Only</option>
            <option value="false">Missing Only</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filters;
