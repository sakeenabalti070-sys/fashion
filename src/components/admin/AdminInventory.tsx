import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, adjustStock, formatPrice } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHealth, setFilterHealth] = useState<'all' | 'low' | 'out'>('all');

  const filteredProducts = products.filter((p) => {
    if (filterHealth === 'low' && (p.totalStock <= 0 || p.totalStock > p.lowStockThreshold)) {
      return false;
    }
    if (filterHealth === 'out' && p.totalStock > 0) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const lowStockCount = products.filter((p) => p.totalStock > 0 && p.totalStock <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter((p) => p.totalStock <= 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-neutral-900">
            Inventory & Stock Warehouse Audit
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time multi-variation stock management. Stock decrements upon checkout and restores on cancellation.
          </p>
        </div>

        {/* Quick Health Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterHealth('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterHealth === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All Stock ({products.length})
          </button>
          <button
            onClick={() => setFilterHealth('low')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterHealth === 'low'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterHealth('out')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterHealth === 'out'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search inventory by title, SKU, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
          />
        </div>
      </div>

      {/* Stock Items List */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 text-xs font-semibold uppercase tracking-wider text-neutral-500 flex justify-between">
          <span>Item & Variations Breakdown</span>
          <span>Fast Stock Adjustment (+ / -)</span>
        </div>

        <div className="divide-y divide-neutral-100">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-6 space-y-4">
              {/* Product Parent Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.featuredImage}
                    alt={product.name}
                    className="w-14 h-16 object-cover rounded-lg bg-neutral-100 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">{product.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                      <span>{product.category}</span>
                      <span>·</span>
                      <span className="font-mono">{product.sku}</span>
                      <span>·</span>
                      <span>{formatPrice(product.salePrice ?? product.basePrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Total Stock Indicator & Parent Adjuster */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] text-neutral-400 block">Total Units</span>
                    <span
                      className={`font-mono text-sm font-bold ${
                        product.totalStock <= 0
                          ? 'text-rose-600'
                          : product.totalStock <= product.lowStockThreshold
                          ? 'text-amber-700'
                          : 'text-neutral-900'
                      }`}
                    >
                      {product.totalStock} units
                    </span>
                  </div>

                  <div className="flex items-center border border-neutral-300 rounded-lg bg-neutral-50">
                    <button
                      onClick={() => adjustStock(product.id, undefined, -1)}
                      disabled={product.totalStock <= 0}
                      className="p-1.5 text-neutral-600 hover:text-black disabled:text-neutral-300 cursor-pointer"
                      title="Decrement Total Stock by 1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => adjustStock(product.id, undefined, 5)}
                      className="px-2 py-1 text-xs font-semibold text-neutral-900 hover:bg-neutral-200 border-x border-neutral-300 cursor-pointer"
                      title="Quick Add 5 Units"
                    >
                      +5 Restock
                    </button>
                    <button
                      onClick={() => adjustStock(product.id, undefined, 1)}
                      className="p-1.5 text-neutral-600 hover:text-black cursor-pointer"
                      title="Increment Total Stock by 1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Variations Nested Matrix */}
              {product.variations.length > 0 && (
                <div className="bg-neutral-50/70 rounded-xl p-3 border border-neutral-200/60 text-xs">
                  <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Variation Matrix Stock
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {product.variations.map((v) => (
                      <div
                        key={v.id}
                        className="bg-white p-2.5 rounded-lg border border-neutral-200 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-neutral-900">
                            {v.size} · {v.color}
                          </p>
                          <p className="font-mono text-[10px] text-neutral-400">{v.sku}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-800 tabular-nums">
                            {v.stock}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => adjustStock(product.id, v.id, -1)}
                              disabled={v.stock <= 0}
                              className="p-1 text-neutral-500 hover:text-black disabled:text-neutral-300 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => adjustStock(product.id, v.id, 1)}
                              className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
