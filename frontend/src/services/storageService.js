import collectionData from '../data/collection.json';

class StorageService {
  getOwnedCards() {
    return collectionData.owned;
  }
}

export default new StorageService();
