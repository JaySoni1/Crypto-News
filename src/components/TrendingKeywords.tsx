import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { NewsArticle } from '../types/news';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TrendingKeywordsProps {
  articles: NewsArticle[];
}

export function TrendingKeywords({ articles }: TrendingKeywordsProps) {
  const keywordData = useMemo(() => {
    const keywords = new Map<string, number>();
    
    articles.forEach(article => {
      article.currencies.forEach(currency => {
        const count = keywords.get(currency.code) || 0;
        keywords.set(currency.code, count + 1);
      });
    });

    const sortedKeywords = Array.from(keywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      labels: sortedKeywords.map(([code]) => code),
      data: sortedKeywords.map(([, count]) => count),
    };
  }, [articles]);

  const chartData = {
    labels: keywordData.labels,
    datasets: [
      {
        label: 'Mentions',
        data: keywordData.data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Trending Cryptocurrencies',
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <Bar data={chartData} options={options} />
    </div>
  );
}