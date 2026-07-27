import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types';
import ApiService from '../../services/apiService';

interface ProductsState {
  allProducts: Product[];
  popular: Product[];
  newCollections: Product[];
  loading: boolean;
  error: string | null;
  lastFetch: {
    allProducts: number;
    popular: number;
    newCollections: number;
  };
}

const initialState: ProductsState = {
  allProducts: [],
  popular: [],
  newCollections: [],
  loading: false,
  error: null,
  lastFetch: {
    allProducts: 0,
    popular: 0,
    newCollections: 0,
  },
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchAllProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { products: ProductsState };
      const now = Date.now();
      const lastFetch = state.products.lastFetch.allProducts;

      // Use cached data if less than 5 minutes old
      if (now - lastFetch < CACHE_DURATION && state.products.allProducts.length > 0) {
        return state.products.allProducts;
      }

      return await ApiService.getAllProducts();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch products');
    }
  }
);

export const fetchPopularProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchPopular',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { products: ProductsState };
      const now = Date.now();
      const lastFetch = state.products.lastFetch.popular;

      // Use cached data if less than 5 minutes old
      if (now - lastFetch < CACHE_DURATION && state.products.popular.length > 0) {
        return state.products.popular;
      }

      return await ApiService.getPopularProducts();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch popular products');
    }
  }
);

export const fetchNewCollections = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchNewCollections',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { products: ProductsState };
      const now = Date.now();
      const lastFetch = state.products.lastFetch.newCollections;

      // Use cached data if less than 5 minutes old
      if (now - lastFetch < CACHE_DURATION && state.products.newCollections.length > 0) {
        return state.products.newCollections;
      }

      return await ApiService.getNewCollections();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch new collections');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsError(state) {
      state.error = null;
    },
    invalidateCache(state, action: PayloadAction<'allProducts' | 'popular' | 'newCollections'>) {
      const now = Date.now();
      switch (action.payload) {
        case 'allProducts':
          state.lastFetch.allProducts = 0;
          break;
        case 'popular':
          state.lastFetch.popular = 0;
          break;
        case 'newCollections':
          state.lastFetch.newCollections = 0;
          break;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProducts = action.payload;
        state.loading = false;
        state.lastFetch.allProducts = Date.now();
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      .addCase(fetchPopularProducts.fulfilled, (state, action) => {
        state.popular = action.payload;
        state.lastFetch.popular = Date.now();
      })
      .addCase(fetchNewCollections.fulfilled, (state, action) => {
        state.newCollections = action.payload;
        state.lastFetch.newCollections = Date.now();
      });
  },
});

export const { clearProductsError, invalidateCache } = productsSlice.actions;
export const selectAllProducts = (state: { products: ProductsState }) =>
  state.products.allProducts;
export const selectPopularProducts = (state: { products: ProductsState }) =>
  state.products.popular;
export const selectNewCollections = (state: { products: ProductsState }) =>
  state.products.newCollections;
export const selectProductsLoading = (state: { products: ProductsState }) =>
  state.products.loading;
export const selectProductsError = (state: { products: ProductsState }) =>
  state.products.error;
export const selectProductsCacheValid = (state: { products: ProductsState }) => {
  const now = Date.now();
  return {
    allProducts: now - state.products.lastFetch.allProducts < CACHE_DURATION,
    popular: now - state.products.lastFetch.popular < CACHE_DURATION,
    newCollections: now - state.products.lastFetch.newCollections < CACHE_DURATION,
  };
};

export default productsSlice.reducer;
