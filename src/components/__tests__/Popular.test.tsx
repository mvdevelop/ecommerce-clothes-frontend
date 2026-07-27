import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import Popular from '../Popular';
import { fetchPopularProducts } from '../../store/slices/productsSlice';

const mockStore = configureStore([thunk]);

const mockPopularProducts = [
  {
    id: 1,
    name: "Test Product 1",
    image: "https://example.com/image1.jpg",
    basePrice: 50.0,
    salePrice: 40.0,
    tags: ["sale"],
    category: "women",
    variants: [],
    rating: 4.5,
    reviewsCount: 122,
    description: "Test product description",
    images: ["https://example.com/image1.jpg"],
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Test Product 2",
    image: "https://example.com/image2.jpg",
    basePrice: 75.0,
    salePrice: 60.0,
    tags: ["new"],
    category: "women",
    variants: [],
    rating: 4.0,
    reviewsCount: 88,
    description: "Another test product",
    images: ["https://example.com/image2.jpg"],
    createdAt: "2024-02-10",
  },
];

const initialState = {
  products: {
    allProducts: [],
    popular: [],
    newCollections: [],
    loading: false,
    error: null,
    lastFetch: { allProducts: 0, popular: 0, newCollections: 0 },
  },
  auth: {
    token: null,
    user: null,
    loading: false,
    error: null,
    csrfToken: null,
  },
};

describe('Popular Component', () => {
  let store;
  let mockDispatch;

  beforeEach(() => {
    store = mockStore(initialState);
    mockDispatch = store.dispatch;
  });

  afterEach(() => {
    store.clearActions();
  });

  test('renders loading state when data is being fetched', () => {
    const loadingState = {
      ...initialState,
      products: {
        ...initialState.products,
        loading: true,
      },
    };
    store = mockStore(loadingState);

    render(
      <Provider store={store}>
        <Popular />
      </Provider>
    );

    expect(screen.getByText('Loading popular products...')).toBeInTheDocument();
  });

  test('renders error state when fetch fails', () => {
    const errorState = {
      ...initialState,
      products: {
        ...initialState.products,
        error: 'Failed to fetch popular products',
      },
    };
    store = mockStore(errorState);

    const mockOnError = jest.fn();

    render(
      <Provider store={store}>
        <Popular onError={mockOnError} />
      </Provider>
    );

    expect(screen.getByText('Failed to fetch popular products')).toBeInTheDocument();
    expect(mockOnError).toHaveBeenCalledWith('Failed to fetch popular products');
  });

  test('renders product list when data is available', async () => {
    const populatedState = {
      ...initialState,
      products: {
        ...initialState.products,
        popular: mockPopularProducts,
      },
    };
    store = mockStore(populatedState);

    render(
      <Provider store={store}>
        <Popular />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    expect(screen.getByText('$40.00')).toBeInTheDocument();
    expect(screen.getByText('$60.00')).toBeInTheDocument();
    expect(screen.getByText('SALE')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  test('dispatches fetchPopularProducts action on mount', () => {
    render(
      <Provider store={store}>
        <Popular />
      </Provider>
    );

    expect(mockDispatch).toHaveBeenCalledWith(fetchPopularProducts());
  });

  test('calls onError callback when error occurs', () => {
    const errorState = {
      ...initialState,
      products: {
        ...initialState.products,
        error: 'Network error',
      },
    };
    store = mockStore(errorState);

    const mockOnError = jest.fn();

    render(
      <Provider store={store}>
        <Popular onError={mockOnError} />
      </Provider>
    );

    expect(mockOnError).toHaveBeenCalledWith('Network error');
  });

  test('does not call onError when error is cleared', () => {
    const populatedState = {
      ...initialState,
      products: {
        ...initialState.products,
        popular: mockPopularProducts,
      },
    };
    store = mockStore(populatedState);

    const mockOnError = jest.fn();

    render(
      <Provider store={store}>
        <Popular onError={mockOnError} />
      </Provider>
    );

    expect(mockOnError).not.toHaveBeenCalled();
  });

  test('component unmounts without errors', () => {
    const populatedState = {
      ...initialState,
      products: {
        ...initialState.products,
        popular: mockPopularProducts,
      },
    };
    store = mockStore(populatedState);

    const { unmount } = render(
      <Provider store={store}>
        <Popular />
      </Provider>
    );

    unmount();

    expect(() => unmount()).not.toThrow();
  });
});