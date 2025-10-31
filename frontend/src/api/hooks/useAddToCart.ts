import { toast } from 'sonner';

import type { Product } from '@/api/types/types';
import { useCart } from '@/context/CartContext';

export function useAddToCart() {
  const { addItem } = useCart();

  const addToCart = (product: Product) => {
    const added = addItem(product);
    if (added) {
      toast.dismiss();
      toast.success(`${product.name} añadido al carrito`);
    }
  };

  return addToCart;
}
