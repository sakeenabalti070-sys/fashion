import React, { useState } from 'react';
import { Product } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { formatPrice, isInWishlist, toggleWishlist, addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedQuickSize, setSelectedQuickSize] = useState(product.sizes[0] || 'M');

  const inWishlist = isInWishlist(product.id);
  const discountPercent = product.salePrice
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : 0;

  const currentPrice = product.salePrice ?? product.basePrice;
  const isLowStock = product.totalStock > 0 && product.totalStock <= product.lowStockThreshold;
  const isOutOfStock = product.totalStock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultColor = product.colors[0]?.name || 'Standard';
    addToCart(product, selectedQuickSize, defaultColor, 1);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-xl border border-neutral-200/80 overflow-hidden cursor-pointer hover:border-neutral-300 hover:shadow-lg transition-all duration-300"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-3/4 w-full bg-neutral-100 overflow-hidden">
        <img
          src={product.featuredImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Minimal text badge top-left (No pill spam, single quiet indicator) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-neutral-900 px-2 py-0.5 rounded-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isNewArrival && discountPercent === 0 && (
            <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-900 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-sm shadow-xs">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button top-right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all cursor-pointer ${
            inWishlist
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 backdrop-blur-xs text-neutral-600 hover:bg-white hover:text-black'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Hover Actions Bar */}
        <div
          className={`absolute inset-x-3 bottom-3 transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-lg shadow-lg border border-neutral-200/60 flex items-center justify-between gap-2">
            {/* Quick Size Select */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuickSize(s);
                  }}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                    selectedQuickSize === s
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Quick Add CTA */}
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className="px-2.5 py-1 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 rounded transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Content & Typography */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
        <div>
          {/* Unboxed Metadata: Category · Brand */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
            <span>{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.subcategory}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1 group-hover:text-neutral-700 transition-colors mt-0.5">
            {product.name}
          </h3>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="ml-1 text-[11px] font-semibold text-neutral-800 tabular-nums">
              {product.rating}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400">({product.reviewsCount} reviews)</span>

          {isLowStock && (
            <span className="ml-auto text-[10px] font-medium text-amber-700">
              Only {product.totalStock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="ml-auto text-[10px] font-medium text-rose-600">
              Sold Out
            </span>
          )}
        </div>

        {/* Price Row: Tabular Numerals */}
        <div className="pt-2 border-t border-neutral-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold font-mono text-neutral-900 tabular-nums">
              {formatPrice(currentPrice)}
            </span>
            {product.salePrice && (
              <span className="text-xs font-mono text-neutral-400 line-through tabular-nums">
                {formatPrice(product.basePrice)}
              </span>
            )}
          </div>

          <span className="text-[11px] text-neutral-500 group-hover:text-neutral-900 flex items-center gap-1 font-medium transition-colors">
            <Eye className="w-3 h-3" />
            <span>Details</span>
          </span>
        </div>
      </div>
    </div>
  );
};
