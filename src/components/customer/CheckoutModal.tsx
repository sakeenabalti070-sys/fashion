import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod, Address, Order } from '../../types/ecommerce';
import {
  X,
  CreditCard,
  Banknote,
  Building2,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Printer,
  Compass,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    appliedCoupon,
    formatPrice,
    placeOrder,
    currentCustomer,
    settings,
    setTrackingOrderId,
    setSelectedInvoiceOrder,
    showToast,
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery (COD)');
  const [formData, setFormData] = useState<Address>({
    fullName: currentCustomer?.name || '',
    email: currentCustomer?.email || '',
    phone: currentCustomer?.phone || '',
    streetAddress: currentCustomer?.savedAddresses[0]?.streetAddress || '',
    apartment: currentCustomer?.savedAddresses[0]?.apartment || '',
    city: currentCustomer?.savedAddresses[0]?.city || 'Lahore',
    provinceState: currentCustomer?.savedAddresses[0]?.provinceState || 'Punjab',
    postalCode: currentCustomer?.savedAddresses[0]?.postalCode || '54000',
    country: currentCustomer?.savedAddresses[0]?.country || 'Pakistan',
    instructions: '',
  });

  // Card simulation state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Completed order state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (field: keyof Address, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.streetAddress.trim()) {
      showToast('Please fill in all required customer contact and address fields.', 'error');
      return;
    }

    const order = placeOrder({
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: formData,
      paymentMethod,
    });

    setCompletedOrder(order);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`, 'info');
  };

  const citiesList = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
    'Dubai',
    'Abu Dhabi',
    'London',
    'New York',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif-display text-xl font-bold text-neutral-900">
              {settings.storeName} Checkout
            </span>
            <span className="text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
              Secure SSL 256-Bit Encryption
            </span>
          </div>

          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setCompletedOrder(null);
            }}
            className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedOrder ? (
          /* Success Screen */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                Order Confirmed
              </span>
              <h2 className="font-serif-display text-3xl font-bold text-neutral-900">
                Thank you, {completedOrder.customerName}!
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-md mx-auto leading-relaxed">
                Your order <span className="font-mono font-bold text-neutral-900">{completedOrder.id}</span> has been received and sent to our atelier for bespoke packaging.
              </p>
            </div>

            {/* Quick Summary Card */}
            <div className="max-w-md mx-auto bg-neutral-50 p-5 rounded-xl border border-neutral-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Order ID:</span>
                <span className="font-mono font-bold text-neutral-900">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Amount:</span>
                <span className="font-mono font-bold text-neutral-900">{formatPrice(completedOrder.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Mode:</span>
                <span className="font-medium text-neutral-900">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Delivery Address:</span>
                <span className="text-neutral-900 truncate max-w-xs">{completedOrder.shippingAddress.streetAddress}, {completedOrder.shippingAddress.city}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setTrackingOrderId(completedOrder.id);
                  setIsCheckoutOpen(false);
                }}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>Track Package Status</span>
              </button>

              <button
                onClick={() => setSelectedInvoiceOrder(completedOrder)}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-800 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-neutral-600" />
                <span>Print Official Invoice</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
            {/* Left Column: Form Fields (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-neutral-200">
              {/* Section 1: Customer Contact */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amina Farooq"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="amina@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Mobile / WhatsApp Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Shipping Destination */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                  2. Delivery Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Street Address & House / Building No *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="House 42, Street 7, Block F, Gulberg III"
                      value={formData.streetAddress}
                      onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      City *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900 bg-white"
                    >
                      {citiesList.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Province / State
                    </label>
                    <input
                      type="text"
                      placeholder="Punjab / Sindh / Dubai"
                      value={formData.provinceState}
                      onChange={(e) => handleInputChange('provinceState', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      placeholder="54000"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Special Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ring bell twice, deliver after 2pm"
                      value={formData.instructions}
                      onChange={(e) => handleInputChange('instructions', e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                  3. Select Payment Method
                </h3>
                <div className="space-y-2">
                  {/* COD */}
                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'Cash on Delivery (COD)'
                        ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'Cash on Delivery (COD)'}
                      onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                      className="mt-0.5 text-neutral-900 focus:ring-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-xs text-neutral-900">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span>Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Pay in cash to courier agent upon doorstep physical delivery across Pakistan.
                      </p>
                    </div>
                  </label>

                  {/* Direct Bank Transfer */}
                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'Direct Bank Transfer'
                        ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'Direct Bank Transfer'}
                      onChange={() => setPaymentMethod('Direct Bank Transfer')}
                      className="mt-0.5 text-neutral-900 focus:ring-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-xs text-neutral-900">
                        <Building2 className="w-4 h-4 text-sky-600" />
                        <span>Direct Bank Wire / Online Transfer (HBL Prestige)</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Transfer directly to official corporate atelier bank account.
                      </p>
                      {paymentMethod === 'Direct Bank Transfer' && (
                        <div className="mt-2 p-2.5 bg-white rounded border border-neutral-200 text-[11px] space-y-1">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Bank:</span>
                            <span className="font-medium text-neutral-900">{settings.bankDetails.bankName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Account Title:</span>
                            <span className="font-medium text-neutral-900">{settings.bankDetails.accountTitle}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500">IBAN:</span>
                            <div className="flex items-center gap-1 font-mono font-medium text-neutral-900">
                              <span>{settings.bankDetails.iban}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(settings.bankDetails.iban, 'IBAN')}
                                className="text-neutral-400 hover:text-black p-0.5"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* JazzCash / EasyPaisa */}
                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'JazzCash / EasyPaisa'
                        ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'JazzCash / EasyPaisa'}
                      onChange={() => setPaymentMethod('JazzCash / EasyPaisa')}
                      className="mt-0.5 text-neutral-900 focus:ring-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-xs text-neutral-900">
                        <Smartphone className="w-4 h-4 text-amber-600" />
                        <span>JazzCash / EasyPaisa Mobile Wallet</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Instant mobile wallet payment to authorized boutique account.
                      </p>
                      {paymentMethod === 'JazzCash / EasyPaisa' && (
                        <div className="mt-2 p-2.5 bg-white rounded border border-neutral-200 text-[11px] space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500">JazzCash:</span>
                            <div className="flex items-center gap-1 font-mono font-medium text-neutral-900">
                              <span>{settings.mobileWalletDetails.jazzcashNumber} ({settings.mobileWalletDetails.jazzcashTitle})</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(settings.mobileWalletDetails.jazzcashNumber, 'JazzCash')}
                                className="text-neutral-400 hover:text-black p-0.5"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500">EasyPaisa:</span>
                            <div className="flex items-center gap-1 font-mono font-medium text-neutral-900">
                              <span>{settings.mobileWalletDetails.easypaisaNumber} ({settings.mobileWalletDetails.easypaisaTitle})</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(settings.mobileWalletDetails.easypaisaNumber, 'EasyPaisa')}
                                className="text-neutral-400 hover:text-black p-0.5"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Credit / Debit Card */}
                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'Credit / Debit Card'
                        ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'Credit / Debit Card'}
                      onChange={() => setPaymentMethod('Credit / Debit Card')}
                      className="mt-0.5 text-neutral-900 focus:ring-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-xs text-neutral-900">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                        <span>Credit / Debit Card (Visa, Mastercard, Amex, UnionPay)</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Encrypted test gateway processor. Never stores raw card numbers.
                      </p>
                      {paymentMethod === 'Credit / Debit Card' && (
                        <div className="mt-2 grid grid-cols-3 gap-2 bg-white p-2.5 rounded border border-neutral-200 text-xs">
                          <div className="col-span-3">
                            <label className="block text-[10px] text-neutral-500 mb-0.5">Card Number</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full font-mono text-xs p-1.5 border border-neutral-300 rounded"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] text-neutral-500 mb-0.5">Expiry</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full font-mono text-xs p-1.5 border border-neutral-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-neutral-500 mb-0.5">CVC</label>
                            <input
                              type="text"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              className="w-full font-mono text-xs p-1.5 border border-neutral-300 rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order Button (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-neutral-50/70 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
                  Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
                </h3>

                {/* Items Mini List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-neutral-200/60">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="pt-2.5 first:pt-0 flex gap-3 text-xs">
                      <img
                        src={item.product.featuredImage}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded bg-neutral-100 shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-[11px] text-neutral-500">
                          {item.selectedSize} · {item.selectedColor} · Qty: {item.quantity}
                        </p>
                        <p className="font-mono font-medium text-neutral-900 tabular-nums mt-0.5">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t border-neutral-200 pt-4 mt-4 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">{formatPrice(cartSubtotal)}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span className="font-mono tabular-nums">-{formatPrice(cartDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span className="font-mono tabular-nums">
                      {cartShippingFee === 0 ? 'Complimentary' : formatPrice(cartShippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Sales Tax</span>
                    <span className="font-mono tabular-nums">Rs. 0</span>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline font-bold text-neutral-900 text-sm">
                    <span>Payable Total</span>
                    <span className="font-mono tabular-nums text-lg">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-3 pt-4">
                <button
                  type="submit"
                  disabled={cart.length === 0}
                  className="w-full py-4 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Confirm & Place Order</span>
                </button>

                <p className="text-[10px] text-neutral-400 text-center leading-relaxed">
                  By clicking Place Order, you agree to our concierge terms of service and guarantee of 100% genuine craftsmanship.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
