const https = require('https');
const fs = require('fs');

async function fetchAllCards() {
  const cards = [];
  let url = 'https://api.scryfall.com/cards/search?q=set:spm+OR+set:spe+OR+set:mar+OR+set:tspm&unique=prints&format=json';

  while (url) {
    console.log('Fetching:', url);
    const data = await fetchUrl(url);

    if (!data || !data.data) {
      console.error('Invalid API response:', data);
      break;
    }

    if (data.data.length === 0) {
      console.log('No more cards found');
      break;
    }

    console.log(`Found ${data.data.length} cards in this page`);
    cards.push(...data.data.map(card => {
      let imageUrl = null;
      if (card.image_uris) {
        imageUrl = card.image_uris.large || card.image_uris.normal;
      } else if (card.card_faces && card.card_faces.length > 0 && card.card_faces[0].image_uris) {
        imageUrl = card.card_faces[0].image_uris.large || card.card_faces[0].image_uris.normal;
      }
      if (!imageUrl) {
        imageUrl = 'https://via.placeholder.com/250x350/1a1a2e/dc143c?text=' + encodeURIComponent(card.name);
      }

      return {
        id: card.id,
        name: card.name,
        setNumber: card.collector_number,
        subset: getSubset(card),
        rarity: capitalizeRarity(card.rarity),
        price: parseFloat(card.prices.usd || card.prices.usd_foil || card.prices.eur || card.prices.eur_foil || 0.25),
        foilPrice: parseFloat(card.prices.usd_foil || card.prices.eur_foil || 0),
        source: getSource(card),
        imageUrl: imageUrl,
        hasFoil: (card.finishes || []).includes('foil'),
        hasNonfoil: (card.finishes || []).includes('nonfoil'),
        type_line: card.type_line || ''
      };
    }));

    url = data.has_more ? data.next_page : null;

    if (url) await sleep(100);
  }

  return cards;
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'SpiderManMTGCollectionTracker/1.0',
        'Accept': 'application/json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function capitalizeRarity(rarity) {
  const map = {
    'common': 'Common',
    'uncommon': 'Uncommon',
    'rare': 'Rare',
    'mythic': 'Mythic Rare'
  };
  return map[rarity] || 'Common';
}

function getSubset(card) {
  if (card.set === 'tspm') {
    return 'Tokens';
  }

  if (card.set === 'spe') {
    if (parseInt(card.collector_number) <= 20) return 'Welcome Deck';
    return 'Scene Box';
  }

  if (card.set === 'mar') {
    return 'Marvel Universe';
  }

  const frameEffects = card.frame_effects || [];
  const collectorNum = parseInt(card.collector_number);

  if (card.promo || collectorNum >= 284) return 'Promo';

  if (card.collector_number === '242' || card.collector_number === '243') return 'Special Foil Infinity Stone';
  if (collectorNum >= 235 && collectorNum <= 241) return 'Textured Foil Costume';
  if (frameEffects.includes('extendedart')) return 'Extended Art';
  if (card.border_color === 'borderless' || card.full_art) {
    if (collectorNum >= 199 && collectorNum <= 207) return 'Showcase Scenes';
    if (collectorNum >= 208 && collectorNum <= 217) return 'Borderless Web-Slinger';
    if (collectorNum >= 218 && collectorNum <= 231) return 'Borderless Panel';
    if (collectorNum >= 232 && collectorNum <= 234) return 'Borderless Classic Comic';
    return 'Borderless';
  }
  if (frameEffects.includes('showcase')) return 'Showcase';
  if (collectorNum >= 189 && collectorNum <= 193) return 'Full-Art Spiderweb Lands';
  if (collectorNum >= 194 && collectorNum <= 198) return 'Basic Lands';

  return 'Main Set';
}

function getSource(card) {
  const sources = [];

  if (card.set === 'tspm') {
    sources.push('Token Insert');
    return sources;
  }

  if (card.set === 'spe') {
    if (parseInt(card.collector_number) <= 20) {
      sources.push('Welcome Deck');
    } else {
      sources.push('Scene Box');
    }
    return sources;
  }

  if (card.set === 'mar') {
    sources.push('Special Insert');
    return sources;
  }

  if (card.booster) {
    sources.push('Normal Boosters');
  }

  const frameEffects = card.frame_effects || [];
  const collectorNum = parseInt(card.collector_number);

  if (frameEffects.includes('extendedart') ||
      card.border_color === 'borderless' ||
      card.full_art ||
      (collectorNum >= 199 && collectorNum <= 243)) {
    sources.push('Collection Boosters');
  }

  if (card.promo || collectorNum >= 284) {
    sources.push('Promos');
  }

  if (sources.length === 0) {
    sources.push('Normal Boosters', 'Collection Boosters');
  }

  return sources;
}
fetchAllCards()
  .then(cards => {
    console.log(`Fetched ${cards.length} cards`);
    fs.writeFileSync(
      './backend/data/cards.json',
      JSON.stringify(cards, null, 2)
    );
    console.log('Cards saved to backend/data/cards.json');
  })
  .catch(err => {
    console.error('Error fetching cards:', err);
    process.exit(1);
  });
