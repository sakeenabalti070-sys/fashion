import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Printer, X, ShieldCheck } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { selectedInvoiceOrder, setSelectedInvoiceOrder, formatPrice, settings } = useStore();

  if (!selectedInvoiceOrder) return null;

  const order = selectedInvoiceOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden my-8">
        {/* Header Controls (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-b border-neutral-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
              Commercial Invoice & Packing Slip
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs font-mono font-medium text-neutral-700">{order.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-900 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
              aria-label="Close invoice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="p-8 sm:p-10 font-sans print:p-0">
          {/* Top Brand Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-neutral-200 pb-8">
            <div>
              <h1 className="font-serif-display text-3xl font-bold tracking-tight text-neutral-900">
                {settings.storeName}
              </h1>
              <p className="text-xs text-neutral-500 mt-1">{settings.tagline}</p>
              <p className="text-xs text-neutral-600 mt-2 max-w-xs leading-relaxed">
                {settings.storeAddress}, {settings.city}, {settings.country}
                <br />
                Concierge: {settings.supportEmail} · {settings.supportPhone}
              </p>
            </div>
            <div className="sm:text-right">
              <span className="inline-block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                Tax Invoice
              </span>
              <h2 className="text-xl font-mono font-bold text-neutral-900 mt-0.5">{order.id}</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Date: {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
              </p>
              <div className="mt-2 text-xs">
                <span className="text-neutral-500">Payment: </span>
                <span className="font-medium text-neutral-900">{order.paymentMethod}</span>
              </div>
              <div className="text-xs">
                <span className="text-neutral-500">Payment Status: </span>
                <span
                  className={`font-semibold ${
                    order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Billing & Shipping Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-neutral-200 text-xs">
            <div>
              <h3 className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px] mb-2">
                Deliver To
              </h3>
              <p className="font-medium text-neutral-900">{order.shippingAddress.fullName}</p>
              <p className="text-neutral-600 mt-0.5">{order.shippingAddress.streetAddress}</p>
              {order.shippingAddress.apartment && (
                <p className="text-neutral-600">{order.shippingAddress.apartment}</p>
              )}
              <p className="text-neutral-600">
                {order.shippingAddress.city}, {order.shippingAddress.provinceState}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-neutral-600">{order.shippingAddress.country}</p>
              <p className="text-neutral-500 mt-1.5">Phone: {order.shippingAddress.phone}</p>
              <p className="text-neutral-500">Email: {order.shippingAddress.email}</p>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px] mb-2">
                Shipment & Fulfillment
              </h3>
              <p className="text-neutral-600">
                <span className="text-neutral-500">Courier Partner: </span>
                <span className="font-medium text-neutral-900">{order.courierCompany || 'TCS Express'}</span>
              </p>
              <p className="text-neutral-600 mt-1">
                <span className="text-neutral-500">Waybill / Tracking No: </span>
                <span className="font-mono font-medium text-neutral-900">
                  {order.trackingNumber || 'Pending Allocation'}
                </span>
              </p>
              <p className="text-neutral-600 mt-1">
                <span className="text-neutral-500">Current Order Status: </span>
                <span className="font-medium text-neutral-900">{order.orderStatus}</span>
              </p>
              {order.shippingAddress.instructions && (
                <div className="mt-2 p-2 bg-neutral-50 rounded border border-neutral-200 text-neutral-600 italic">
                  Note: "{order.shippingAddress.instructions}"
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                  <th className="py-2 font-medium">Item Description</th>
                  <th className="py-2 font-medium text-center">Size / Color</th>
                  <th className="py-2 font-medium text-center">Qty</th>
                  <th className="py-2 font-medium text-right">Unit Price</th>
                  <th className="py-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3">
                      <div className="font-medium text-neutral-900">{item.productName}</div>
                      <div className="text-neutral-400 font-mono text-[11px] mt-0.5">SKU: {item.sku}</div>
                    </td>
                    <td className="py-3 text-center text-neutral-600">
                      {item.size} · {item.color}
                    </td>
                    <td className="py-3 text-center font-mono text-neutral-900">{item.quantity}</td>
                    <td className="py-3 text-right font-mono text-neutral-600 tabular-nums">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="py-3 text-right font-mono font-medium text-neutral-900 tabular-nums">
                      {formatPrice(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="border-t border-neutral-200 pt-4 flex justify-end">
            <div className="w-full max-w-xs text-xs space-y-2">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount {order.appliedCoupon ? `(${order.appliedCoupon})` : ''}</span>
                  <span className="font-mono tabular-nums">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping Fee</span>
                <span className="font-mono tabular-nums">
                  {order.shippingFee === 0 ? 'Complimentary' : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-sm text-neutral-900">
                <span>Grand Total</span>
                <span className="font-mono tabular-nums text-base">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="mt-10 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>100% Guaranteed Authentic Atelier Craftsmanship · 14-day hassle-free exchange</span>
            </div>
            <div>Thank you for choosing {settings.storeName}.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
