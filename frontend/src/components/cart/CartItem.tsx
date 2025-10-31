import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Product } from '@/api/types/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: Product & { quantity: number };
  onClose?: () => void;
}

export function CartItem({ item, onClose }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 border-b pb-4">
      <img
        src={item.image_url || 'https://via.placeholder.com/100'}
        alt={item.name}
        className="w-20 h-20 object-cover rounded"
      />

      <div className="flex-1">
        <Link
          to={`/products/${item.id}`}
          className="font-medium text-sm hover:text-blue-600 transition-colors"
          onClick={onClose}
        >
          {item.name}
        </Link>
        <p className="text-sm text-gray-500 mb-2">€{item.price?.toFixed(2)}</p>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id!, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>

          <span className="w-8 text-center font-medium">{item.quantity}</span>

          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id!, item.quantity + 1)}
            disabled={item.quantity >= (item.stock || 0)}
          >
            <Plus className="h-3 w-3" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => removeItem(item.id!)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-sm">€{((item.price || 0) * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
}
