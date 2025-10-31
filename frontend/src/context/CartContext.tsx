import { toast } from 'sonner';

import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { Product } from '@/api/types/types';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => boolean;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('devmart-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('devmart-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product) => {
    let added = false;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      const newQuantity = existing ? existing.quantity + 1 : 1;
      if (newQuantity > (product.stock || 0)) {
        toast.dismiss();
        toast.error(`No hay suficiente stock disponible. Stock disponible: ${product.stock}`);
        return prev;
      }

      added = true;
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
    return added;
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => {
      const item = prev.find((item) => item.id === productId);
      if (!item) return prev;

      if (quantity > (item.stock || 0)) {
        toast.dismiss();
        toast.error(`No hay suficiente stock disponible. Stock disponible: ${item.stock}`);
        return prev;
      }

      return prev.map((item) => (item.id === productId ? { ...item, quantity } : item));
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}
