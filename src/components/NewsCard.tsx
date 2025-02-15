import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Share2, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import type { NewsArticle } from '../types/news';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      {article.metadata.image && (
        <img 
          src={article.metadata.image} 
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          {article.currencies.map((currency) => (
            <span 
              key={currency.code}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm"
            >
              {currency.code}
            </span>
          ))}
        </div>
        <Link to={`/news/${article.id}`}>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
            {article.title}
          </h2>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {article.metadata.description?.slice(0, 150)}...
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{article.votes.positive}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="w-4 h-4" />
              <span>{article.votes.negative}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{article.votes.comments}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-blue-600">
              <Share2 className="w-4 h-4" />
            </button>
            <span>{formatDistanceToNow(new Date(article.published_at))} ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}