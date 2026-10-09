import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Mail, Check, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC<{
  onSelectCategory: (cat: string) => void;
  onOpenTracking: () => void;
}> = ({ onSelectCategory, onOpenTracking }) => {
  const { settings, showToast, setIsAdminMode } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    showToast('Subscribed! Welcome to the AURA Atelier newsletter.', 'success');
  };

  return (
    <footer className="bg-[#18181B] text-neutral-300 border-t border-neutral-800 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand & Story */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif-display text-2xl font-bold tracking-tight text-white">
              {settings.storeName}
            </h3>
            <p className="text-neutral-400 max-w-sm leading-relaxed text-xs">
              Hand-finished couture abayas, French linen, and artisanal leather accessories. Guided by principles of architectural restraint, textile integrity, and generational craft.
            </p>
            <div className="pt-2 text-neutral-400 space-y-1 text-xs">
              <p>Atelier: {settings.storeAddress}, {settings.city}</p>
              <p>Direct Concierge: {settings.supportPhone}</p>
              <p>Email: {settings.supportEmail}</p>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button
                  onClick={() => onSelectCategory("Women's Fashion")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Couture Abayas & Kaftans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("Women's Fashion")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Raw Silk Contemporary Dresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("Men's Apparel")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  French Linen & Trousers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Bags & Accessories')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tuscan Leather Totes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Footwear & Shoes')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Handmade Leather Slides
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Client Care
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={onOpenTracking} className="hover:text-white transition-colors cursor-pointer">
                  Track Package & Waybill
                </button>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Cash on Delivery (COD) Guidelines</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">14-Day Complimentary Exchanges</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Bespoke Size Measurement Guide</span>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminMode(true)}
                  className="text-amber-300 hover:text-amber-200 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Merchant Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Private Newsletter
            </h4>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Receive private invitations to seasonal private views and archival capsule releases.
            </p>

            {subscribed ? (
              <div className="p-3 bg-neutral-900 border border-neutral-700 rounded-lg text-emerald-400 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span className="text-xs font-medium">Thank you for subscribing.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-hidden focus:border-neutral-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 text-xs font-semibold uppercase tracking-wider bg-white text-neutral-900 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                >
                  Join Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <p>© 2026 {settings.storeName} Luxury Atelier. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Cash on Delivery</span>
            <span>·</span>
            <span>HBL Prestige</span>
            <span>·</span>
            <span>JazzCash</span>
            <span>·</span>
            <span>EasyPaisa</span>
            <span>·</span>
            <span>Visa & Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
