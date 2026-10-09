import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  Coupon,
  Customer,
  StoreSettings,
  ProductReview,
  NotificationItem,
  CurrencyCode,
  PaymentMethod,
  Address,
} from '../types/ecommerce';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_CUSTOMERS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  subcategories: string[];
  count: number;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Navigation & View mode
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  selectedInvoiceOrder: Order | null;
  setSelectedInvoiceOrder: (order: Order | null) => void;

  // Currency
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  formatPrice: (amountInPKR: number) => string;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  togglePublishProduct: (id: string) => void;
  adjustStock: (productId: string, variationId: string | undefined, delta: number) => void;

  // Categories & Brands
  categories: CategoryItem[];
  addCategory: (name: string, subcategories: string[]) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (categoryId: string, subName: string) => void;
  brands: string[];
  addBrand: (name: string) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (orderPayload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    paymentMethod: PaymentMethod;
  }) => Order;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    note?: string,
    trackingNumber?: string,
    courierCompany?: string
  ) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Customers & Auth
  customers: Customer[];
  currentCustomer: Customer | null;
  loginCustomer: (email: string) => boolean;
  logoutCustomer: () => void;
  registerCustomer: (name: string, email: string, phone: string) => Customer;
  updateCustomerProfile: (updates: Partial<Customer>) => void;
  addSavedAddress: (address: Address) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Reviews
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'date' | 'status'>) => void;
  updateReviewStatus: (id: string, status: 'approved' | 'hidden') => void;
  deleteReview: (id: string) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetAllData: () => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;

  // Toast feedback
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'aura_store_v1_';

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Failed reading localStorage', e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed writing localStorage', e);
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation / UI view states
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => getStored('isAdminMode', false));
  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Currency
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => getStored('currency', 'PKR'));

  // Core Data Entities
  const [products, setProducts] = useState<Product[]>(() => getStored('products', INITIAL_PRODUCTS));
  const [categories, setCategories] = useState<CategoryItem[]>(() => getStored('categories', INITIAL_CATEGORIES));
  const [brands, setBrands] = useState<string[]>(() => getStored('brands', INITIAL_BRANDS));
  const [cart, setCart] = useState<CartItem[]>(() => getStored('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => getStored('appliedCoupon', null));
  const [wishlist, setWishlist] = useState<string[]>(() => getStored('wishlist', ['prod-001']));
  const [orders, setOrders] = useState<Order[]>(() => getStored('orders', INITIAL_ORDERS));
  const [customers, setCustomers] = useState<Customer[]>(() => getStored('customers', INITIAL_CUSTOMERS));
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() =>
    getStored('currentCustomer', INITIAL_CUSTOMERS[0])
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() => getStored('coupons', INITIAL_COUPONS));
  const [reviews, setReviews] = useState<ProductReview[]>(() => getStored('reviews', INITIAL_REVIEWS));
  const [settings, setSettings] = useState<StoreSettings>(() => getStored('settings', INITIAL_SETTINGS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStored('notifications', INITIAL_NOTIFICATIONS)
  );

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Sync to local storage
  useEffect(() => setStored('products', products), [products]);
  useEffect(() => setStored('categories', categories), [categories]);
  useEffect(() => setStored('brands', brands), [brands]);
  useEffect(() => setStored('cart', cart), [cart]);
  useEffect(() => setStored('appliedCoupon', appliedCoupon), [appliedCoupon]);
  useEffect(() => setStored('wishlist', wishlist), [wishlist]);
  useEffect(() => setStored('orders', orders), [orders]);
  useEffect(() => setStored('customers', customers), [customers]);
  useEffect(() => setStored('currentCustomer', currentCustomer), [currentCustomer]);
  useEffect(() => setStored('coupons', coupons), [coupons]);
  useEffect(() => setStored('reviews', reviews), [reviews]);
  useEffect(() => setStored('settings', settings), [settings]);
  useEffect(() => setStored('notifications', notifications), [notifications]);
  useEffect(() => setStored('currency', currency), [currency]);
  useEffect(() => setStored('isAdminMode', isAdminMode), [isAdminMode]);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    showToast(`Currency changed to ${c}`, 'info');
  };

  // Currency Converter & Formatter
  const formatPrice = (amountInPKR: number): string => {
    // 1 USD = approx 280 PKR, 1 AED = 76.5 PKR, 1 GBP = 355 PKR
    switch (currency) {
      case 'USD': {
        const val = amountInPKR / 280;
        return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      case 'AED': {
        const val = amountInPKR / 76.5;
        return `AED ${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      }
      case 'GBP': {
        const val = amountInPKR / 355;
        return `£${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      case 'PKR':
      default:
        return `Rs. ${amountInPKR.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon && appliedCoupon.isActive && cartSubtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.type === 'percentage') {
      cartDiscount = (cartSubtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount && cartDiscount > appliedCoupon.maxDiscount) {
        cartDiscount = appliedCoupon.maxDiscount;
      }
    } else {
      cartDiscount = appliedCoupon.value;
    }
  }

  const cartShippingFee =
    cart.length === 0 || cartSubtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingFee);

  // Cart Operations
  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    const variation = product.variations.find((v) => v.size === size && v.color === color);
    const cartItemId = `${product.id}-${size}-${color}`;
    const unitPrice = variation ? (variation.salePrice ?? variation.price) : (product.salePrice ?? product.basePrice);

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          selectedSize: size,
          selectedColor: color,
          variationId: variation?.id,
          quantity,
          unitPrice,
        },
      ];
    });

    showToast(`Added ${product.name} (${size} · ${color}) to bag`, 'success');
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from shopping bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === clean);
    if (!found) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    if (!found.isActive) {
      return { success: false, message: 'This coupon has expired or is inactive.' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order amount of ${formatPrice(found.minOrderAmount)} required.`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied!`, 'success');
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders & Stock Decrement
  const placeOrder = (orderPayload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    paymentMethod: PaymentMethod;
  }): Order => {
    const nextOrderNumber = orders.length + 1043;
    const orderId = `ORD-2026-00${nextOrderNumber}`;
    const timestamp = new Date().toISOString();

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      size: item.selectedSize,
      color: item.selectedColor,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
      image: item.product.featuredImage,
    }));

    const newOrder: Order = {
      id: orderId,
      customerId: currentCustomer?.id,
      customerName: orderPayload.customerName,
      customerEmail: orderPayload.customerEmail,
      customerPhone: orderPayload.customerPhone,
      shippingAddress: orderPayload.shippingAddress,
      items: orderItems,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingFee: cartShippingFee,
      tax: 0,
      total: cartTotal,
      currency,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus:
        orderPayload.paymentMethod === 'Cash on Delivery (COD)' ? 'Pending' : 'Paid',
      orderStatus: 'Order Placed',
      statusHistory: [
        {
          status: 'Order Placed',
          timestamp,
          note: `Order placed successfully via ${orderPayload.paymentMethod}`,
        },
      ],
      appliedCoupon: appliedCoupon?.code,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // 1. Decrement Stock from Product and Variation
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const matchingCartItems = cart.filter((c) => c.product.id === prod.id);
        if (matchingCartItems.length === 0) return prod;

        let deductedTotal = 0;
        const updatedVariations = prod.variations.map((v) => {
          const cartMatch = matchingCartItems.find(
            (c) => c.selectedSize === v.size && c.selectedColor === v.color
          );
          if (cartMatch) {
            deductedTotal += cartMatch.quantity;
            return { ...v, stock: Math.max(0, v.stock - cartMatch.quantity) };
          }
          return v;
        });

        return {
          ...prod,
          variations: updatedVariations,
          totalStock: Math.max(0, prod.totalStock - deductedTotal),
        };
      })
    );

    // 2. Increment coupon used count if used
    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === appliedCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c))
      );
    }

    // 3. Update customer stats if logged in
    if (currentCustomer) {
      setCustomers((prev) =>
        prev.map((cust) =>
          cust.id === currentCustomer.id
            ? {
                ...cust,
                ordersCount: cust.ordersCount + 1,
                totalSpent: cust.totalSpent + cartTotal,
              }
            : cust
        )
      );
    }

    // 4. Record new order
    setOrders((prev) => [newOrder, ...prev]);

    // 5. Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Order Received',
      message: `Order #${orderId} was placed by ${orderPayload.customerName} (${formatPrice(cartTotal)}).`,
      type: 'order',
      timestamp: 'Just now',
      read: false,
      orderId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Clear cart
    clearCart();
    showToast(`Order #${orderId} confirmed!`, 'success');

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    trackingNumber?: string,
    courierCompany?: string
  ) => {
    const timestamp = new Date().toISOString();

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        // If transitioning to Cancelled or Returned, restock inventory
        if (
          (newStatus === 'Cancelled' || newStatus === 'Returned') &&
          order.orderStatus !== 'Cancelled' &&
          order.orderStatus !== 'Returned'
        ) {
          // Restock items
          setProducts((currentProducts) =>
            currentProducts.map((prod) => {
              const matchedItems = order.items.filter((it) => it.productId === prod.id);
              if (matchedItems.length === 0) return prod;

              let restoredQty = 0;
              const newVariations = prod.variations.map((v) => {
                const itemMatch = matchedItems.find((it) => it.size === v.size && it.color === v.color);
                if (itemMatch) {
                  restoredQty += itemMatch.quantity;
                  return { ...v, stock: v.stock + itemMatch.quantity };
                }
                return v;
              });

              return {
                ...prod,
                variations: newVariations,
                totalStock: prod.totalStock + restoredQty,
              };
            })
          );
          showToast(`Stock restored for ${order.id}`, 'info');
        }

        const newHistory = [
          ...order.statusHistory,
          {
            status: newStatus,
            timestamp,
            note: note || `Order status updated to ${newStatus}`,
          },
        ];

        return {
          ...order,
          orderStatus: newStatus,
          statusHistory: newHistory,
          trackingNumber: trackingNumber ?? order.trackingNumber,
          courierCompany: courierCompany ?? order.courierCompany,
          paymentStatus:
            newStatus === 'Delivered'
              ? 'Paid'
              : newStatus === 'Refunded'
              ? 'Refunded'
              : order.paymentStatus,
          updatedAt: timestamp,
        };
      })
    );

    showToast(`Order ${orderId} updated to ${newStatus}`, 'success');
  };

  const getOrderById = (orderId: string) => {
    return orders.find(
      (o) => o.id.trim().toLowerCase() === orderId.trim().toLowerCase()
    );
  };

  // Product CRUD (Admin)
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" created`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted', 'info');
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Product = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copy)`,
      sku: `${target.sku}-COPY`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [duplicated, ...prev]);
    showToast(`Duplicated ${target.name}`, 'success');
  };

  const togglePublishProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    );
    showToast('Product visibility updated', 'info');
  };

  const adjustStock = (productId: string, variationId: string | undefined, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;

        if (variationId) {
          const updatedVars = p.variations.map((v) =>
            v.id === variationId ? { ...v, stock: Math.max(0, v.stock + delta) } : v
          );
          const newTotal = updatedVars.reduce((sum, v) => sum + v.stock, 0);
          return { ...p, variations: updatedVars, totalStock: newTotal };
        } else {
          const newTotal = Math.max(0, p.totalStock + delta);
          return { ...p, totalStock: newTotal };
        }
      })
    );
    showToast('Stock inventory updated', 'success');
  };

  // Categories & Brands
  const addCategory = (name: string, subcategories: string[]) => {
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      subcategories,
      count: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${name}" created`, 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted', 'info');
  };

  const addSubcategory = (categoryId: string, subName: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, subcategories: [...c.subcategories, subName] } : c
      )
    );
    showToast(`Subcategory "${subName}" added`, 'success');
  };

  const addBrand = (brandName: string) => {
    if (!brands.includes(brandName)) {
      setBrands((prev) => [...prev, brandName]);
      showToast(`Brand "${brandName}" added`, 'success');
    }
  };

  // Customer Management & Auth
  const loginCustomer = (email: string): boolean => {
    const found = customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentCustomer(found);
      showToast(`Welcome back, ${found.name}`, 'success');
      return true;
    }
    return false;
  };

  const logoutCustomer = () => {
    setCurrentCustomer(null);
    showToast('Signed out of customer account', 'info');
  };

  const registerCustomer = (name: string, email: string, phone: string): Customer => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name,
      email,
      phone,
      ordersCount: 0,
      totalSpent: 0,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      savedAddresses: [],
    };
    setCustomers((prev) => [newCust, ...prev]);
    setCurrentCustomer(newCust);
    showToast(`Welcome to AURA, ${name}!`, 'success');
    return newCust;
  };

  const updateCustomerProfile = (updates: Partial<Customer>) => {
    if (!currentCustomer) return;
    const updated = { ...currentCustomer, ...updates };
    setCurrentCustomer(updated);
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast('Profile updated', 'success');
  };

  const addSavedAddress = (address: Address) => {
    if (!currentCustomer) return;
    const updatedAddresses = [...currentCustomer.savedAddresses, address];
    updateCustomerProfile({ savedAddresses: updatedAddresses });
  };

  // Coupons
  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `cpn-${Date.now()}`,
      usedCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Coupon ${newCoupon.code} created`, 'success');
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Coupon updated', 'success');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon deleted', 'info');
  };

  // Reviews
  const addReview = (reviewData: Omit<ProductReview, 'id' | 'date' | 'status'>) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'approved',
    };
    setReviews((prev) => [newReview, ...prev]);

    // Update product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== reviewData.productId) return p;
        const newCount = p.reviewsCount + 1;
        const newRating = Number(((p.rating * p.reviewsCount + reviewData.rating) / newCount).toFixed(1));
        return { ...p, rating: newRating, reviewsCount: newCount };
      })
    );

    showToast('Thank you! Your verified review has been published.', 'success');
  };

  const updateReviewStatus = (id: string, status: 'approved' | 'hidden') => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    showToast(`Review status updated to ${status}`, 'info');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review deleted', 'info');
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings saved', 'success');
  };

  const resetAllData = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setBrands(INITIAL_BRANDS);
    setOrders(INITIAL_ORDERS);
    setCoupons(INITIAL_COUPONS);
    setCustomers(INITIAL_CUSTOMERS);
    setCurrentCustomer(INITIAL_CUSTOMERS[0]);
    setReviews(INITIAL_REVIEWS);
    setSettings(INITIAL_SETTINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCart([]);
    setAppliedCoupon(null);
    setCurrencyState('PKR');
    showToast('Store reset to initial luxury catalogue', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        isAdminMode,
        setIsAdminMode,
        activeAdminTab,
        setActiveAdminTab,
        selectedProductId,
        setSelectedProductId,
        trackingOrderId,
        setTrackingOrderId,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountOpen,
        setIsAccountOpen,
        selectedInvoiceOrder,
        setSelectedInvoiceOrder,

        currency,
        setCurrency,
        formatPrice,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        togglePublishProduct,
        adjustStock,

        categories,
        addCategory,
        deleteCategory,
        addSubcategory,
        brands,
        addBrand,

        cart,
        addToCart,
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
        wishlist,
        toggleWishlist,
        isInWishlist,

        orders,
        placeOrder,
        updateOrderStatus,
        getOrderById,

        customers,
        currentCustomer,
        loginCustomer,
        logoutCustomer,
        registerCustomer,
        updateCustomerProfile,
        addSavedAddress,

        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,

        reviews,
        addReview,
        updateReviewStatus,
        deleteReview,

        settings,
        updateSettings,
        resetAllData,

        notifications,
        markNotificationRead,

        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
