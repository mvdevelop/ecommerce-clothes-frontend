import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Order } from '../../types';

const url = 'http://localhost:4000';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
};

export const fetchOrders = createAsyncThunk<Order[], void>(
  'orders/fetchAll',
  async (_, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const res = await fetch(`${url}/orders`, {
      headers: { 'auth-token': state.auth.token || '' },
    });
    return res.json();
  }
);

export const fetchOrderById = createAsyncThunk<Order, string>(
  'orders/fetchById',
  async (orderId, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const res = await fetch(`${url}/orders/${orderId}`, {
      headers: { 'auth-token': state.auth.token || '' },
    });
    return res.json();
  }
);

export const createOrder = createAsyncThunk<
  Order,
  {
    items: {
      productId: number;
      name: string;
      image: string;
      size: string;
      color: string;
      price: number;
      quantity: number;
    }[];
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    addressId: string;
    paymentMethod: string;
  }
>('orders/create', async (orderData, { getState }) => {
  const state = getState() as { auth: { token: string | null } };
  const res = await fetch(`${url}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': state.auth.token || '',
    },
    body: JSON.stringify(orderData),
  });
  return res.json();
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;

export const selectOrders = (state: { order: OrderState }) => state.order.orders;
export const selectCurrentOrder = (state: { order: OrderState }) =>
  state.order.currentOrder;
export const selectOrdersLoading = (state: { order: OrderState }) =>
  state.order.loading;

export default orderSlice.reducer;
