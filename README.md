# Spider-Man MTG Collection Tracker

An interactive web application for tracking your Marvel Spider-Man Magic: The Gathering card collection. Built with a Spider-Man themed interface featuring web animations and a crimson and black design.

Track over 647 cards including Main Set, Extended Art, Borderless variants, Promos, Welcome Deck, Scene Box, and Marvel Universe inserts!

## Quick Start

### Deploy to GitHub Pages (Recommended)

1. Fork this repository
2. Go to Settings → Pages → Source: "GitHub Actions"
3. Push to main branch
4. Visit `https://your-username.github.io/Spiderman-Magic/`

### Run with Docker

```bash
docker compose up
```

Open <http://localhost:3000> to view the app.

## How It Works

### Data Storage

Your collection is stored in your browser's localStorage:

- ✅ Persists across sessions
- ✅ No account or login required
- ✅ Completely private
- ✅ Works offline
- ❌ Data is per-browser
- ❌ Clearing browser data erases collection

**Solution**: Use Export/Import to backup and transfer your collection!

## Project Structure

```text
Spiderman Magic/
├── .github/workflows/
│   ├── deploy-github-pages.yml    # Auto-deploy to GitHub Pages
│   ├── validate-cards.yml         # Card data validation
│   └── check-card-updates.yml     # Check for updates
├── backend/
│   ├── server.js                  # Express API (optional)
│   ├── package.json
│   └── data/
│       └── cards.json             # Card database (647+ cards)
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js                 # Main application
│       ├── components/            # React components
│       │   ├── Header.js          # Title, Export/Import
│       │   ├── Stats.js           # Collection statistics
│       │   ├── Filters.js         # Filter controls
│       │   ├── CardGrid.js        # Card grid container
│       │   └── Card.js            # Individual card display
│       ├── services/
│       │   ├── cardService.js     # Card filtering & stats
│       │   └── storageService.js  # localStorage management
│       └── data/
│           └── cards.json         # Embedded card data
└── scripts/
    ├── fetch-cards.js             # Fetch from Scryfall API
    ├── test-cards.js              # Validate card data
    └── analyze-foils.js           # Analyze foil distribution
```

## Card Sets & Subsets

The collection tracks cards from **6 sets**:

- **SPM** (Spider-Man Main Set): 345 cards including Main Set, Extended Art, Borderless variants, Showcase Scenes, Textured Foils, and Special Infinity Stone foils
- **SPE** (Spider-Man Extras): 19 cards from Welcome Deck and Scene Box exclusives
- **MAR** (Marvel Universe): 15 special insert cards
- **TSPM** (Tokens): 39 token cards
- **LMAR** (Marvel Legends Inserts): 23 special insert cards
- **PSPM** (Promos): 206 promotional cards with 2025 date stamps

## Development

### Update Card Data

Fetch latest card data from Scryfall:

```bash
npm run fetch-cards
```

### Validate Card Data

Run validation tests:

```bash
npm test
```

This validates against MTGGoldfish reference data.

### Build for Production

```bash
cd frontend
npm run build
```

Output is in `frontend/build/` directory.

## Scripts

### `fetch-cards.js`

Fetches card data from Scryfall API for sets: SPM, SPE, and MAR.

- Extracts card images, prices, finishes, and metadata
- Determines subsets based on collector numbers and frame effects
- Outputs to `backend/data/cards.json`
- Rate-limited to respect Scryfall API guidelines

### `test-cards.js`

Comprehensive validation suite:

- Total card count verification
- Card structure validation
- Subset distribution checking
- Collector number validation
- Rarity distribution analysis
- Image URL validation
- Price data verification

### `analyze-foils.js`

Analyzes foil availability across subsets.

## API Endpoints (Backend Mode)

When running with the backend:

- `GET /api/cards` - Get filtered card list
- `GET /api/filters` - Get available filter options
- `GET /api/stats` - Get collection statistics
- `GET /api/collection` - Get current collection
- `POST /api/collection/toggle/:cardId` - Toggle ownership
- `GET /health` - Health check

## Using the App

### Main Features

1. **Browse Cards**: View all 647+ cards in grid layout with card images, names, set numbers, and prices
2. **Search**: Find specific cards by name or collector number in real-time
3. **Filter by Set**: Multi-select filter for SPM, SPE, MAR, TSPM, LMAR, and PSPM sets
4. **Sort Options**:
   - Binder Order (by set, then collector number)
   - Set Number
   - Name (A-Z)
   - Price (Low to High / High to Low)
   - Rarity
5. **Advanced Ownership Filters**:
   - Owned (any variant)
   - Not Owned (no variants)
   - All Variants Owned (both regular + foil)
   - All Variants Not Owned (missing both)
   - Incomplete Variants (some but not all)
6. **Mark Owned**: Click "+ Regular" or "+ Foil" buttons to track ownership
7. **View Stats**: Real-time statistics showing:
   - Set Completion percentage with progress bar
   - Master Set completion (including foils)
   - Collection Value (total market value)
   - Per-set completion progress bars (6 bars showing % complete for each set)
8. **Export/Import**: Backup and restore your collection data

### Conditional Variant Display

Cards intelligently show ownership options based on availability:
- Cards with both regular and foil: Show both "+ Regular" and "+ Foil" buttons
- Foil-only cards: Show only "+ Foil" button
- Regular-only cards: Show only "+ Regular" button

## Collection Data Format

```json
{
  "owned": {
    "card-uuid-1": { "regular": true, "foil": false },
    "card-uuid-2": { "regular": false, "foil": true },
    "card-uuid-3": { "regular": true, "foil": true }
  },
  "version": "1.0",
  "lastUpdated": "2024-11-03T12:00:00.000Z"
}
```

## Statistics Calculation

### Main KPI Cards

- **Set Completion**: Unique cards owned ÷ total unique cards (excludes variant counting)
- **Master Set**: (Regular + Foil versions owned) ÷ total available versions (counts each variant separately)
- **Collection Value**: Sum of market prices for all owned cards (uses foil prices for foil cards, regular prices for regular cards)

### Per-Set Progress Bars

Six compact progress bars show completion percentage for each set:
- SPM (Spider-Man Main Set)
- SPE (Extras)
- MAR (Marvel Universe)
- TSPM (Tokens)
- LMAR (Legends Inserts)
- PSPM (Promos)

Progress bars automatically hide when sets are filtered out using the set filter.

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm test` to validate
5. Submit a pull request

## Troubleshooting

### Cards not loading?

- Check browser console for errors
- Ensure `cards.json` exists in `frontend/src/data/`

### Collection disappeared?

- Check if localStorage was cleared
- Restore from exported backup

### Filters not working?

- Clear all filters with "Reset All" button
- Refresh the page

### Images not loading?

- Check internet connection (images load from Scryfall CDN)
- Placeholder images will show if Scryfall is unavailable

---

**Enjoy tracking your Spider-Man MTG collection!** 🕷️🕸️
