import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'uc_cart_items_v1';

const getInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.findIndex(i => i.packageId === action.payload.packageId);
      if (existingIndex > -1) {
        return state.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.packageId !== action.payload);

    case 'UPDATE_QUANTITY': {
      const { packageId, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter(i => i.packageId !== packageId);
      }
      return state.map(i =>
        i.packageId === packageId ? { ...i, quantity } : i
      );
    }
    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], getInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (packageId) => dispatch({ type: 'REMOVE_ITEM', payload: packageId });
  const updateQuantity = (packageId, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { packageId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const originalTotal = items.reduce(
    (sum, i) => sum + (i.originalPrice || i.price) * i.quantity,
    0
  );
  const savings = Math.max(0, originalTotal - subtotal);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        originalTotal,
        savings,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
