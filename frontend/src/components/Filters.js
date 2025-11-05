import React, { useState } from 'react';
import './Filters.css';

function Filters({ filters, filterOptions, onFilterChange, onReset, searchTerm, onSearchChange, sortBy, onSortChange }) {
  const [isSetExpanded, setIsSetExpanded] = useState(false);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onFilterChange('sets', filterOptions.sets);
    } else {
      onFilterChange('sets', []);
    }
  };

  const allSelected = filters.sets?.length === filterOptions.sets?.length && filterOptions.sets?.length > 0;
  const someSelected = filters.sets?.length > 0 && filters.sets?.length < filterOptions.sets?.length;

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
          <label>Set</label>
          <div className="tableau-filter">
            <div className="tableau-filter-header" onClick={() => setIsSetExpanded(!isSetExpanded)}>
              <div className="selected-pills">
                {filters.sets?.length === 0 ? (
                  <span className="placeholder-text">All Sets</span>
                ) : filters.sets?.length === filterOptions.sets?.length ? (
                  <span className="placeholder-text">All Sets</span>
                ) : (
                  filters.sets?.map(set => (
                    <span key={set} className="filter-pill">
                      {set}
                      <button
                        className="pill-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newSets = filters.sets.filter(s => s !== set);
                          onFilterChange('sets', newSets);
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
              <span className="dropdown-arrow">{isSetExpanded ? '▲' : '▼'}</span>
            </div>
            {isSetExpanded && (
              <div className="checkbox-list">
                <label className="checkbox-item select-all">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={input => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={handleSelectAll}
                  />
                  <span className="select-all-text">Select All</span>
                </label>
                <div className="checkbox-divider"></div>
                {filterOptions.sets.map(set => (
                  <label key={set} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={filters.sets?.includes(set) || false}
                      onChange={(e) => {
                        const currentSets = filters.sets || [];
                        const newSets = e.target.checked
                          ? [...currentSets, set]
                          : currentSets.filter(s => s !== set);
                        onFilterChange('sets', newSets);
                      }}
                    />
                    <span>{set}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
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
            <option value="owned">Owned (any variant)</option>
            <option value="not-owned">Not Owned (no variants)</option>
            <option value="all-variants-owned">All Variants Owned (regular + foil)</option>
            <option value="all-variants-not-owned">All Variants Not Owned (missing both)</option>
            <option value="incomplete-variants">Incomplete Variants (some but not all)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filters;
