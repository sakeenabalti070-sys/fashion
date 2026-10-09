import React, { useState } from 'react';
import { Product } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
  Check,
} from 'lucide-react';

interface ProductDetailModalProps {
  productId: string;
  onClose: () => void;
  onOpenReview: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  productId,
  onClose,
  onOpenReview,
}) => {
  const {
    products,
    formatPrice,
    addToCart,
    isInWishlist,
    toggleWishlist,
    reviews,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useStore();

  const product = products.find((p) => p.id === productId);

  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.featuredImage);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

  const inWishlist = isInWishlist(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id && r.status === 'approved');

  // Variation match
  const selectedVariation = product.variations.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const availableStock = selectedVariation ? selectedVariation.stock : product.totalStock;
  const isOutOfStock = availableStock <= 0;
  const currentPrice = selectedVariation?.salePrice ?? selectedVariation?.price ?? product.salePrice ?? product.basePrice;
  const originalPrice = product.basePrice;
  const hasDiscount = currentPrice < originalPrice;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-black bg-white/80 backdrop-blur-xs rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-neutral-50 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-neutral-200">
            {/* Main Stage Image */}
            <div className="relative aspect-3/4 sm:aspect-4/3 lg:aspect-3/4 rounded-xl overflow-hidden bg-neutral-200 shadow-sm">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 px-2.5 py-1 rounded">
                  Sale Item
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-18 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImage === img ? 'border-neutral-900 shadow-sm' : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-widest font-semibold">
                <span>{product.brand}</span>
                <span>·</span>
                <span>{product.category}</span>
                <span>·</span>
                <span className="font-mono">{product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1.5 text-xs font-bold text-neutral-900 tabular-nums">
                    {product.rating}
                  </span>
                </div>
                <span className="text-xs text-neutral-400">·</span>
                <span className="text-xs text-neutral-600 underline cursor-pointer">
                  {product.reviewsCount} verified reviews
                </span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 py-2 border-y border-neutral-100">
                <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm font-mono text-neutral-400 line-through tabular-nums">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Save {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs text-neutral-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neutral-900">Color Palette:</span>
                    <span className="text-neutral-500">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`relative w-7 h-7 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                          selectedColor === c.name
                            ? 'border-neutral-900 scale-110 shadow-sm'
                            : 'border-neutral-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColor === c.name && (
                          <Check className={`w-3.5 h-3.5 ${c.hex === '#F4F2EC' || c.hex === '#FAF5EE' ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-neutral-900">Available Sizes:</span>
                  <span className="text-neutral-500">
                    {availableStock > 0 ? (
                      availableStock <= product.lowStockThreshold ? (
                        <span className="text-amber-700 font-medium">Only {availableStock} left in stock</span>
                      ) : (
                        <span className="text-emerald-700 font-medium">In Stock ({availableStock} units)</span>
                      )
                    ) : (
                      <span className="text-rose-600 font-medium">Currently Sold Out</span>
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-10 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-neutral-900">Quantity:</span>
                <div className="flex items-center border border-neutral-300 rounded-lg bg-neutral-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-1.5 text-neutral-600 hover:text-black disabled:text-neutral-300 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold font-mono text-neutral-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    disabled={quantity >= availableStock || isOutOfStock}
                    className="p-1.5 text-neutral-600 hover:text-black disabled:text-neutral-300 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Primary Purchase CTAs */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                      inWishlist
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-900 bg-amber-300 hover:bg-amber-400 disabled:bg-neutral-200 transition-colors rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Instant Checkout</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] text-neutral-600 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Complimentary Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-neutral-700" />
                  <span>14-Day Exchange</span>
                </div>
              </div>
            </div>

            {/* Accordion / Tabbed Info */}
            <div className="pt-4 border-t border-neutral-200">
              <div className="flex border-b border-neutral-200 text-xs">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 px-1 font-semibold transition-colors cursor-pointer mr-4 ${
                    activeTab === 'details'
                      ? 'border-b-2 border-neutral-900 text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Tailoring & Material
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-2 px-1 font-semibold transition-colors cursor-pointer mr-4 ${
                    activeTab === 'care'
                      ? 'border-b-2 border-neutral-900 text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Care Instructions
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 px-1 font-semibold transition-colors cursor-pointer ${
                    activeTab === 'shipping'
                      ? 'border-b-2 border-neutral-900 text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Courier & Delivery
                </button>
              </div>

              <div className="py-3 text-xs text-neutral-600 leading-relaxed min-h-16">
                {activeTab === 'details' && (
                  <div>
                    <p className="font-medium text-neutral-900">{product.material}</p>
                    <p className="mt-1">
                      Designed and crafted with architectural precision. All hems and seams are hand-finished by master artisans.
                    </p>
                  </div>
                )}
                {activeTab === 'care' && (
                  <div>
                    <p>{product.careInstructions}</p>
                    <p className="mt-1 text-neutral-500">
                      Store in the provided breathable cotton garment bag away from dampness.
                    </p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div>
                    <p>Express courier delivery within 2-4 business days via TCS & Leopards.</p>
                    <p className="mt-1 text-neutral-500">
                      Cash on Delivery (COD) available with doorstep physical verification.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section & Review Button */}
            <div className="pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Client Reviews ({productReviews.length})
                </h4>
                <button
                  onClick={() => onOpenReview(product)}
                  className="text-xs font-semibold text-neutral-900 underline hover:text-neutral-600 cursor-pointer"
                >
                  Write a Review
                </button>
              </div>

              {productReviews.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">No reviews yet. Be the first to share your experience.</p>
              ) : (
                <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
                  {productReviews.map((rev) => (
                    <div key={rev.id} className="p-2.5 bg-neutral-50 rounded-lg text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-neutral-900">{rev.customerName}</span>
                          {rev.isVerifiedPurchase && (
                            <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 font-medium">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-amber-500">
                          {[...Array(rev.rating)].map((_, idx) => (
                            <Star key={idx} className="w-2.5 h-2.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-600 mt-1 leading-snug">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
