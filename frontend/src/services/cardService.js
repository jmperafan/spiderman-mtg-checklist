import cardsData from '../data/cards.json';
import storageService from './storageService';

class CardService {
  constructor() {
    this.cards = cardsData;
  }

  getCards(filters = {}) {
    let filtered = [...this.cards];

    if (filters.set) {
      filtered = filtered.filter(card => card.set === filters.set);
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

    if (filters.owned) {
      filtered = filtered.filter(card => {
        const hasAnyVariant = card.owned || card.ownedFoil;
        const hasNoVariants = !card.owned && !card.ownedFoil;

        switch (filters.owned) {
          case 'owned':
            // Has at least one variant
            return hasAnyVariant;

          case 'not-owned':
            // Has no variants at all
            return hasNoVariants;

          case 'all-variants-owned':
            // Has all available variants (both regular and foil if both exist)
            if (card.hasNonfoil && card.hasFoil) {
              return card.owned && card.ownedFoil;
            } else if (card.hasNonfoil) {
              return card.owned;
            } else if (card.hasFoil) {
              return card.ownedFoil;
            }
            return false;

          case 'all-variants-not-owned':
            // Missing all available variants
            if (card.hasNonfoil && card.hasFoil) {
              return !card.owned && !card.ownedFoil;
            } else if (card.hasNonfoil) {
              return !card.owned;
            } else if (card.hasFoil) {
              return !card.ownedFoil;
            }
            return false;

          case 'incomplete-variants':
            // Has some but not all variants (only applies to cards with both variants)
            if (card.hasNonfoil && card.hasFoil) {
              return (card.owned && !card.ownedFoil) || (!card.owned && card.ownedFoil);
            }
            return false;

          // Legacy support for old filter values
          case 'true':
            return hasAnyVariant;
          case 'false':
            return hasNoVariants;

          default:
            return true;
        }
      });
    }

    return filtered;
  }

  getFilterOptions() {
    const sets = [...new Set(this.cards.map(card => card.set))].sort();
    const rarities = ['Common', 'Uncommon', 'Rare', 'Mythic Rare'];

    return { sets, rarities };
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
