// Cart state provider (Member 2).
// Stores only { productId, size, color, quantity } per line. Prices are looked up when the cart is shown.
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

// Two cart lines are the same when product, size and colour all match.
function isSameLine(a, b) {
  return a.productId === b.productId && a.size === b.size && a.color === b.color;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const addItem = ({ productId, size, color, quantity = 1 }) =>
      setItems((prev) => {
        const newLine = { productId, size, color, quantity };
        const existing = prev.find((item) => isSameLine(item, newLine));
        if (existing) {
          return prev.map((item) =>
            item === existing ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, newLine];
      });

    const updateQuantity = (line, quantity) =>
      setItems((prev) =>
        prev.map((item) => (isSameLine(item, line) ? { ...item, quantity } : item))
      );

    const removeItem = (line) =>
      setItems((prev) => prev.filter((item) => !isSameLine(item, line)));

    return {
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
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