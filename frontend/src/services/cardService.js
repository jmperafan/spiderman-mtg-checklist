import cardsData from '../data/cards.json';
import storageService from './storageService';

class CardService {
  constructor() {
    this.cards = cardsData;
  }

  getCards(filters = {}) {
    let filtered = [...this.cards];

    if (filters.subset) {
      filtered = filtered.filter(card => card.subset === filters.subset);
    }

    if (filters.source) {
      filtered = filtered.filter(card => card.source.includes(filters.source));
    }

    if (filters.rarity) {
      filtered = filtered.filter(card => card.rarity === filters.rarity);
    }

    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      filtered = filtered.filter(card => card.price >= min);
    }

    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      filtered = filtered.filter(card => card.price <= max);
    }

    const ownedCards = storageService.getOwnedCards();
    filtered = filtered.map(card => ({
      ...card,
      owned: ownedCards[card.id]?.regular || false,
      ownedFoil: ownedCards[card.id]?.foil || false
    }));

    if (filters.owned === 'true') {
      filtered = filtered.filter(card => card.owned || card.ownedFoil);
    } else if (filters.owned === 'false') {
      filtered = filtered.filter(card => !card.owned && !card.ownedFoil);
    }

    return filtered;
  }

  getFilterOptions() {
    const subsets = [...new Set(this.cards.map(card => card.subset))].sort();
    const sources = [...new Set(this.cards.flatMap(card => card.source))].sort();
    const rarities = ['Common', 'Uncommon', 'Rare', 'Mythic Rare'];

    return { subsets, sources, rarities };
  }

  getStats(filteredCards = null) {
    const ownedCards = storageService.getOwnedCards();
    const cardsToAnalyze = filteredCards || this.cards;

    let totalCards = 0;
    let uniqueOwned = 0;
    let totalMasterCards = 0;
    let ownedMasterCards = 0;
    let totalValue = 0;
    let ownedValue = 0;

    cardsToAnalyze.forEach(card => {
      const ownership = ownedCards[card.id];

      totalCards++;
      totalValue += card.price;

      if (card.hasNonfoil) totalMasterCards++;
      if (card.hasFoil) totalMasterCards++;

      if (ownership) {
        if (ownership.regular || ownership.foil) {
          uniqueOwned++;
        }

        if (ownership.regular && card.hasNonfoil) ownedMasterCards++;
        if (ownership.foil && card.hasFoil) ownedMasterCards++;

        if (ownership.regular) {
          ownedValue += card.price;
        }
        if (ownership.foil && card.foilPrice) {
          ownedValue += card.foilPrice;
        }
      }
    });

    const percentage = totalCards > 0 ? (uniqueOwned / totalCards) * 100 : 0;
    const masterPercentage = totalMasterCards > 0 ? (ownedMasterCards / totalMasterCards) * 100 : 0;

    return {
      totalCards,
      uniqueOwned,
      percentage: parseFloat(percentage.toFixed(1)),
      totalMasterCards,
      ownedMasterCards,
      masterPercentage: parseFloat(masterPercentage.toFixed(1)),
      totalValue: parseFloat(totalValue.toFixed(2)),
      ownedValue: parseFloat(ownedValue.toFixed(2))
    };
  }

  toggleCardOwnership(cardId, foil = false) {
    return storageService.toggleCard(cardId, foil);
  }
}

export default new CardService();
