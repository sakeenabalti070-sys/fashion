import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Address } from '../../types/ecommerce';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Compass,
  Printer,
  Plus,
  Trash2,
} from 'lucide-react';

export const CustomerAccountModal: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    currentCustomer,
    loginCustomer,
    logoutCustomer,
    registerCustomer,
    orders,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    setTrackingOrderId,
    setSelectedInvoiceOrder,
    formatPrice,
    addSavedAddress,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>('orders');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // New address form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: '',
    phone: '',
    email: '',
    streetAddress: '',
    city: 'Lahore',
    provinceState: 'Punjab',
    postalCode: '54000',
    country: 'Pakistan',
  });

  if (!isAccountOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginCustomer(loginEmail);
    if (!success) {
      showToast('No customer account found with this email. Try quick demo accounts.', 'error');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      showToast('Please fill all fields', 'error');
      return;
    }
    registerCustomer(regName, regEmail, regPhone);
  };

  const customerOrders = orders.filter(
    (o) =>
      currentCustomer &&
      (o.customerId === currentCustomer.id ||
        o.customerEmail.toLowerCase() === currentCustomer.email.toLowerCase())
  );

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.streetAddress || !newAddress.fullName) {
      showToast('Please complete address fields', 'error');
      return;
    }
    addSavedAddress(newAddress);
    setShowAddAddress(false);
    showToast('Saved new delivery address', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-neutral-800" />
            <h2 className="font-serif-display text-xl font-bold text-neutral-900">
              {currentCustomer ? `Client Portal · ${currentCustomer.name}` : 'Customer Sign In'}
            </h2>
          </div>
          <button
            onClick={() => setIsAccountOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!currentCustomer ? (
          /* Authentication Screen */
          <div className="p-6 sm:p-10 max-w-md mx-auto">
            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="font-serif-display text-2xl font-bold text-neutral-900">Welcome Back</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Sign in to track orders, access your wishlist and view purchase invoices.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="amina.farooq@example.com"
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Sign In
                </button>

                {/* Quick 1-Click Demo Profiles */}
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 text-center">
                    Instant Demo Accounts
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => loginCustomer('amina.farooq@example.com')}
                      className="p-2 text-left bg-neutral-50 hover:bg-neutral-100 rounded border border-neutral-200 text-xs transition-colors cursor-pointer"
                    >
                      <p className="font-semibold text-neutral-900">Amina Farooq</p>
                      <p className="text-[10px] text-neutral-500 truncate">amina.farooq@...</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => loginCustomer('hamza.tariq@example.com')}
                      className="p-2 text-left bg-neutral-50 hover:bg-neutral-100 rounded border border-neutral-200 text-xs transition-colors cursor-pointer"
                    >
                      <p className="font-semibold text-neutral-900">Hamza Tariq</p>
                      <p className="text-[10px] text-neutral-500 truncate">hamza.tariq@...</p>
                    </button>
                  </div>
                </div>

                <div className="text-center pt-2 text-xs text-neutral-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="font-semibold text-neutral-900 underline cursor-pointer"
                  >
                    Register here
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="font-serif-display text-2xl font-bold text-neutral-900">Create Account</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Join AURA for complimentary bespoke garment packaging and priority delivery.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Fatima Zahra"
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="fatima@example.com"
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Complete Registration
                </button>

                <div className="text-center pt-2 text-xs text-neutral-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="font-semibold text-neutral-900 underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'orders' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  My Orders ({customerOrders.length})
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'wishlist' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Wishlist ({wishlistProducts.length})
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'addresses' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Saved Addresses
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'profile' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Profile
                </button>
              </div>

              <button
                onClick={logoutCustomer}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

            {/* TAB: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {customerOrders.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-6 text-center">
                    You haven't placed any orders yet.
                  </p>
                ) : (
                  customerOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-neutral-900">{order.id}</span>
                          <span className="text-xs text-neutral-400 mx-2">·</span>
                          <span className="text-xs text-neutral-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-200 text-neutral-800">
                            {order.orderStatus}
                          </span>
                          <span className="text-xs font-mono font-bold text-neutral-900 tabular-nums">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-200/80">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-neutral-200 text-xs">
                            <img src={item.image} alt={item.productName} className="w-6 h-8 object-cover rounded" />
                            <span>{item.productName} ({item.size})</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setTrackingOrderId(order.id);
                            setIsAccountOpen(false);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-neutral-800 bg-white border border-neutral-300 rounded hover:bg-neutral-100 flex items-center gap-1 cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>Track Package</span>
                        </button>
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded hover:bg-neutral-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-3">
                {wishlistProducts.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-6 text-center">Your wishlist is currently empty.</p>
                ) : (
                  wishlistProducts.map((p) => (
                    <div key={p.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={p.featuredImage} alt={p.name} className="w-12 h-14 object-cover rounded bg-neutral-100" />
                        <div>
                          <p className="text-xs font-semibold text-neutral-900">{p.name}</p>
                          <p className="text-[11px] text-neutral-500">{p.brand} · {formatPrice(p.salePrice ?? p.basePrice)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            addToCart(p, p.sizes[0] || 'M', p.colors[0]?.name || 'Standard');
                            toggleWishlist(p.id);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded hover:bg-neutral-800 flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Bag</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Saved Delivery Locations</h4>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="text-xs font-semibold text-neutral-900 underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleSaveNewAddress} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-700 font-semibold mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full p-2 border border-neutral-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-700 font-semibold mb-1">Phone</label>
                        <input
                          type="text"
                          required
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full p-2 border border-neutral-300 rounded"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[11px] text-neutral-700 font-semibold mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={newAddress.streetAddress}
                          onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                          className="w-full p-2 border border-neutral-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-700 font-semibold mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full p-2 border border-neutral-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-700 font-semibold mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          className="w-full p-2 border border-neutral-300 rounded"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-3 py-1.5 text-xs text-neutral-600 hover:text-black cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 rounded hover:bg-neutral-800 cursor-pointer"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {currentCustomer.savedAddresses.map((addr, i) => (
                  <div key={i} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
                    <p className="font-semibold text-neutral-900">{addr.fullName} ({addr.phone})</p>
                    <p className="text-neutral-600">{addr.streetAddress}, {addr.city}, {addr.provinceState} {addr.postalCode}</p>
                    <p className="text-neutral-400">{addr.country}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Full Name</span>
                    <span className="font-semibold text-neutral-900">{currentCustomer.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Email</span>
                    <span className="font-semibold text-neutral-900">{currentCustomer.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Mobile Phone</span>
                    <span className="font-semibold text-neutral-900">{currentCustomer.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Member Since</span>
                    <span className="font-semibold text-neutral-900">{currentCustomer.joinedDate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Total Purchases</span>
                    <span className="font-mono font-bold text-neutral-900">{formatPrice(currentCustomer.totalSpent)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Account Status</span>
                    <span className="font-semibold text-emerald-700">{currentCustomer.status}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
