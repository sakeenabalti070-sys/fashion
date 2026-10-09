import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types/ecommerce';
import {
  Search,
  Printer,
  Truck,
  RotateCcw,
  Ban,
  CheckCircle,
  Eye,
  X,
  FileText,
  MapPin,
  Calendar,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    formatPrice,
    setSelectedInvoiceOrder,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status update modal state
  const [newStatus, setNewStatus] = useState<OrderStatus>('Processing');
  const [statusNote, setStatusNote] = useState('');
  const [courierName, setCourierName] = useState('TCS Express');
  const [trackingNo, setTrackingNo] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'All' && o.orderStatus !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  const openStatusEditor = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setStatusNote('');
    setCourierName(order.courierCompany || 'TCS Express');
    setTrackingNo(order.trackingNumber || `TCS-${Math.floor(100000000 + Math.random() * 900000000)}`);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateOrderStatus(
      selectedOrder.id,
      newStatus,
      statusNote,
      trackingNo,
      courierName
    );

    // Update locally selected order view
    setSelectedOrder((prev) =>
      prev ? { ...prev, orderStatus: newStatus, trackingNumber: trackingNo, courierCompany: courierName } : null
    );
  };

  const allStatuses: OrderStatus[] = [
    'Order Placed',
    'Order Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Returned',
    'Refunded',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-neutral-900">
            Fulfillment & Order Processing
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage stage transitions, assign couriers, process cancellations, and emit commercial receipts.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs px-3 py-2 border border-neutral-300 rounded-lg bg-white focus:outline-hidden cursor-pointer"
        >
          <option value="All">All Order Statuses</option>
          {allStatuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6 text-right">Total</th>
                <th className="py-3 px-6 text-center">Fulfillment Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-neutral-900">
                    {order.id}
                  </td>
                  <td className="py-4 px-6 text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-neutral-900">{order.customerName}</p>
                    <p className="text-[11px] text-neutral-500">{order.customerPhone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-neutral-900">{order.paymentMethod}</p>
                    <span
                      className={`text-[10px] font-semibold ${
                        order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-neutral-900 tabular-nums">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned'
                          ? 'bg-rose-100 text-rose-800'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => openStatusEditor(order)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="p-1.5 text-neutral-600 hover:text-black rounded hover:bg-neutral-100 cursor-pointer"
                      title="Print Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Status & Courier Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif-display text-lg font-bold text-neutral-900">
                  Manage Order {selectedOrder.id}
                </h3>
                <p className="text-xs text-neutral-500">
                  Client: {selectedOrder.customerName} ({selectedOrder.customerPhone})
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-neutral-400 hover:text-black rounded hover:bg-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Update Order Status (10 Steps)
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg bg-white font-semibold"
                  >
                    {allStatuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Courier Carrier</label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg bg-white"
                  >
                    <option value="TCS Express">TCS Express</option>
                    <option value="Leopards Courier">Leopards Courier</option>
                    <option value="PostEx Logistic">PostEx Logistic</option>
                    <option value="DHL Express International">DHL Express International</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Courier Waybill / Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    placeholder="e.g. TCS-829401827"
                    className="w-full p-2.5 font-mono border border-neutral-300 rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Status Update Log Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Dispatched with evening courier dispatch van"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Notice for cancellation/return */}
              {(newStatus === 'Cancelled' || newStatus === 'Returned') && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] leading-relaxed">
                  ⚠️ Note: Changing status to <strong>{newStatus}</strong> will automatically restore
                  allocated units back into inventory stock count.
                </div>
              )}

              {/* Package Details */}
              <div className="border-t border-neutral-200 pt-4">
                <span className="font-semibold text-neutral-800 block mb-2">Package Items</span>
                <div className="space-y-2">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-neutral-50 rounded">
                      <div>
                        <span className="font-medium text-neutral-900">{it.productName}</span>
                        <span className="text-[11px] text-neutral-500 ml-2">
                          ({it.size} · {it.color} · Qty: {it.quantity})
                        </span>
                      </div>
                      <span className="font-mono font-medium">{formatPrice(it.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(selectedOrder)}
                  className="px-3 py-2 text-neutral-800 bg-white border border-neutral-300 rounded hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 text-neutral-600 hover:text-black cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded hover:bg-neutral-800 cursor-pointer shadow-sm"
                  >
                    Update Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
