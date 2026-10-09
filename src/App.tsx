import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Product } from './types/ecommerce';

// Customer Components
import { Navbar } from './components/customer/Navbar';
import { HeroBanner } from './components/customer/HeroBanner';
import { CategoryBar } from './components/customer/CategoryBar';
import { ProductGrid } from './components/customer/ProductGrid';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackingView } from './components/customer/OrderTrackingView';
import { CustomerAccountModal } from './components/customer/CustomerAccountModal';
import { ReviewModal } from './components/customer/ReviewModal';
import { Footer } from './components/customer/Footer';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminCoupons } from './components/admin/AdminCoupons';
import { AdminReviews } from './components/admin/AdminReviews';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSettings } from './components/admin/AdminSettings';

// Common Components
import { InvoiceModal } from './components/common/InvoiceModal';
import { ToastContainer } from './components/common/ToastContainer';

function StoreApp() {
  const {
    isAdminMode,
    activeAdminTab,
    selectedProductId,
    setSelectedProductId,
    trackingOrderId,
    setTrackingOrderId,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [reviewingProduct, setReviewingProduct] = useState<Product | null>(null);
  const [showTrackingPage, setShowTrackingPage] = useState(false);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setShowTrackingPage(false);
    const element = document.getElementById('collection-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenTracking = () => {
    setShowTrackingPage(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Admin View
  if (isAdminMode) {
    return (
      <AdminLayout>
        {activeAdminTab === 'dashboard' && <AdminDashboard />}
        {activeAdminTab === 'products' && <AdminProducts />}
        {activeAdminTab === 'inventory' && <AdminInventory />}
        {activeAdminTab === 'orders' && <AdminOrders />}
        {activeAdminTab === 'categories' && <AdminCategories />}
        {activeAdminTab === 'customers' && <AdminCustomers />}
        {activeAdminTab === 'coupons' && <AdminCoupons />}
        {activeAdminTab === 'reviews' && <AdminReviews />}
        {activeAdminTab === 'reports' && <AdminReports />}
        {activeAdminTab === 'settings' && <AdminSettings />}

        {/* Global Modals in Admin */}
        <InvoiceModal />
        <ToastContainer />
      </AdminLayout>
    );
  }

  // Render Customer Storefront View
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Customer Navbar */}
      <Navbar
        onSelectCategory={handleSelectCategory}
        onOpenTracking={handleOpenTracking}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {showTrackingPage || trackingOrderId ? (
          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
              <button
                onClick={() => {
                  setShowTrackingPage(false);
                  setTrackingOrderId(null);
                }}
                className="text-xs font-semibold text-neutral-600 hover:text-black underline cursor-pointer"
              >
                ← Back to Collections
              </button>
            </div>
            <OrderTrackingView onClose={() => setShowTrackingPage(false)} />
          </div>
        ) : (
          <>
            {/* Hero Campaign */}
            <HeroBanner
              onExploreClick={() => {
                const el = document.getElementById('collection-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onCategoryClick={(cat) => handleSelectCategory(cat)}
            />

            {/* Category Navigation Bar */}
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Filterable Product Grid */}
            <ProductGrid
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onQuickView={(p) => setSelectedProductId(p.id)}
            />
          </>
        )}
      </main>

      {/* Editorial Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenTracking={handleOpenTracking}
      />

      {/* Global Modals */}
      {selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onOpenReview={(prod) => setReviewingProduct(prod)}
        />
      )}

      {reviewingProduct && (
        <ReviewModal
          product={reviewingProduct}
          onClose={() => setReviewingProduct(null)}
        />
      )}

      <CartDrawer />
      <CheckoutModal />
      <CustomerAccountModal />
      <InvoiceModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreApp />
    </StoreProvider>
  );
}
