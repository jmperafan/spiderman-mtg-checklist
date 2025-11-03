import React from 'react';
import './CardGrid.css';
import Card from './Card';

function CardGrid({ cards, loading, onToggleOwnership }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spider-spinner">🕷️</div>
        <p>Loading cards...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🕸️</div>
        <h3>No cards found</h3>
        <p>Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          onToggleOwnership={onToggleOwnership}
        />
      ))}
    </div>
  );
}

export default CardGrid;
