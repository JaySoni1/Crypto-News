import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, ExternalLink, ThumbsUp, ThumbsDown, MessageCircle, Bookmark, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { NewsArticle } from '../types/news';

interface NewsDetailProps {
  articles: NewsArticle[];
}

export function NewsDetail({ articles }: NewsDetailProps) {
  const { id } = useParams<{ id: string }>();
  const article = articles.find(a => a.id === Number(id));

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to news list
        </Link>
      </div>
    );
  }

  // Find related articles based on shared currencies or tags
  const relatedArticles = articles
    .filter(a => a.id !== article.id)
    .filter(a => {
      const sharedCurrencies = a.currencies.some(c => 
        article.currencies.some(ac => ac.code === c.code)
      );
      const sharedTags = article.metadata.tags?.some(tag => 
        a.metadata.tags?.includes(tag)
      );
      return sharedCurrencies || sharedTags;
    })
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to news list
      </Link>

      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {article.metadata.image && (
          <img
            src={article.metadata.image}
            alt={article.title}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.currencies.map((currency) => (
              <span
                key={currency.code}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full"
              >
                {currency.code}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            {article.metadata.author && (
              <span className="font-medium">{article.metadata.author}</span>
            )}
            <span>{formatDistanceToNow(new Date(article.published_at))} ago</span>
            {article.metadata.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.metadata.readingTime}
              </span>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none mb-6">
            {article.metadata.description.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {article.metadata.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t dark:border-gray-700 pt-6">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600">
                <ThumbsUp className="w-5 h-5" />
                <span>{article.votes.positive}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-600">
                <ThumbsDown className="w-5 h-5" />
                <span>{article.votes.negative}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600">
                <MessageCircle className="w-5 h-5" />
                <span>{article.votes.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-yellow-600">
                <Bookmark className="w-5 h-5" />
                <span>{article.votes.saved}</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600">
                <Share2 className="w-5 h-5" />
                Share
              </button>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600"
              >
                <ExternalLink className="w-5 h-5" />
                Read original
              </a>
            </div>
          </div>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                to={`/news/${relatedArticle.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {relatedArticle.metadata.image && (
                  <img
                    src={relatedArticle.metadata.image}
                    alt={relatedArticle.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {formatDistanceToNow(new Date(relatedArticle.published_at))} ago
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}