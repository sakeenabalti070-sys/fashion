import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  Package,
  Plus,
  ArrowRight,
  Clock,
  Printer,
  CheckCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    products,
    customers,
    formatPrice,
    setActiveAdminTab,
    setSelectedInvoiceOrder,
    updateOrderStatus,
  } = useStore();

  // Computations
  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'Cancelled' ? sum + o.total : sum), 0);
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Order Confirmed' || o.orderStatus === 'Processing'
  );
  const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered');
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'Cancelled');

  const lowStockItems = products.filter(
    (p) => p.totalStock > 0 && p.totalStock <= p.lowStockThreshold
  );
  const outOfStockItems = products.filter((p) => p.totalStock <= 0);

  // Revenue chart data (recent days)
  const salesHistory = [
    { day: 'Mon', revenue: 38500, orders: 3 },
    { day: 'Tue', revenue: 52000, orders: 4 },
    { day: 'Wed', revenue: 41200, orders: 3 },
    { day: 'Thu', revenue: 64800, orders: 5 },
    { day: 'Fri', revenue: 89000, orders: 7 },
    { day: 'Sat', revenue: 112000, orders: 9 },
    { day: 'Sun', revenue: 76000, orders: 6 },
  ];

  const maxDailyRevenue = Math.max(...salesHistory.map((s) => s.revenue));

  // Category breakdown
  const categoryStats = products.reduce((acc: Record<string, number>, prod) => {
    acc[prod.category] = (acc[prod.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-neutral-900">
            Atelier Executive Dashboard
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time overview of retail revenue, courier fulfillment queues, and inventory health.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveAdminTab('products')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('coupons')}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            Create Coupon
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase tracking-wider">
            <span>Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            {formatPrice(totalRevenue)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span className="text-emerald-700 font-semibold">+18.4%</span>
            <span>vs previous period</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            {totalOrdersCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-neutral-500">
            <span className="text-amber-700 font-semibold">{pendingOrders.length} in queue</span>
            <span>·</span>
            <span>{completedOrders.length} delivered</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase tracking-wider">
            <span>Client Registry</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            {customers.length}
          </div>
          <div className="text-[11px] text-neutral-500">
            100% active verified accounts
          </div>
        </div>

        {/* Inventory Stock Alerts */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase tracking-wider">
            <span>Stock Health</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            {lowStockItems.length + outOfStockItems.length}
          </div>
          <div className="text-[11px] text-neutral-500 flex gap-2">
            <span className="text-amber-700 font-semibold">{lowStockItems.length} low</span>
            <span>·</span>
            <span className="text-rose-600 font-semibold">{outOfStockItems.length} out of stock</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Sales Trend & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-display text-lg font-bold text-neutral-900">
                Revenue & Sales Trajectory
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Daily sales performance over the past 7 days (in Rs. / base currency)
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
              High Growth
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-neutral-200">
            {salesHistory.map((s, idx) => {
              const heightPercent = Math.round((s.revenue / maxDailyRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-mono font-semibold text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Rs. {(s.revenue / 1000).toFixed(0)}k
                  </div>
                  <div
                    className="w-full bg-neutral-900 group-hover:bg-neutral-700 rounded-t-md transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-medium text-neutral-500 pb-2">{s.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
            <span>Average Order Value: <strong className="text-neutral-900 font-mono">Rs. 15,200</strong></span>
            <span>Fulfillment Rate: <strong className="text-neutral-900 font-mono">98.2%</strong></span>
          </div>
        </div>

        {/* Category Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 className="font-serif-display text-lg font-bold text-neutral-900">
            Catalogue Allocation
          </h2>
          <p className="text-xs text-neutral-500">Inventory share across major atelier departments</p>

          <div className="space-y-3 pt-2">
            {Object.entries(categoryStats).map(([cat, count]) => {
              const pct = Math.round((count / products.length) * 100);
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-800">{cat}</span>
                    <span className="text-neutral-500 font-mono">{count} items ({pct}%)</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-neutral-900 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <button
              onClick={() => setActiveAdminTab('inventory')}
              className="w-full py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              Audit Inventory Details
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Queue Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="font-serif-display text-lg font-bold text-neutral-900">
              Recent Fulfillment Orders
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live orders requiring verification, packaging, or courier handoff.
            </p>
          </div>

          <button
            onClick={() => setActiveAdminTab('orders')}
            className="flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-neutral-600 cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Client</th>
                <th className="py-3 px-6">Items</th>
                <th className="py-3 px-6">Payment Mode</th>
                <th className="py-3 px-6 text-right">Total</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-neutral-900">
                    {order.id}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-neutral-900">{order.customerName}</p>
                    <p className="text-[11px] text-neutral-500">{order.shippingAddress.city}</p>
                  </td>
                  <td className="py-4 px-6 text-neutral-600">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-neutral-800">{order.paymentMethod}</span>
                    <span className="block text-[10px] text-neutral-400">{order.paymentStatus}</span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-neutral-900 tabular-nums">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
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
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="p-1.5 text-neutral-500 hover:text-black rounded hover:bg-neutral-100 cursor-pointer"
                      title="View & Print Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    {order.orderStatus === 'Order Placed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Order Confirmed')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-neutral-900 rounded hover:bg-neutral-800 cursor-pointer"
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
