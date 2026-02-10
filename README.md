# Crypto News Aggregator

A modern, responsive cryptocurrency news aggregator built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **News Feed**: Browse cryptocurrency news articles with filtering options
- **Search**: Search news by cryptocurrency code or name (e.g., BTC, Bitcoin, ETH)
- **Filters**: Filter news by categories (Hot, Rising, Bullish, Bearish, Important, Saved)
- **Dark Mode**: Toggle between light and dark themes
- **News Details**: Click on any article to view full details
- **Trending Keywords**: Sidebar showing trending cryptocurrency keywords
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client (ready for API integration)
- **Chart.js** - Data visualization (ready for charts)
- **Lucide React** - Icon library
- **date-fns** - Date formatting

## 📦 Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## 🏃 Running the Project

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in terminal)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── NewsCard.tsx    # News article card component
│   ├── NewsFilters.tsx # Filter buttons component
│   ├── SearchBar.tsx   # Search input component
│   └── TrendingKeywords.tsx # Trending sidebar component
├── pages/              # Page components
│   └── NewsDetail.tsx  # Individual news article page
├── types/              # TypeScript type definitions
│   └── news.ts         # News article types
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🔧 How It Works

### Current Implementation

The app loads **live crypto news from CryptoCompare** on startup (via `src/services/cryptoCompareNews.ts`). If the live API is unavailable, it automatically falls back to the `SAMPLE_ARTICLES` list in `App.tsx`.

### Data Flow

1. **App.tsx** manages the main state:
   - `allArticles` - Full list of fetched articles (live or sample fallback)
   - `filter` - Current filter (hot, rising, etc.)
   - `search` - Search query
   - `darkMode` - Theme preference
   - `savedIds` - Saved article IDs stored in `localStorage`

2. **Filtering Logic**:
   - Search matches title, tags, or currency codes
   - Filters: hot (upvotes + recency), rising (recency), bullish/bearish (keyword-based), important (BTC/ETH + regulation keywords), saved (local saved list)

3. **Components**:
   - `NewsCard` - Displays article preview with image, title, description, votes, and metadata
   - `NewsFilters` - Filter buttons for different news categories
   - `SearchBar` - Search input for filtering by cryptocurrency
   - `TrendingKeywords` - Shows trending currencies from articles
   - Save button - Bookmark icon to save/unsave articles

### Routing

- `/` - Main news feed page
- `/news/:id` - Individual article detail page

## 🔌 Live News API

Live news comes from CryptoCompare’s news endpoint.

- In development, the app calls `/cc/data/v2/news/?lang=EN`
- `vite.config.ts` proxies `/cc/*` to `https://min-api.cryptocompare.com` to avoid CORS

**Note for production builds:** Vite’s dev proxy does not exist after `npm run build`. If you deploy the static `dist/` output, you’ll need either:
- A small backend/serverless function to proxy CryptoCompare, or
- Host-level rewrites (e.g., Vercel/Netlify) that forward `/cc/*` to CryptoCompare.

## 🎨 Styling

The project uses **Tailwind CSS** with:
- Dark mode support (toggle in navbar)
- Responsive grid layouts
- Custom prose styles for article content
- Hover effects and transitions

## 📱 Features Breakdown

### News Card
- Displays article image, title, description preview
- Shows cryptocurrency tags
- Displays vote counts (positive, negative, comments)
- Shows time since publication
- Clickable to view full article

### Filters
- **Hot**: Sorted by upvotes then recency
- **Rising**: Sorted by recency
- **Bullish/Bearish**: Keyword-based
- **Important**: BTC/ETH + regulation keywords
- **Saved**: Uses bookmarks stored in `localStorage`

### Search
- Searches by cryptocurrency code (BTC, ETH) or name (Bitcoin, Ethereum)
- Real-time filtering as you type

## 🚧 Next Steps

To enhance the project:

1. **Production proxy**: Add a backend/serverless proxy for `/cc/*` for deployments
2. **Improve tagging**: Better ticker extraction for `currencies`
3. **Add Charts**: Use Chart.js to display price trends or market data
4. **User Authentication**: Add login/signup for saving articles
5. **Comments System**: Implement commenting on articles
6. **Voting System**: Make votes interactive (currently just display)

## 📄 License

This project is private and not licensed for public use.
