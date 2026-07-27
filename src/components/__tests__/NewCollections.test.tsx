import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import NewCollections from '../NewCollections';
import { fetchNewCollections } from '../../store/slices/productsSlice';

const mockStore = configureStore([thunk]);

const mockNewCollections = [
  {
    id: 1,
    name: "New Collection Product 1",
    image: "https://example.com/image1.jpg",
    basePrice: 50.0,
    salePrice: 40.0,
    tags: ["new"],
    category: "women",
    variants: [],
    rating: 4.5,
    reviewsCount: 122,
    description: "New collection product description",
    images: ["https://example.com/image1.jpg"],
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "New Collection Product 2",
    image: "https://example.com/image2.jpg",
    basePrice: 75.0,
    salePrice: 60.0,
    tags: ["sale"],
    category: "women",
    variants: [],
    rating: 4.0,
    reviewsCount: 88,
    description: "Another new collection product",
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

describe('NewCollections Component', () => {
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
        <NewCollections />
      </Provider>
    );

    expect(screen.getByText('Loading new collections...')).toBeInTheDocument();
  });

  test('renders error state when fetch fails', () => {
    const errorState = {
      ...initialState,
      products: {
        ...initialState.products,
        error: 'Failed to fetch new collections',
      },
    };
    store = mockStore(errorState);

    const mockOnError = jest.fn();

    render(
      <Provider store={store}>
        <NewCollections onError={mockOnError} />
      </Provider>
    );

    expect(screen.getByText('Failed to fetch new collections')).toBeInTheDocument();
    expect(mockOnError).toHaveBeenCalledWith('Failed to fetch new collections');
  });

  test('renders product list when data is available', async () => {
    const populatedState = {
      ...initialState,
      products: {
        ...initialState.products,
        newCollections: mockNewCollections,
      },
    };
    store = mockStore(populatedState);

    render(
      <Provider store={store}>
        <NewCollections />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('New Collection Product 1')).toBeInTheDocument();
      expect(screen.getByText('New Collection Product 2')).toBeInTheDocument();
    });

    expect(screen.getByText('$40.00')).toBeInTheDocument();
    expect(screen.getByText('$60.00')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
    expect(screen.getByText('SALE')).toBeInTheDocument();
  });

  test('dispatches fetchNewCollections action on mount', () => {
    render(
      <Provider store={store}>
        <NewCollections />
      </Provider>
    );

    expect(mockDispatch).toHaveBeenCalledWith(fetchNewCollections());
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
        <NewCollections onError={mockOnError} />
      </Provider>
    );

    expect(mockOnError).toHaveBeenCalledWith('Network error');
  });

  test('does not call onError when error is cleared', () => {
    const populatedState = {
      ...initialState,
      products: {
        ...initialState.products,
        newCollections: mockNewCollections,
      },
    };
    store = mockStore(populatedState);

    const mockOnError = jest.fn();

    render(
      <Provider store={store}>
        <NewCollections onError={mockOnError} />
      </Provider>
    );

    expect(mockOnError).not.toHaveBeenCalled();
  });

  test('component unmounts without errors', () => {
    const populatedState = {
      ...initialState,
      products: {
        ...initialState.products,
        newCollections: mockNewCollections,
      },
    };
    store = mockStore(populatedState);

    const { unmount } = render(
      <Provider store={store}>
        <NewCollections />
      </Provider>
    );

    unmount();

    expect(() => unmount()).not.toThrow();
  });

  test('renders fallback UI when data is empty', () => {
    const emptyState = {
      ...initialState,
      products: {
        ...initialState.products,
        newCollections: [],
        loading: false,
      },
    };
    store = mockStore(emptyState);

    render(
      <Provider store={store}>
        <NewCollections />
      </Provider>
    );

    expect(screen.getByText('New Collections')).toBeInTheDocument();
    expect(screen.queryByText('$')).not.toBeInTheDocument();
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });
});