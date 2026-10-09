import React from 'react';
import { HERO_IMAGE } from '../../data/initialData';
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onCategoryClick: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onCategoryClick }) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F5] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Typography */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-widest font-semibold">
              <span className="w-6 h-px bg-neutral-400"></span>
              <span>Spring / Summer 2026 Atelier</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.08] text-balance">
              Architectural Grace in Raw Silk & Pure Linen.
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg font-light">
              Impeccably tailored abayas, linen apparel, and handcrafted Tuscan leather essentials — forged for the discerning individual seeking quiet permanence over seasonal noise.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-all cursor-pointer shadow-sm group"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onCategoryClick("Women's Fashion")}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-800 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 hover:border-neutral-400 transition-colors cursor-pointer"
              >
                Couture Abayas
              </button>
            </div>

            {/* Trust Badges: Zero-Pill, unboxed text */}
            <div className="pt-6 border-t border-neutral-200/80 grid grid-cols-3 gap-4 text-xs text-neutral-600">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-medium text-neutral-900">
                  <Truck className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Complimentary</span>
                </div>
                <p className="text-[11px] text-neutral-500">Express shipping & COD</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-medium text-neutral-900">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
                  <span>100% Pure Silk</span>
                </div>
                <p className="text-[11px] text-neutral-500">Hand-finished embroidery</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-medium text-neutral-900">
                  <Shield className="w-3.5 h-3.5 text-neutral-700" />
                  <span>14-Day Return</span>
                </div>
                <p className="text-[11px] text-neutral-500">Doorstep exchange service</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-16/10 sm:aspect-16/9 lg:aspect-4/3 rounded-2xl overflow-hidden shadow-2xl bg-neutral-200 border border-neutral-300/60 group">
              <img
                src={HERO_IMAGE}
                alt="AURA Spring Summer Editorial Campaign"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Quiet caption in image */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white pointer-events-none">
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-neutral-300 block">Lookbook 01</span>
                  <span className="font-serif-display text-lg sm:text-xl font-medium drop-shadow-xs">
                    The Alabaster Tiered Maxi & Belted Coat
                  </span>
                </div>
                <span className="hidden sm:inline-block text-xs font-mono tracking-wider text-neutral-200">
                  Ref. SS26-04
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
