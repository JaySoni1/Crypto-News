import React from 'react';
import { Flame, TrendingUp, ArrowUpCircle, ArrowDownCircle, Star, Bookmark } from 'lucide-react';
import type { NewsFilter } from '../types/news';

interface NewsFiltersProps {
  currentFilter: NewsFilter;
  onFilterChange: (filter: NewsFilter) => void;
}

export function NewsFilters({ currentFilter, onFilterChange }: NewsFiltersProps) {
  const filters: Array<{ value: NewsFilter; label: string; icon: React.ReactNode }> = [
    { value: 'hot', label: 'Hot', icon: <Flame className="w-4 h-4" /> },
    { value: 'rising', label: 'Rising', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'bullish', label: 'Bullish', icon: <ArrowUpCircle className="w-4 h-4" /> },
    { value: 'bearish', label: 'Bearish', icon: <ArrowDownCircle className="w-4 h-4" /> },
    { value: 'important', label: 'Important', icon: <Star className="w-4 h-4" /> },
    { value: 'saved', label: 'Saved', icon: <Bookmark className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            ${currentFilter === value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
          `}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}