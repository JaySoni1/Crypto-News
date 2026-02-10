import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Moon, Sun } from 'lucide-react';
import { NewsCard } from './components/NewsCard';
import { NewsFilters } from './components/NewsFilters';
import { SearchBar } from './components/SearchBar';
import { TrendingKeywords } from './components/TrendingKeywords';
import { NewsDetail } from './pages/NewsDetail';
import { fetchLatestNews } from './services/cryptoCompareNews';
import type { NewsArticle, NewsFilter } from './types/news';

// Sample data for demonstration
const SAMPLE_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: "Bitcoin Surges Past $50,000 as Institutional Interest Grows",
    slug: "bitcoin-surges",
    published_at: new Date().toISOString(),
    url: "https://example.com/bitcoin-surge",
    currencies: [{ code: "BTC", title: "Bitcoin", slug: "bitcoin", url: "" }],
    domain: "example.com",
    votes: { negative: 0, positive: 42, important: 10, liked: 38, disliked: 2, lol: 0, toxic: 0, saved: 15, comments: 8 },
    metadata: {
      description: "Bitcoin has surged past $50,000 for the first time since December 2021, as institutional investors continue to show strong interest in the cryptocurrency market. The milestone comes as several major financial institutions announce new Bitcoin investment products and services.\n\nAnalysts attribute the price increase to growing institutional adoption and the upcoming Bitcoin halving event. Market data shows significant accumulation by both retail and institutional investors, with exchange outflows reaching new highs.\n\nThe surge has also positively impacted the broader cryptocurrency market, with several altcoins seeing double-digit percentage gains. Trading volumes across major exchanges have increased substantially, indicating renewed market interest.",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200",
      author: "Sarah Johnson",
      readingTime: "5 min read",
      tags: ["Bitcoin", "Cryptocurrency", "Market Analysis", "Institutional Investment"]
    }
  },
  {
    id: 2,
    title: "Ethereum 2.0 Upgrade Shows Strong Progress in Testing Phase",
    slug: "ethereum-2-progress",
    published_at: new Date(Date.now() - 3600000).toISOString(),
    url: "https://example.com/ethereum-2-progress",
    currencies: [{ code: "ETH", title: "Ethereum", slug: "ethereum", url: "" }],
    domain: "example.com",
    votes: { negative: 2, positive: 35, important: 8, liked: 30, disliked: 2, lol: 0, toxic: 0, saved: 12, comments: 5 },
    metadata: {
      description: "The Ethereum 2.0 upgrade continues to show promising results in its testing phase, with developers reporting significant improvements in scalability and energy efficiency. The latest testnet data reveals a 99% reduction in energy consumption and transaction costs.\n\nStaking participation has reached an all-time high, with over 500,000 validators securing the network. The development team has successfully implemented several crucial protocol improvements, including enhanced validator performance and reduced network congestion.\n\nThe upgrade's success has attracted attention from enterprise users, with several major companies announcing plans to build on the Ethereum network. The community response has been overwhelmingly positive, with developers praising the improved tooling and documentation.",
      image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1200",
      author: "Michael Chen",
      readingTime: "7 min read",
      tags: ["Ethereum", "Blockchain", "Technology", "Cryptocurrency"]
    }
  },
  {
    id: 3,
    title: "Cardano Launches New DeFi Protocol, ADA Price Surges",
    slug: "cardano-defi-launch",
    published_at: new Date(Date.now() - 7200000).toISOString(),
    url: "https://example.com/cardano-defi",
    currencies: [{ code: "ADA", title: "Cardano", slug: "cardano", url: "" }],
    domain: "example.com",
    votes: { negative: 1, positive: 28, important: 5, liked: 25, disliked: 1, lol: 0, toxic: 0, saved: 8, comments: 3 },
    metadata: {
      description: "Cardano's ecosystem expands with the launch of a new DeFi protocol, leading to a significant price increase for ADA as traders react to the news. The protocol introduces innovative features for decentralized lending and borrowing, with built-in security measures to protect users.\n\nThe launch has been accompanied by comprehensive security audits and gradual rollout phases to ensure system stability. Early adoption metrics show strong user engagement, with over $100 million in total value locked within the first 24 hours.\n\nThe development team has emphasized the protocol's focus on regulatory compliance and sustainable growth, setting it apart from competitors in the DeFi space. Community feedback has highlighted the user-friendly interface and transparent documentation.",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200",
      author: "Elena Rodriguez",
      readingTime: "6 min read",
      tags: ["Cardano", "DeFi", "Blockchain", "Cryptocurrency"]
    }
  },
  {
    id: 4,
    title: "New Regulatory Framework Proposed for Cryptocurrency Trading",
    slug: "crypto-regulations",
    published_at: new Date(Date.now() - 10800000).toISOString(),
    url: "https://example.com/crypto-regulations",
    currencies: [{ code: "BTC", title: "Bitcoin", slug: "bitcoin", url: "" }, { code: "ETH", title: "Ethereum", slug: "ethereum", url: "" }],
    domain: "example.com",
    votes: { negative: 5, positive: 45, important: 15, liked: 40, disliked: 5, lol: 0, toxic: 0, saved: 20, comments: 12 },
    metadata: {
      description: "Global financial regulators have proposed a new framework for cryptocurrency trading, aiming to create a balanced approach between innovation and consumer protection. The proposal includes guidelines for exchange operations, custody services, and DeFi protocols.\n\nThe framework emphasizes transparency requirements, capital reserves, and regular auditing procedures. Industry leaders have generally responded positively, noting that clear regulations could encourage institutional participation.\n\nImplementation timelines and specific requirements vary by jurisdiction, with some countries planning to adopt the framework by early next year. The proposal also addresses environmental concerns related to crypto mining and suggests incentives for sustainable practices.",
      image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=1200",
      author: "Robert Williams",
      readingTime: "8 min read",
      tags: ["Regulation", "Cryptocurrency", "Policy", "Global Markets"]
    }
  }
];

const SAVED_IDS_KEY = 'crypto_news_saved_ids_v1';

function includesAny(text: string, needles: string[]): boolean {
  const hay = text.toLowerCase();
  return needles.some((n) => hay.includes(n));
}

function filterAndSortArticles(params: {
  all: NewsArticle[];
  filter: NewsFilter;
  search: string;
  savedIds: number[];
}): NewsArticle[] {
  const { all, filter, search, savedIds } = params;
  const q = search.trim().toLowerCase();

  const matchesSearch = (a: NewsArticle) => {
    if (!q) return true;
    if (a.title.toLowerCase().includes(q)) return true;
    if (a.metadata.tags?.some((t) => t.toLowerCase().includes(q))) return true;
    return a.currencies.some((c) => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q));
  };

  let filtered = all.filter(matchesSearch);

  if (filter === 'saved') {
    const set = new Set(savedIds);
    filtered = filtered.filter((a) => set.has(a.id));
  } else if (filter === 'bullish' || filter === 'bearish') {
    const bullish = ['surge', 'rally', 'breakout', 'soar', 'gain', 'bull', 'up', 'higher', 'records', 'ath'];
    const bearish = ['drop', 'plunge', 'sell-off', 'crash', 'dump', 'bear', 'down', 'lower', 'loss', 'slump'];
    const needles = filter === 'bullish' ? bullish : bearish;
    const keywordMatched = filtered.filter((a) =>
      includesAny(`${a.title}\n${a.metadata.description ?? ''}`, needles)
    );
    // If nothing matches, don’t show an empty page; just fall back to recency.
    filtered = keywordMatched.length ? keywordMatched : filtered;
  } else if (filter === 'important') {
    filtered = filtered.filter((a) => a.currencies.some((c) => c.code === 'BTC' || c.code === 'ETH') || includesAny(a.title, ['sec', 'etf', 'regulat']));
  }

  // Sorting rules
  const byPublishedDesc = (a: NewsArticle, b: NewsArticle) =>
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime();

  if (filter === 'hot') {
    filtered = [...filtered].sort((a, b) => (b.votes.positive - a.votes.positive) || byPublishedDesc(a, b));
  } else {
    filtered = [...filtered].sort(byPublishedDesc);
  }

  return filtered;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>(SAMPLE_ARTICLES);
  const [filter, setFilter] = useState<NewsFilter>('hot');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_IDS_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      if (Array.isArray(parsed)) return parsed.filter((x): x is number => typeof x === 'number');
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(SAVED_IDS_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSaved = (id: number) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const loadNews = useCallback(async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      setError(null);
      const live = await fetchLatestNews({ signal: controller.signal });
      if (live.length) {
        setAllArticles(live);
      } else {
        setError('Live news API returned no articles. Showing sample articles.');
        setAllArticles(SAMPLE_ARTICLES);
      }
    } catch (e) {
      const msg = axios.isAxiosError(e)
        ? e.response?.data?.Message ?? e.response?.status ?? e.message
        : e instanceof Error
          ? e.message
          : 'Unknown error';
      const reason = typeof msg === 'number' ? `HTTP ${msg}` : String(msg);
      console.error('Error fetching live news:', e);
      setError(`Live news unavailable (${reason}). Showing sample articles.`);
      setAllArticles(SAMPLE_ARTICLES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const visibleArticles = useMemo(
    () => filterAndSortArticles({ all: allArticles, filter, search, savedIds }),
    [allArticles, filter, search, savedIds]
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <nav className="bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Crypto News</h1>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="mb-8 space-y-4">
                    <SearchBar value={search} onChange={setSearch} />
                    <NewsFilters currentFilter={filter} onFilterChange={setFilter} />
                  </div>

                  {error && (
                    <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-900 px-4 py-3 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-100 flex flex-wrap items-center justify-between gap-2">
                      <span>{error}</span>
                      <button
                        type="button"
                        onClick={() => { setError(null); loadNews(); }}
                        className="px-3 py-1 rounded bg-yellow-200 dark:bg-yellow-800 hover:bg-yellow-300 dark:hover:bg-yellow-700 font-medium"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      {loading ? (
                        <div className="text-center py-8">Loading...</div>
                      ) : visibleArticles.length > 0 ? (
                        visibleArticles.map((article) => (
                          <NewsCard
                            key={article.id}
                            article={article}
                            isSaved={savedIds.includes(article.id)}
                            onToggleSaved={toggleSaved}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          No articles found matching your criteria
                        </div>
                      )}
                    </div>
                    <div className="space-y-6">
                      <TrendingKeywords articles={visibleArticles} />
                    </div>
                  </div>
                </>
              }
            />
            <Route
              path="/news/:id"
              element={<NewsDetail articles={allArticles} savedIds={savedIds} onToggleSaved={toggleSaved} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;