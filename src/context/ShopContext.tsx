import { createContext, useEffect, ReactNode } from 'react';
import { ShopContextType } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addToCart as reduxAddToCart,
  removeFromCart as reduxRemoveFromCart,
  setCart,
  selectCartItems,
  selectTotalAmount,
  selectTotalItems,
} from '../store/slices/cartSlice';
import { fetchAllProducts, selectAllProducts } from '../store/slices/productsSlice';
import { selectAuthToken } from '../store/slices/authSlice';

const url = 'http://localhost:4000';

export const ShopContext = createContext<ShopContextType | null>(null);

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider = (props: ShopContextProviderProps) => {
  const dispatch = useAppDispatch();
  const all_product = useAppSelector(selectAllProducts);
  const cartItems = useAppSelector(selectCartItems);
  const totalAmount = useAppSelector(selectTotalAmount);
  const totalItems = useAppSelector(selectTotalItems);
  const token = useAppSelector(selectAuthToken);

  useEffect(() => {
    dispatch(fetchAllProducts());

    if (token) {
      fetch(`${url}/getcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': token,
          'Content-Type': 'application/json',
        },
        body: '',
      })
        .then((response: Response) => response.json())
        .then((data) => dispatch(setCart(data)));
    }
  }, [dispatch, token]);

  const addToCart = (itemId: number): void => {
    dispatch(reduxAddToCart(itemId));
    if (token) {
      fetch(`${url}/addtocart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response: Response) => response.json())
        .then((data: unknown) => console.log(data));
    }
  };

  const removeFromCart = (itemId: number): void => {
    dispatch(reduxRemoveFromCart(itemId));
    if (token) {
      fetch(`${url}/removefromcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response: Response) => response.json())
        .then((data: unknown) => console.log(data));
    }
  };

  const getTotalCartAmount = (): number => totalAmount;
  const getTotalCartItems = (): number => totalItems;

  const contextValue: ShopContextType = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
