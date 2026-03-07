const COLLECTION_KEY = 'spiderman_mtg_collection';
const COLLECTION_VERSION = '1.0';

class StorageService {
  getCollection() {
    try {
      const data = localStorage.getItem(COLLECTION_KEY);
      if (!data) {
        return { owned: {}, version: COLLECTION_VERSION };
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading collection from localStorage:', error);
      return { owned: {}, version: COLLECTION_VERSION };
    }
  }

  saveCollection(collection) {
    try {
      localStorage.setItem(COLLECTION_KEY, JSON.stringify({
        ...collection,
        version: COLLECTION_VERSION,
        lastUpdated: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.error('Error saving collection to localStorage:', error);
      return false;
    }
  }

  toggleCard(cardId, foil = false) {
    const collection = this.getCollection();

    if (!collection.owned[cardId]) {
      collection.owned[cardId] = { regular: false, foil: false };
    }

    if (foil) {
      collection.owned[cardId].foil = !collection.owned[cardId].foil;
    } else {
      collection.owned[cardId].regular = !collection.owned[cardId].regular;
    }

    if (!collection.owned[cardId].regular && !collection.owned[cardId].foil) {
      delete collection.owned[cardId];
    }

    this.saveCollection(collection);
    return collection.owned[cardId];
  }

  getOwnedCards() {
    const collection = this.getCollection();
    return collection.owned;
  }

  exportCollection() {
    const collection = this.getCollection();
    const dataStr = JSON.stringify(collection, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `spiderman-mtg-collection-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  importCollection(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);

          if (!imported.owned || typeof imported.owned !== 'object') {
            reject(new Error('Invalid collection file format'));
            return;
          }

          this.saveCollection(imported);
          resolve(imported);
        } catch (error) {
          reject(new Error('Failed to parse collection file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  clearCollection() {
    try {
      localStorage.removeItem(COLLECTION_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing collection:', error);
      return false;
    }
  }
}

export default new StorageService();
