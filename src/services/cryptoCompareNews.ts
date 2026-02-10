import axios from 'axios';
import type { Currency, NewsArticle } from '../types/news';

type CryptoCompareNewsItem = {
  id: string;
  published_on: number;
  imageurl: string;
  title: string;
  url: string;
  body: string;
  tags?: string;
  upvotes?: number;
  downvotes?: number;
  categories?: string;
  source_info?: {
    name?: string;
    img?: string;
    lang?: string;
  };
  source?: string;
};

type CryptoCompareNewsResponse = {
  Data?: CryptoCompareNewsItem[];
};

const CATEGORY_EXCLUDE = new Set([
  'MARKET',
  'TRADING',
  'CRYPTOCURRENCY',
  'BLOCKCHAIN',
  'REGULATION',
  'POLITICS',
  'TECHNOLOGY',
  'BUSINESS',
  'NFT',
  'DEFI',
  'MINING',
  'EXCHANGE',
  'ALTCOIN',
  'STABLECOIN',
  'SECURITY',
  'ANALYSIS',
]);

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function estimateReadingTime(text: string): string | undefined {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (!words) return undefined;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function parseTags(raw: string | undefined): string[] | undefined {
  if (!raw) return undefined;
  const tags = raw
    .split(/[|,]/g)
    .map((t) => t.trim())
    .filter(Boolean);
  return tags.length ? Array.from(new Set(tags)).slice(0, 12) : undefined;
}

function extractCurrencies(item: CryptoCompareNewsItem): Currency[] {
  const tokens = new Set<string>();

  const categories = item.categories?.split('|').map((c) => c.trim()) ?? [];
  for (const c of categories) {
    if (!c) continue;
    if (!/^[A-Z0-9]{2,8}$/.test(c)) continue;
    if (CATEGORY_EXCLUDE.has(c)) continue;
    tokens.add(c);
  }

  // If categories don’t contain tickers, try to infer from title/body (best-effort).
  if (tokens.size === 0) {
    const text = `${item.title} ${item.body ?? ''}`;
    const matches = text.match(/\b[A-Z]{2,5}\b/g) ?? [];
    for (const m of matches) {
      if (CATEGORY_EXCLUDE.has(m)) continue;
      tokens.add(m);
      if (tokens.size >= 5) break;
    }
  }

  return Array.from(tokens)
    .slice(0, 5)
    .map((code) => ({
      code,
      title: code,
      slug: code.toLowerCase(),
      url: '',
    }));
}

function toNewsArticle(item: CryptoCompareNewsItem): NewsArticle {
  const description = (item.body || item.title || '').trim() || 'No description available.';
  const currencies = extractCurrencies(item);
  const tags = parseTags(item.tags);

  return {
    id: Number.parseInt(item.id, 10),
    title: item.title,
    slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    published_at: new Date(item.published_on * 1000).toISOString(),
    url: item.url,
    currencies,
    domain: safeHostname(item.url),
    votes: {
      negative: item.downvotes ?? 0,
      positive: item.upvotes ?? 0,
      important: 0,
      liked: 0,
      disliked: 0,
      lol: 0,
      toxic: 0,
      saved: 0,
      comments: 0,
    },
    metadata: {
      description,
      image: item.imageurl,
      author: item.source_info?.name,
      readingTime: estimateReadingTime(description),
      tags,
    },
  };
}

function safeToArticle(item: CryptoCompareNewsItem): NewsArticle | null {
  try {
    const a = toNewsArticle(item);
    if (!Number.isFinite(a.id) || !a.title || !a.url) return null;
    return a;
  } catch {
    return null;
  }
}

export async function fetchLatestNews(opts?: { signal?: AbortSignal }): Promise<NewsArticle[]> {
  // Use relative URL so Vite dev proxy (/cc → CryptoCompare) is used when running npm run dev
  const res = await axios.get<CryptoCompareNewsResponse>('/cc/data/v2/news/', {
    params: { lang: 'EN' },
    signal: opts?.signal,
    timeout: 15000,
    validateStatus: (status) => status === 200,
  });

  const raw = res.data;
  if (raw && typeof raw === 'object' && 'Response' in raw && (raw as { Response?: string }).Response === 'Error') {
    const msg = (raw as { Message?: string }).Message ?? 'API returned an error';
    throw new Error(msg);
  }

  const items = Array.isArray((raw as CryptoCompareNewsResponse).Data) ? (raw as CryptoCompareNewsResponse).Data! : [];
  const articles = items
    .map(safeToArticle)
    .filter((a): a is NewsArticle => a != null)
    .slice(0, 50);
  return articles;
}

