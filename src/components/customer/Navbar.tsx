import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CurrencyCode } from '../../types/ecommerce';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface NavbarProps {
  onSelectCategory?: (category: string) => void;
  onOpenTracking?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectCategory, onOpenTracking }) => {
  const {
    cart,
    wishlist,
    currency,
    setCurrency,
    setIsCartOpen,
    setIsAccountOpen,
    currentCustomer,
    setIsAdminMode,
    products,
    setSelectedProductId,
    settings,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  return (
    <>
      {/* 1. Slim Announcement Bar */}
      <div className="bg-[#18181B] text-neutral-300 text-[11px] py-1.5 px-4 font-normal tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-300">✦</span>
            <span>Complimentary Express Delivery on orders above {currency === 'PKR' ? 'Rs. 5,000' : '$100'}</span>
            <span className="hidden md:inline text-neutral-500">·</span>
            <span className="hidden md:inline text-neutral-400">Cash on Delivery & Secure Cards</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenTracking}
              className="hover:text-white transition-colors cursor-pointer text-[11px] underline underline-offset-2"
            >
              Track Order
            </button>

            {/* Currency Switcher */}
            <div className="flex items-center gap-1 border-l border-neutral-700 pl-3">
              {(['PKR', 'USD', 'AED', 'GBP'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                    currency === c ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Bar Contract: 3 Zones */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-neutral-700 hover:text-black cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory?.('All');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 cursor-pointer"
            >
              {settings.storeName}
            </a>
          </div>

          {/* Zone 2: 4-6 Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] tracking-wide font-medium text-neutral-600">
            <button
              onClick={() => onSelectCategory?.('All')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              All Collections
            </button>
            <button
              onClick={() => onSelectCategory?.("Women's Fashion")}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Women
            </button>
            <button
              onClick={() => onSelectCategory?.("Men's Apparel")}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Men
            </button>
            <button
              onClick={() => onSelectCategory?.('Bags & Accessories')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Bags & Leather
            </button>
            <button
              onClick={() => onSelectCategory?.('Footwear & Shoes')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Footwear
            </button>
            <button
              onClick={onOpenTracking}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Track Package
            </button>
          </nav>

          {/* Zone 3: 1-2 Primary Actions & Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Live Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-neutral-700 hover:text-black transition-colors cursor-pointer rounded-full hover:bg-neutral-100"
              aria-label="Search collection"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setIsAccountOpen(true)}
              className="relative p-2 text-neutral-700 hover:text-black transition-colors cursor-pointer rounded-full hover:bg-neutral-100"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-neutral-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              onClick={() => setIsAccountOpen(true)}
              className="p-2 text-neutral-700 hover:text-black transition-colors cursor-pointer rounded-full hover:bg-neutral-100 flex items-center gap-1.5"
              aria-label="Customer Account"
            >
              <User className="w-4 h-4" />
              {currentCustomer && (
                <span className="hidden xl:inline text-xs font-medium text-neutral-800 max-w-24 truncate">
                  {currentCustomer.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-900 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 hover:border-neutral-400 transition-colors cursor-pointer shadow-xs ml-1"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bag</span>
              <span className="w-4 h-4 bg-neutral-900 text-white rounded-full flex items-center justify-center text-[10px] font-semibold tabular-nums">
                {cartItemsCount}
              </span>
            </button>

            {/* Switch to Merchant Admin Hub */}
            <button
              onClick={() => setIsAdminMode(true)}
              className="ml-2 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-1.5"
              title="Open Merchant Operations Hub"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden lg:inline">Admin Hub</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Live Search Drawer / Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search abayas, linen shirts, leather totes, jewelry..."
                className="w-full text-sm text-neutral-900 placeholder-neutral-400 focus:outline-hidden"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Search Suggestions */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                    Popular Searches
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {['Embroidered Silk Abaya', 'French Linen Shirt', 'Leather Tote Bag', 'Mulberry Silk Hijab', 'Tailored Trousers'].map(
                      (term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md transition-colors cursor-pointer"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-neutral-500 text-xs">
                  No products found matching "{searchQuery}". Try different keywords.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                    Matching Products ({searchResults.length})
                  </div>
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-50 cursor-pointer border border-transparent hover:border-neutral-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.featuredImage}
                          alt={prod.name}
                          className="w-12 h-14 object-cover rounded bg-neutral-100"
                        />
                        <div>
                          <p className="text-xs font-semibold text-neutral-900">{prod.name}</p>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                            <span>{prod.category}</span>
                            <span>·</span>
                            <span>{prod.brand}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium text-neutral-900">
                          Rs. {prod.salePrice ?? prod.basePrice}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                <span className="font-serif-display text-2xl font-bold tracking-tight text-neutral-900">
                  {settings.storeName}
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4 text-sm font-medium text-neutral-800">
                <button
                  onClick={() => {
                    onSelectCategory?.('All');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-neutral-500 transition-colors"
                >
                  All Collections
                </button>
                <button
                  onClick={() => {
                    onSelectCategory?.("Women's Fashion");
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-neutral-500 transition-colors"
                >
                  Women's Fashion (Abayas, Dresses, Suits)
                </button>
                <button
                  onClick={() => {
                    onSelectCategory?.("Men's Apparel");
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-neutral-500 transition-colors"
                >
                  Men's Apparel (Linen, Trousers)
                </button>
                <button
                  onClick={() => {
                    onSelectCategory?.('Bags & Accessories');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-neutral-500 transition-colors"
                >
                  Bags & Fine Accessories
                </button>
                <button
                  onClick={() => {
                    onSelectCategory?.('Footwear & Shoes');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-neutral-500 transition-colors"
                >
                  Footwear & Leather Slides
                </button>
                <button
                  onClick={() => {
                    onOpenTracking?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-neutral-600 hover:text-black transition-colors"
                >
                  Track Order / Package
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200 space-y-3">
              <button
                onClick={() => {
                  setIsAdminMode(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-neutral-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>Open Merchant Admin Hub</span>
              </button>
              <p className="text-[11px] text-neutral-400 text-center">
                Concierge: {settings.supportPhone}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
