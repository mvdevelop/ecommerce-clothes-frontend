import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types';
import ApiService from '../../services/apiService';

interface ProductsState {
  allProducts: Product[];
  popular: Product[];
  newCollections: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  allProducts: [],
  popular: [],
  newCollections: [],
  loading: false,
  error: null,
};

export const fetchAllProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiService.getAllProducts();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch products');
    }
  }
);

export const fetchPopularProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchPopular',
  async (_, { rejectWithValue }) => {
    try {
      return await ApiService.getPopularProducts();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch popular products');
    }
  }
);

export const fetchNewCollections = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchNewCollections',
  async (_, { rejectWithValue }) => {
    try {
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
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      .addCase(fetchPopularProducts.fulfilled, (state, action) => {
        state.popular = action.payload;
      })
      .addCase(fetchNewCollections.fulfilled, (state, action) => {
        state.newCollections = action.payload;
      });
  },
});

export const { clearProductsError } = productsSlice.actions;
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

export default productsSlice.reducer;
