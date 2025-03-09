
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchCartItems, fetchWishlistItems, getCartItemCount, getWishlistItemCount } from './services';

interface CartContextType {
  cartCount: number;
  wishlistCount: number;
  updateCounts: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateCounts = async () => {
    const cartItems = await getCartItemCount();
    setCartCount(cartItems);
    
    const wishlistItems = await getWishlistItemCount();
    setWishlistCount(wishlistItems);
  };

  useEffect(() => {
    updateCounts();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, wishlistCount, updateCounts }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
