import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
  Truck,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPrice,
    settings,
    setIsCheckoutOpen,
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponCodeInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const freeShippingThreshold = settings.freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-neutral-900" />
            <h2 className="font-serif-display text-lg font-bold text-neutral-900">
              Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 text-xs">
          <div className="flex items-center justify-between text-neutral-700 font-medium mb-1.5">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-neutral-900" />
              <span>
                {amountNeededForFreeShipping === 0
                  ? 'Congratulations! You qualify for Free Delivery'
                  : `Add ${formatPrice(amountNeededForFreeShipping)} more for Free Express Delivery`}
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-neutral-900 h-full rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif-display text-lg font-medium text-neutral-900">Your bag is empty</h3>
              <p className="text-xs text-neutral-500 max-w-xs">
                Explore our signature collections to curate your wardrobe.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="py-4 first:pt-0 flex gap-4">
                <img
                  src={item.product.featuredImage}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover rounded-lg bg-neutral-100 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                      <span>Size: {item.selectedSize}</span>
                      <span>·</span>
                      <span>Color: {item.selectedColor}</span>
                    </div>

                    <div className="text-xs font-mono font-medium text-neutral-900 mt-1">
                      {formatPrice(item.unitPrice)}
                    </div>
                  </div>

                  {/* Quantity and Subtotal */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, -1)}
                        className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-semibold text-neutral-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, 1)}
                        className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold font-mono text-neutral-900 tabular-nums">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Coupons and Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-neutral-200 bg-neutral-50/50 space-y-4">
            {/* Coupon Application */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">{appliedCoupon.code}</span>
                  <span className="text-emerald-700">(-{formatPrice(cartDiscount)})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. AURA15)"
                      value={couponCodeInput}
                      onChange={(e) => {
                        setCouponCodeInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      className="w-full text-xs uppercase px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                <p className="text-[10px] text-neutral-400">
                  Try codes: <span className="font-mono font-medium text-neutral-600">AURA15</span> or{' '}
                  <span className="font-mono font-medium text-neutral-600">WELCOME10</span>
                </p>
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-200 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-mono tabular-nums">
                  {cartShippingFee === 0 ? 'Complimentary' : formatPrice(cartShippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-base">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
