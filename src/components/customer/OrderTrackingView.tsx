import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types/ecommerce';
import {
  Search,
  Package,
  CheckCircle,
  Truck,
  Clock,
  Printer,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const OrderTrackingView: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const {
    orders,
    trackingOrderId,
    setTrackingOrderId,
    formatPrice,
    setSelectedInvoiceOrder,
  } = useStore();

  const [inputOrderId, setInputOrderId] = useState(trackingOrderId || 'ORD-2026-001042');
  const [activeOrder, setActiveOrder] = useState(
    orders.find((o) => o.id === (trackingOrderId || 'ORD-2026-001042')) || orders[0]
  );

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputOrderId.trim().toUpperCase();
    const found = orders.find((o) => o.id.toUpperCase() === query);
    if (found) {
      setActiveOrder(found);
      setTrackingOrderId(found.id);
    } else {
      alert(`No order found matching "${query}". Please check your order ID.`);
    }
  };

  const stagesOrder: OrderStatus[] = [
    'Order Placed',
    'Order Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const getStageIndex = (status: OrderStatus) => {
    if (status === 'Cancelled' || status === 'Returned' || status === 'Refunded') return -1;
    return stagesOrder.indexOf(status);
  };

  const currentStageIndex = activeOrder ? getStageIndex(activeOrder.orderStatus) : 0;
  const isSpecialStatus =
    activeOrder &&
    (activeOrder.orderStatus === 'Cancelled' ||
      activeOrder.orderStatus === 'Returned' ||
      activeOrder.orderStatus === 'Refunded');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Title */}
      <div className="text-center space-y-2 mb-8">
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
          Live Shipment & Fulfillment Tracker
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-neutral-900">
          Track Your Package
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
          Enter your order reference code below to inspect real-time courier movement and timeline status.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchOrder} className="max-w-lg mx-auto mb-10 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputOrderId}
            onChange={(e) => setInputOrderId(e.target.value)}
            placeholder="e.g. ORD-2026-001042"
            className="w-full uppercase font-mono text-xs sm:text-sm px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Search className="w-4 h-4" />
          <span>Track</span>
        </button>
      </form>

      {/* Active Order Card */}
      {activeOrder ? (
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-neutral-900">{activeOrder.id}</span>
                <span className="text-xs text-neutral-400">·</span>
                <span className="text-xs text-neutral-600">{activeOrder.customerName}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedInvoiceOrder(activeOrder)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View Invoice</span>
              </button>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  activeOrder.orderStatus === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : isSpecialStatus
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {activeOrder.orderStatus}
              </span>
            </div>
          </div>

          {/* Visual 7-Stage Timeline */}
          <div className="p-6 sm:p-8 border-b border-neutral-200">
            {isSpecialStatus ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-900 text-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <p className="font-bold">Order {activeOrder.orderStatus}</p>
                  <p className="text-rose-700 mt-0.5">
                    This order was marked as {activeOrder.orderStatus}. Any eligible refunds or inventory restock has been processed accordingly.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden md:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-neutral-200 -z-0" />
                  <div
                    className="hidden md:block absolute top-1/2 left-6 -translate-y-1/2 h-0.5 bg-neutral-900 transition-all duration-500 -z-0"
                    style={{
                      width: `${(Math.max(0, currentStageIndex) / (stagesOrder.length - 1)) * 92}%`,
                    }}
                  />

                  {/* Nodes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 relative z-10">
                    {stagesOrder.map((stage, idx) => {
                      const isCompleted = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;

                      return (
                        <div key={stage} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                              isCurrent
                                ? 'bg-neutral-900 text-white ring-4 ring-neutral-200'
                                : isCompleted
                                ? 'bg-neutral-900 text-white'
                                : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                            }`}
                          >
                            {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[11px] mt-2 font-medium leading-tight ${
                              isCurrent
                                ? 'text-neutral-900 font-bold'
                                : isCompleted
                                ? 'text-neutral-700'
                                : 'text-neutral-400'
                            }`}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Courier & Waybill Information */}
          <div className="p-6 bg-neutral-50/50 border-b border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px] block">
                Courier Partner
              </span>
              <p className="font-semibold text-neutral-900 mt-1 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-neutral-700" />
                <span>{activeOrder.courierCompany || 'TCS Express Logistic'}</span>
              </p>
            </div>

            <div>
              <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px] block">
                Waybill Tracking No.
              </span>
              <p className="font-mono font-bold text-neutral-900 mt-1">
                {activeOrder.trackingNumber || 'Allocation in progress'}
              </p>
            </div>

            <div>
              <span className="text-neutral-400 uppercase tracking-wider font-semibold text-[10px] block">
                Estimated Delivery
              </span>
              <p className="font-semibold text-neutral-900 mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-neutral-700" />
                <span>2 - 4 Business Days</span>
              </p>
            </div>
          </div>

          {/* Status Event Log & Package Contents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
            {/* Event History */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Status Update History</span>
              </h3>
              <div className="space-y-4 relative border-l-2 border-neutral-200 ml-2 pl-4 text-xs">
                {activeOrder.statusHistory.map((hist, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-900" />
                    <p className="font-semibold text-neutral-900">{hist.status}</p>
                    <p className="text-[11px] text-neutral-500">
                      {new Date(hist.timestamp).toLocaleString()}
                    </p>
                    {hist.note && <p className="text-neutral-600 mt-0.5 italic text-[11px]">"{hist.note}"</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Package Contents */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Package Contents ({activeOrder.items.length})</span>
              </h3>
              <div className="space-y-3 divide-y divide-neutral-100">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex gap-3 text-xs">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-14 object-cover rounded bg-neutral-100 shrink-0"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{item.productName}</p>
                      <p className="text-[11px] text-neutral-500">
                        {item.size} · {item.color} · Qty: {item.quantity}
                      </p>
                      <p className="font-mono font-medium text-neutral-900 tabular-nums">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200 text-xs flex justify-between font-bold text-neutral-900">
                <span>Order Total:</span>
                <span className="font-mono">{formatPrice(activeOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
