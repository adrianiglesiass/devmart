import { toast } from 'sonner';

import type { Product } from '@/api/types/types';
import { useCart } from '@/context/CartContext';

export function useAddToCart() {
  const { addItem } = useCart();

  const addToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} añadido al carrito`);
  };

  return addToCart;
}
