# Spider-Man MTG Collection Tracker

A beautiful, interactive web application for tracking your Spider-Man Magic: The Gathering card collection. Built with a Spider-Man themed portal interface featuring web animations and a sleek dark design.

## Features

- **Card Checklist**: Check off cards you own with a single click
- **Advanced Filtering**: Filter by subset, source (Collection Boosters, Promos, Normal Boosters), rarity, price range, and ownership status
- **Search**: Quickly find cards by name or set number
- **Collection Stats**: Track your progress with real-time statistics showing owned cards, completion percentage, and collection value
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Spider-Man Theme**: Animated web patterns, crimson and black color scheme, and thematic UI elements

## Quick Start

Simply run:

```bash
docker compose up
```

Then open your browser to **http://localhost:3000**

That's it! The application will automatically:
- Build the frontend and backend containers
- Start the API server on port 3001
- Serve the web interface on port 3000
- Persist your collection data

## Tech Stack

- **Frontend**: React with custom CSS animations
- **Backend**: Node.js/Express API
- **Database**: JSON file storage (persistent via Docker volumes)
- **Deployment**: Docker Compose

## Project Structure

```
.
├── docker-compose.yml          # Docker orchestration
├── backend/
│   ├── Dockerfile
│   ├── server.js              # Express API
│   ├── package.json
│   └── data/
│       ├── cards.json         # Card database
│       └── user-collection.json  # Your collection (auto-created)
└── frontend/
    ├── Dockerfile
    ├── nginx.conf             # Nginx configuration
    ├── package.json
    ├── public/
    └── src/
        ├── App.js             # Main application
        ├── components/        # React components
        │   ├── Header
        │   ├── Stats
        │   ├── Filters
        │   ├── CardGrid
        │   └── Card
        └── ...
```

## Customizing Your Card Database

The sample cards are located in `backend/data/cards.json`. To add your actual Spider-Man MTG cards:

1. Edit `backend/data/cards.json`
2. Follow this format for each card:

```json
{
  "id": "unique-id",
  "name": "Card Name",
  "setNumber": "001",
  "subset": "Main Set",
  "rarity": "Rare",
  "price": 12.50,
  "source": ["Normal Boosters", "Collection Boosters"],
  "imageUrl": "https://your-image-url.jpg"
}
```

3. Restart the containers: `docker compose restart`

## Available Filters

- **Search**: Filter by card name or set number
- **Subset**: Main Set, Extended Art, Borderless, Promo, etc.
- **Source**: Collection Boosters, Normal Boosters, Promos
- **Rarity**: Common, Uncommon, Rare, Mythic Rare
- **Price Range**: Set minimum and maximum price
- **Ownership**: Show all cards, only owned, or only missing

## API Endpoints

- `GET /api/cards` - Get all cards with optional filters
- `GET /api/filters` - Get available filter options
- `GET /api/stats` - Get collection statistics
- `GET /api/collection` - Get owned card IDs
- `POST /api/collection/toggle/:cardId` - Toggle card ownership

## Development Mode

To run in development mode with hot reloading:

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Stopping the Application

```bash
docker compose down
```

To also remove the data volume (this will reset your collection):

```bash
docker compose down -v
```

## Notes

- Your collection data is stored in `backend/data/user-collection.json`
- Card images use placeholder URLs by default - replace with actual Scryfall or official images
- The application uses local storage in Docker volumes, so your progress persists between sessions
- All filters work in combination for powerful search capabilities

## Future Enhancements

Some ideas for extending the application:
- Import cards from Scryfall API
- Export collection to CSV
- Price tracking over time
- Trading/wishlist features
- Multi-user support with authentication
- Card conditions and notes

---

**Enjoy tracking your Spider-Man MTG collection!** 🕷️🕸️
