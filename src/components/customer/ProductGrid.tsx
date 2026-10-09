import React, { useState, useMemo } from 'react';
import { Product } from '../../types/ecommerce';
import { ProductCard } from './ProductCard';
import { useStore } from '../../context/StoreContext';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

interface ProductGridProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  selectedCategory,
  onSelectCategory,
  onQuickView,
}) => {
  const { products, formatPrice } = useStore();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating' | 'best-selling'>('newest');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(30000);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isPublished)
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (selectedSubcategory !== 'All' && p.subcategory !== selectedSubcategory) {
          return false;
        }
        if (selectedBrand !== 'All' && p.brand !== selectedBrand) {
          return false;
        }
        if (onlyInStock && p.totalStock <= 0) {
          return false;
        }
        if (onlySale && !p.salePrice) {
          return false;
        }
        const effectivePrice = p.salePrice ?? p.basePrice;
        if (effectivePrice > maxPrice) {
          return false;
        }
        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice ?? a.basePrice;
        const priceB = b.salePrice ?? b.basePrice;

        switch (sortBy) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'rating':
            return b.rating - a.rating;
          case 'best-selling':
            return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    searchFilter,
    sortBy,
    onlyInStock,
    onlySale,
    maxPrice,
  ]);

  // Available subcategories in current category
  const subcategories = useMemo(() => {
    const list = products
      .filter((p) => selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase())
      .map((p) => p.subcategory);
    return Array.from(new Set(list));
  }, [products, selectedCategory]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10" id="collection-grid">
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider font-semibold">
            <span>Catalogue</span>
            <span>·</span>
            <span>{selectedCategory}</span>
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900 mt-0.5">
            {selectedCategory === 'All' ? 'Curated Collection' : selectedCategory}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Displaying {filteredProducts.length} handcrafted items
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Sale Toggle */}
          <button
            onClick={() => setOnlySale(!onlySale)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
              onlySale
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
            }`}
          >
            Sale Items Only
          </button>

          {/* In Stock Toggle */}
          <button
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
              onlyInStock
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
            }`}
          >
            In Stock
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-neutral-800 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="best-selling">Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subcategory Filter Pills (clean segmented style) */}
      {subcategories.length > 0 && (
        <div className="py-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-medium text-neutral-500 shrink-0">Subcategory:</span>
          <button
            onClick={() => setSelectedSubcategory('All')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
              selectedSubcategory === 'All'
                ? 'bg-neutral-200 text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            All
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                selectedSubcategory === sub
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {sub}
            </button>
          ))}

          {(selectedSubcategory !== 'All' || onlySale || onlyInStock) && (
            <button
              onClick={() => {
                setSelectedSubcategory('All');
                setOnlySale(false);
                setOnlyInStock(false);
              }}
              className="ml-auto text-xs text-neutral-500 hover:text-black flex items-center gap-1 cursor-pointer shrink-0"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      )}

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200 my-6">
          <p className="font-serif-display text-xl text-neutral-800">No pieces found matching this criteria.</p>
          <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">
            Try adjusting your search terms or subcategory filters to discover other luxury items.
          </p>
          <button
            onClick={() => {
              onSelectCategory('All');
              setSelectedSubcategory('All');
              setOnlySale(false);
              setOnlyInStock(false);
              setSearchFilter('');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 cursor-pointer"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 pt-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </section>
  );
};
