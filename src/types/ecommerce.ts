export type CurrencyCode = 'PKR' | 'USD' | 'AED' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateAgainstUSD: number; // e.g. 1 USD = 280 PKR, 3.67 AED, 0.79 GBP
}

export interface ProductVariation {
  id: string;
  size: string; // 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Standard'
  color: string; // 'Emerald Green', 'Black', 'Pearl White', etc.
  colorHex?: string;
  sku: string;
  price: number; // in base currency (PKR)
  salePrice?: number;
  stock: number;
  image?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'hidden';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  brand: string;
  description: string;
  shortDescription: string;
  basePrice: number; // in base currency (PKR)
  salePrice?: number;
  images: string[];
  featuredImage: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  variations: ProductVariation[];
  totalStock: number;
  lowStockThreshold: number;
  sku: string;
  material: string;
  careInstructions: string;
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isPublished: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface CartItem {
  cartItemId: string; // unique combo of productId + size + color
  product: Product;
  selectedSize: string;
  selectedColor: string;
  variationId?: string;
  quantity: number;
  unitPrice: number;
}

export interface Address {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  provinceState: string;
  postalCode: string;
  country: string;
  instructions?: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export type PaymentMethod =
  | 'Cash on Delivery (COD)'
  | 'Direct Bank Transfer'
  | 'Credit / Debit Card'
  | 'JazzCash / EasyPaisa';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface Order {
  id: string; // e.g., 'ORD-2026-001042'
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: CurrencyCode;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  orderStatus: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  trackingNumber?: string;
  courierCompany?: string; // TCS, Leopard, DHL, etc.
  appliedCoupon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 15 for 15% or 500 for Rs.500
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  status: 'Active' | 'Blocked';
  joinedDate: string;
  savedAddresses: Address[];
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  storeAddress: string;
  city: string;
  country: string;
  baseCurrency: CurrencyCode;
  standardShippingFee: number;
  freeShippingThreshold: number;
  taxPercentage: number;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
  };
  mobileWalletDetails: {
    jazzcashNumber: string;
    jazzcashTitle: string;
    easypaisaNumber: string;
    easypaisaTitle: string;
  };
  enabledPaymentMethods: {
    cod: boolean;
    bankTransfer: boolean;
    card: boolean;
    mobileWallet: boolean;
  };
  socialLinks: {
    instagram?: string;
    whatsapp?: string;
    facebook?: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'customer' | 'promo';
  timestamp: string;
  read: boolean;
  orderId?: string;
}
