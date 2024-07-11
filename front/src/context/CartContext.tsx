import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

type CartContextType = {
  cart: {[productId: number]: number};
  updateCart: (productId: number, quantity: number) => void;
};

const CART_STORAGE_KEY = "cart_data";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [cart, setCart] = useState<{[productId: number]: number}>(() => {
    const storedCart = sessionStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : {};
  });

  const updateCart = (productId: number, quantity: number) => {
    setCart(prevCart => {
      const newCart = {...prevCart};
      if (quantity === 0) {
        delete newCart[productId];
      } else {
        newCart[productId] = quantity;
      }
      return newCart;
    });
  };

  useEffect(() => {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{cart, updateCart}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
