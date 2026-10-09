import React from 'react';
import { useStore } from '../../context/StoreContext';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, onSelectCategory }) => {
  const { categories, products } = useStore();

  const totalPublished = products.filter((p) => p.isPublished).length;

  return (
    <div className="bg-white border-b border-neutral-200 sticky top-18 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectCategory('All')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            All Items ({totalPublished})
          </button>

          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.isPublished && p.category.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.name
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
