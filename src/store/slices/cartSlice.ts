import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItemState {
  productId: number;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItemState[];
  coupon: { code: string; discount: number } | null;
  shipping: number;
}

const initialState: CartState = {
  items: [],
  coupon: null,
  shipping: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{
        productId: number;
        name: string;
        image: string;
        size: string;
        color: string;
        price: number;
      }>
    ) {
      const { productId, size, color } = action.payload;
      const existing = state.items.find(
        (i) => i.productId === productId && i.size === size && i.color === color
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(
      state,
      action: PayloadAction<{ productId: number; size: string; color: string }>
    ) {
      const { productId, size, color } = action.payload;
      state.items = state.items.filter(
        (i) => !(i.productId === productId && i.size === size && i.color === color)
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{
        productId: number;
        size: string;
        color: string;
        quantity: number;
      }>
    ) {
      const { productId, size, color, quantity } = action.payload;
      const item = state.items.find(
        (i) => i.productId === productId && i.size === size && i.color === color
      );
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
      state.shipping = 0;
    },
    setCart(state, action: PayloadAction<CartItemState[]>) {
      state.items = action.payload;
    },
    applyCoupon(
      state,
      action: PayloadAction<{ code: string; discount: number }>
    ) {
      state.coupon = action.payload;
    },
    removeCoupon(state) {
      state.coupon = null;
    },
    setShipping(state, action: PayloadAction<number>) {
      state.shipping = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCart,
  applyCoupon,
  removeCoupon,
  setShipping,
} = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCoupon = (state: { cart: CartState }) => state.cart.coupon;
export const selectShipping = (state: { cart: CartState }) => state.cart.shipping;

export const selectSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const selectDiscount = (state: { cart: CartState }) => {
  if (!state.cart.coupon) return 0;
  const subtotal = selectSubtotal(state);
  return state.cart.coupon.discount;
};

export const selectTotal = (state: { cart: CartState }) => {
  const subtotal = selectSubtotal(state);
  const discount = selectDiscount(state);
  const shipping = state.cart.shipping;
  return Math.max(0, subtotal - discount + shipping);
};

export const selectTotalItems = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;
