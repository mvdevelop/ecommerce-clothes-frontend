export interface Product {
  id: number;
  name: string;
  category?: string;
  image: string;
  new_price: number;
  old_price: number;
  [key: string]: unknown;
}

export interface CartItems {
  [productId: number]: number;
}

export interface ShopContextType {
  all_product: Product[];
  cartItems: CartItems;
  addToCart: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
  getTotalCartAmount: () => number;
  getTotalCartItems: () => number;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  errors?: string;
}

export type Category = "men" | "women" | "kid";
