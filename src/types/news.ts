export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  url: string;
  currencies: Currency[];
  domain: string;
  votes: Votes;
  metadata: {
    description: string;
    image: string;
    author?: string;
    readingTime?: string;
    tags?: string[];
  };
}

export interface Currency {
  code: string;
  title: string;
  slug: string;
  url: string;
}

export interface Votes {
  negative: number;
  positive: number;
  important: number;
  liked: number;
  disliked: number;
  lol: number;
  toxic: number;
  saved: number;
  comments: number;
}

export type NewsFilter = 'rising' | 'hot' | 'bullish' | 'bearish' | 'important' | 'saved';