/* ---------- Product & Variants ---------- */

export interface ProductVariant {
  size: string;
  color: string;
  colorHex: string;
  sku: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  basePrice: number;
  salePrice?: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  productId: number;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface CartItems {
  [key: string]: number; // legacy support – key = productId
}

/* ---------- Address ---------- */

export interface Address {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

/* ---------- Order ---------- */

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'credit_card' | 'pix' | 'boleto';

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  address: Address;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

/* ---------- Coupon ---------- */

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minValue: number;
}

export interface CouponValidation {
  valid: boolean;
  coupon?: Coupon;
  discount?: number;
  message?: string;
}

/* ---------- Auth ---------- */

export interface AuthResponse {
  success: boolean;
  token?: string;
  errors?: string;
  user?: { name: string; email: string };
}

/* ---------- Shop Context (legacy) ---------- */

export type Category = 'men' | 'women' | 'kid';

export interface ShopContextType {
  all_product: Product[];
  cartItems: CartItems;
  addToCart: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
  getTotalCartAmount: () => number;
  getTotalCartItems: () => number;
}
