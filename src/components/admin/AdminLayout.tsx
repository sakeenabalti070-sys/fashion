import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Shirt,
  Boxes,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  Star,
  BarChart3,
  Settings,
  ArrowLeft,
  Bell,
  Check,
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    setIsAdminMode,
    activeAdminTab,
    setActiveAdminTab,
    settings,
    notifications,
    markNotificationRead,
  } = useStore();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Variations', icon: Shirt },
    { id: 'inventory', label: 'Inventory & Stock', icon: Boxes },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
    { id: 'categories', label: 'Categories & Brands', icon: FolderTree },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'coupons', label: 'Coupons & Discounts', icon: Tag },
    { id: 'reviews', label: 'Reviews Moderation', icon: Star },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-neutral-900 text-white border-b border-neutral-800 sticky top-0 z-40">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminMode(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Live Store</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="font-serif-display text-lg font-bold tracking-tight text-white">
                {settings.storeName}
              </span>
              <span className="text-neutral-500">·</span>
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-300">
                Merchant Operations Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Admin Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 text-neutral-900 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center text-xs">
                    <span className="font-bold">System Notifications</span>
                    <span className="text-[11px] text-neutral-500">
                      {unreadNotifications.length} unread
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 text-xs">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-neutral-400">No notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3 cursor-pointer hover:bg-neutral-50 transition-colors ${
                            !notif.read ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-neutral-900">{notif.title}</span>
                            <span className="text-[10px] text-neutral-400">{notif.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-neutral-600 mt-0.5">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Badge */}
            <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-neutral-200">Owner Access</span>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Tabs on Tablet/Desktop */}
        <div className="px-4 sm:px-6 bg-neutral-950 border-t border-neutral-800 flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeAdminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveAdminTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-neutral-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};
