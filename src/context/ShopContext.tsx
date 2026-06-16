import { createContext, useEffect, ReactNode } from 'react';
import { ShopContextType, Product } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addToCart as reduxAddToCart,
  removeFromCart as reduxRemoveFromCart,
  clearCart,
  selectTotalItems,
  selectSubtotal,
  selectCartItems,
  CartItemState,
} from '../store/slices/cartSlice';
import { fetchAllProducts, selectAllProducts } from '../store/slices/productsSlice';
import { selectAuthToken } from '../store/slices/authSlice';

export const ShopContext = createContext<ShopContextType | null>(null);

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider = (props: ShopContextProviderProps) => {
  const dispatch = useAppDispatch();
  const all_product = useAppSelector(selectAllProducts);
  const cartItemList = useAppSelector(selectCartItems);
  const totalItems = useAppSelector(selectTotalItems);
  const subtotal = useAppSelector(selectSubtotal);
  const token = useAppSelector(selectAuthToken);

  // Legacy cartItems format: { [productId]: quantity }
  const cartItems: { [key: number]: number } = {};
  cartItemList.forEach((item: CartItemState) => {
    cartItems[item.productId] = (cartItems[item.productId] || 0) + item.quantity;
  });

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const addToCartFn = (itemId: number): void => {
    const product = all_product.find((p: Product) => p.id === itemId);
    if (product) {
      const size = product.variants?.[0]?.size || 'M';
      const color = product.variants?.[0]?.color || 'Default';
      const price = product.salePrice ?? product.basePrice;
      dispatch(
        reduxAddToCart({
          productId: itemId,
          name: product.name,
          image: product.images?.[0] || '',
          size,
          color,
          price,
        })
      );
    }
  };

  const removeFromCartFn = (itemId: number): void => {
    dispatch(reduxRemoveFromCart({ productId: itemId, size: '', color: '' }));
  };

  const contextValue: ShopContextType = {
    all_product,
    cartItems,
    addToCart: addToCartFn,
    removeFromCart: removeFromCartFn,
    getTotalCartAmount: () => subtotal,
    getTotalCartItems: () => totalItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
