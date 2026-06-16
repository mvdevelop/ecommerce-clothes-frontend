import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types';

const url = 'http://localhost:4000';

interface ProductsState {
  allProducts: Product[];
  popular: Product[];
  newCollections: Product[];
  loading: boolean;
}

const initialState: ProductsState = {
  allProducts: [],
  popular: [],
  newCollections: [],
  loading: false,
};

export const fetchAllProducts = createAsyncThunk<Product[]>(
  'products/fetchAll',
  async () => {
    const res = await fetch(`${url}/allproducts`);
    return res.json();
  }
);

export const fetchPopularProducts = createAsyncThunk<Product[]>(
  'products/fetchPopular',
  async () => {
    const res = await fetch(`${url}/popularinwomen`);
    return res.json();
  }
);

export const fetchNewCollections = createAsyncThunk<Product[]>(
  'products/fetchNewCollections',
  async () => {
    const res = await fetch(`${url}/newcollections`);
    return res.json();
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setAllProducts(state, action: PayloadAction<Product[]>) {
      state.allProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProducts = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchPopularProducts.fulfilled, (state, action) => {
        state.popular = action.payload;
      })
      .addCase(fetchNewCollections.fulfilled, (state, action) => {
        state.newCollections = action.payload;
      });
  },
});

export const { setAllProducts } = productsSlice.actions;
export const selectAllProducts = (state: { products: ProductsState }) =>
  state.products.allProducts;
export const selectPopularProducts = (state: { products: ProductsState }) =>
  state.products.popular;
export const selectNewCollections = (state: { products: ProductsState }) =>
  state.products.newCollections;
export const selectProductsLoading = (state: { products: ProductsState }) =>
  state.products.loading;

export default productsSlice.reducer;
