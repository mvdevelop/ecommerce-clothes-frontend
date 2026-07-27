"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query/devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache duration: 5 minutes (matching our Redux cache)
      staleTime: 5 * 60 * 1000,
      // Cache persistence: false (not needed for this demo)
      cacheTime: 10 * 60 * 1000,
      // Refetch on window focus: false (avoid unnecessary requests)
      refetchOnWindowFocus: false,
      // Retry failed requests: 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Error handling
      onError: (error) => {
        console.error('Query error:', error);
        // Global error logging
        if (process.env.NODE_ENV === 'production') {
          // In production, you might log errors to an external service
          // console.error('Query error logged:', error);
        }
      },
      // Loading states
      onSettled: () => {
        // Called after success or error
        console.log('Query settled');
      },
    },
    mutations: {
      // Retry failed mutations: 2 times
      retry: 2,
      // Network mode: offline-first
      networkMode: 'offline-first',
    },
  },
});

export { queryClient };

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default QueryProvider;

// Query keys for consistent cache management
export const queryKeys = {
  allProducts: ['products'] as const,
  productsByCategory: (category: string) => ['products', 'category', category] as const,
  popularProducts: ['products', 'popular'] as const,
  newCollections: ['products', 'new-collections'] as const,
  productDetail: (id: number) => ['products', 'detail', id] as const,
  cart: ['cart'] as const,
  orders: ['orders'] as const,
  authUser: ['auth', 'user'] as const,
  coupons: ['coupons'] as const,
  shipping: ['shipping'] as const,
} as const;

// Helper types for TypeScript strict typing
export type QueryKeys = typeof queryKeys;
export type QueryKey = QueryKeys[keyof QueryKeys];