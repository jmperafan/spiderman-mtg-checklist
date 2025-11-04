import React from 'react';
import './Card.css';

function Card({ card, onToggleOwnership }) {
  const handleToggle = (foil = false) => {
    onToggleOwnership(card.id, foil);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Mythic Rare':
        return '#ff8c00';
      case 'Rare':
        return '#ffd700';
      case 'Uncommon':
        return '#c0c0c0';
      case 'Common':
        return '#8b8b8b';
      default:
        return '#fff';
    }
  };

  const hasAnyVersion = card.owned || card.ownedFoil;

  return (
    <div className={`card ${hasAnyVersion ? 'owned' : ''}`}>
      <div className="card-header">
        <span className="card-number">#{card.setNumber}</span>
        <span
          className="card-rarity"
          style={{ color: getRarityColor(card.rarity) }}
        >
          {card.rarity}
        </span>
      </div>

      <div className="card-image-container">
        <img
          src={card.imageUrl}
          alt={card.name}
          className="card-image"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/250x350/1a1a2e/dc143c?text=${encodeURIComponent(card.name)}`;
          }}
        />
        {hasAnyVersion && (
          <div className="owned-overlay">
            <div className="checkmark-container">
              {card.owned && <div className="checkmark">✓</div>}
              {card.ownedFoil && <div className="checkmark foil">✦</div>}
            </div>
          </div>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-name">{card.name}</h3>

        <div className="card-info">
          <div className="info-row">
            <span className="info-label">Subset:</span>
            <span className="info-value">{card.subset}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Price:</span>
            <div className="price-container">
              <span className="info-value price">${card.price.toFixed(2)}</span>
              {card.hasFoil && card.foilPrice > 0 && (
                <>
                  <span className="price-separator"> - </span>
                  <span className="info-value foil-price">${card.foilPrice.toFixed(2)}</span>
                </>
              )}
            </div>
          </div>

          <div className="info-row">
            <span className="info-label">Set:</span>
            <span className="info-value">{card.set}</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        {card.hasNonfoil && (
          <button
            className={`toggle-btn ${card.owned ? 'owned' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggle(false);
            }}
          >
            {card.owned ? '✓ Owned' : '+ Regular'}
          </button>
        )}
        {card.hasFoil && (
          <button
            className={`toggle-btn foil-btn ${card.ownedFoil ? 'owned' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggle(true);
            }}
          >
            {card.ownedFoil ? '✦ Foil' : '+ Foil'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;
