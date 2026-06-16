import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItems } from '../../types';

interface CartState {
  items: CartItems;
}

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.items[id] = (state.items[id] || 0) + 1;
    },
    removeFromCart(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.items[id] > 0) {
        state.items[id]--;
      }
    },
    clearCart(state) {
      state.items = {};
    },
    setCart(state, action: PayloadAction<CartItems>) {
      state.items = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCart } =
  cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectTotalAmount = (state: { cart: CartState; products: { allProducts: { id: number; new_price: number }[] } }) => {
  let total = 0;
  for (const idStr in state.cart.items) {
    const id = Number(idStr);
    const qty = state.cart.items[id];
    if (qty > 0) {
      const product = state.products.allProducts.find((p) => p.id === id);
      if (product) {
        total += product.new_price * qty;
      }
    }
  }
  return total;
};

export const selectTotalItems = (state: { cart: CartState }) => {
  let total = 0;
  for (const idStr in state.cart.items) {
    const qty = state.cart.items[idStr];
    if (qty > 0) total += qty;
  }
  return total;
};

export default cartSlice.reducer;
