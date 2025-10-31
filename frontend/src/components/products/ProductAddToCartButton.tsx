import { ShoppingCart } from 'lucide-react';

import { Flex } from '@/components/common/Flex';
import { Button } from '@/components/ui/button';

interface ProductAddToCartButtonProps {
  stock?: number;
  onClick: () => void;
}

export function ProductAddToCartButton({ stock, onClick }: ProductAddToCartButtonProps) {
  const isEnabled = !!stock;

  const buttonStyles = isEnabled
    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
    : 'bg-gray-300 text-gray-500 cursor-not-allowed';

  return (
    <Flex className="w-full mb-8">
      <Button
        size="lg"
        className={`w-full py-4 lg:py-6 text-base lg:text-lg font-semibold rounded-lg transition-all interactive-action ${buttonStyles}`}
        onClick={onClick}
        disabled={!isEnabled}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {isEnabled ? 'Añadir al carrito' : 'Producto agotado'}
      </Button>
    </Flex>
  );
}
