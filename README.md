# Spider-Man MTG Collection Tracker

A beautiful, interactive web application for tracking your Marvel Spider-Man Magic: The Gathering card collection. Built with a Spider-Man themed interface featuring web animations and a sleek crimson and black design.

Track over 647 cards including Main Set, Extended Art, Borderless variants, Promos, Welcome Deck, Scene Box, and Marvel Universe inserts!

## Features

- **Complete Card Database**: Track all 647+ cards from the Marvel Spider-Man set
- **Dual Ownership Tracking**: Mark both regular and foil versions independently
- **Advanced Filtering**: Filter by subset, source, rarity, price range, and ownership status
- **Multiple Sort Options**: Binder order, set number, name, price, or rarity
- **Smart Search**: Find cards by name or collector number
- **Collection Statistics**:
  - Set completion percentage (unique cards)
  - Master set tracking (regular + foil versions)
  - Collection value calculator
  - Real-time progress bars
- **Export/Import**: Download and restore your collection as JSON
- **Browser Storage**: Automatic saving using localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Spider-Man Theme**: Animated web patterns and thematic UI
- **No Backend Required**: Runs entirely in the browser

## Quick Start

### Deploy to GitHub Pages (Recommended)

1. Fork this repository
2. Go to Settings → Pages → Source: "GitHub Actions"
3. Push to main branch
4. Visit `https://your-username.github.io/Spiderman-Magic/`

### Run Locally

```bash
cd frontend
npm install
npm start
```

Open <http://localhost:3000> to view the app.

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

## Available Filters

- **Sort By**: Binder Order, Set Number, Name, Price (Low/High), Rarity
- **Search**: Card name or collector number
- **Subset**: Main Set, Extended Art, Borderless, Showcase, Promos, etc.
- **Source**: Normal Boosters, Collection Boosters, Promos, Special Inserts
- **Rarity**: Common, Uncommon, Rare, Mythic Rare
- **Price Range**: Minimum and maximum price
- **Ownership**: All Cards, Owned Only, Missing Only

## Card Subsets

The collection includes these subsets:

- **Main Set** (198 cards): Core set cards #1-198
- **Extended Art**: Alternate art versions from Collection Boosters
- **Borderless Variants**: Web-Slinger, Panel, Classic Comic styles
- **Showcase Scenes**: Special borderless scene cards
- **Textured Foil Costume**: Premium textured foils
- **Special Foil Infinity Stone**: Unique promotional cards
- **Full-Art Spiderweb Lands**: Borderless basic lands
- **Welcome Deck**: Starter deck exclusive cards
- **Scene Box**: Scene box exclusive cards
- **Marvel Universe**: Special insert cards
- **Promos**: Buy-a-Box, Bundle, and other promotional cards

## Tech Stack

### Frontend

- React 18.2.0
- Custom CSS with animations
- Browser localStorage API
- FileReader API (import/export)

### Backend (Optional)

- Node.js 18
- Express 4.18.2
- CORS support

### DevOps

- Docker & Docker Compose
- GitHub Actions CI/CD
- GitHub Pages deployment
- Automated card validation

### Data Source

- Scryfall API
- MTGGoldfish validation

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

1. **Browse Cards**: View all cards in the database
2. **Search**: Find specific cards by name or number
3. **Filter**: Use dropdowns to narrow results
4. **Mark Owned**: Click "+ Regular" or "+ Foil" buttons
5. **View Stats**: Check progress at the top of the page
6. **Export**: Download collection backup
7. **Import**: Restore from backup file

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

- **Set Completion**: Unique cards owned ÷ total unique cards
- **Master Set**: (Regular + Foil versions owned) ÷ total available versions
- **Collection Value**: Sum of prices for owned cards (including foil premiums)

## License

MIT License - Feel free to fork and customize!

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
