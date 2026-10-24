// Cart state provider.
// Minimal version so shop pages can add items and the header can show a count.
// Member 2 owns this file and will connect it to the cart API.
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "ha-cart";

function readStoredCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const addItem = ({ productId, size, color, quantity = 1 }) =>
      setItems((prev) => {
        const existing = prev.find(
          (item) => item.productId === productId && item.size === size && item.color === color
        );
        if (existing) {
          return prev.map((item) =>
            item === existing ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, { productId, size, color, quantity }];
      });

    return {
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem,
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
