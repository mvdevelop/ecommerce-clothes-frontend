import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Address } from '../../types';

const url = 'http://localhost:4000';

interface AddressState {
  addresses: Address[];
  loading: boolean;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
};

const getHeaders = (getState: () => unknown) => ({
  'Content-Type': 'application/json',
  'auth-token': (getState() as { auth: { token: string | null } }).auth
    .token || '',
});

export const fetchAddresses = createAsyncThunk<Address[], void>(
  'addresses/fetchAll',
  async (_, { getState }) => {
    const res = await fetch(`${url}/addresses`, {
      headers: getHeaders(getState),
    });
    return res.json();
  }
);

export const createAddress = createAsyncThunk<
  Address,
  Omit<Address, 'id'>
>('addresses/create', async (address, { getState }) => {
  const res = await fetch(`${url}/addresses`, {
    method: 'POST',
    headers: getHeaders(getState),
    body: JSON.stringify(address),
  });
  return res.json();
});

export const updateAddress = createAsyncThunk<
  Address,
  { id: string; data: Partial<Address> }
>('addresses/update', async ({ id, data }, { getState }) => {
  const res = await fetch(`${url}/addresses/${id}`, {
    method: 'PUT',
    headers: getHeaders(getState),
    body: JSON.stringify(data),
  });
  return res.json();
});

export const deleteAddress = createAsyncThunk<string, string>(
  'addresses/delete',
  async (id, { getState }) => {
    await fetch(`${url}/addresses/${id}`, {
      method: 'DELETE',
      headers: getHeaders(getState),
    });
    return id;
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
        state.loading = false;
      })
      .addCase(fetchAddresses.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const idx = state.addresses.findIndex(
          (a) => a.id === action.payload.id
        );
        if (idx >= 0) state.addresses[idx] = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (a) => a.id !== action.payload
        );
      });
  },
});

export const selectAddresses = (state: { address: AddressState }) =>
  state.address.addresses;
export const selectDefaultAddress = (state: { address: AddressState }) =>
  state.address.addresses.find((a) => a.isDefault);

export default addressSlice.reducer;
