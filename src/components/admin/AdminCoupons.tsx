import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types/ecommerce';
import { Plus, Tag, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, formatPrice } = useStore();

  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(15);
  const [minOrder, setMinOrder] = useState(3000);
  const [maxDiscount, setMaxDiscount] = useState(3000);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState(500);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrderAmount: Number(minOrder),
      maxDiscount: type === 'percentage' ? Number(maxDiscount) : undefined,
      expiryDate,
      usageLimit: Number(usageLimit),
      isActive: true,
    });

    setCode('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <h1 className="font-serif-display text-2xl font-bold text-neutral-900">
          Coupons & Promotional Campaigns
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure promotional discount codes with minimum spend requirements and real cart deduction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Coupon Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 className="font-serif-display text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Generate Promo Coupon</span>
          </h2>

          <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. VIP20"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full uppercase font-mono p-2 border border-neutral-300 rounded-lg bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Discount Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2 border border-neutral-300 rounded-lg bg-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (Rs.)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Value {type === 'percentage' ? '(%)' : '(Rs.)'}
                </label>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-300 rounded-lg bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Min Order Amount (Rs.)</label>
                <input
                  type="number"
                  required
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-300 rounded-lg bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Max Cap (Rs.)</label>
                <input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-300 rounded-lg bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-300 rounded-lg bg-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 cursor-pointer shadow-xs"
            >
              Issue Coupon Code
            </button>
          </form>
        </div>

        {/* Existing Coupons List (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 className="font-serif-display text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>Active Discount Matrix ({coupons.length})</span>
          </h2>

          <div className="divide-y divide-neutral-100 text-xs">
            {coupons.map((cpn) => (
              <div key={cpn.id} className="py-4 flex justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-neutral-900">{cpn.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700">
                      {cpn.type === 'percentage' ? `${cpn.value}% Off` : `${formatPrice(cpn.value)} Off`}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Min Spend: {formatPrice(cpn.minOrderAmount)} · Valid until {cpn.expiryDate}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Redeemed {cpn.usedCount} times of {cpn.usageLimit ?? 'Unlimited'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCoupon(cpn.id, { isActive: !cpn.isActive })}
                    className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                      cpn.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {cpn.isActive ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => deleteCoupon(cpn.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 cursor-pointer"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
