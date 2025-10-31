import { Package } from 'lucide-react';

import { Card } from '@/components/ui/card';

interface ProductImageProps {
  imageUrl?: string;
  name?: string;
}

export function ProductImage({ imageUrl, name }: ProductImageProps) {
  const renderImage = (
    <img
      src={imageUrl}
      alt={name}
      className="w-full h-auto aspect-square object-contain bg-gray-50"
      onError={(e) =>
        (e.currentTarget.src = 'https://placehold.co/800x800/e5e7eb/6b7280?text=Sin+Imagen')
      }
    />
  );

  const renderPlaceholder = (
    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
      <Package className="w-24 h-24 text-gray-300" />
    </div>
  );

  const render = imageUrl ? renderImage : renderPlaceholder;

  return <Card className="overflow-hidden">{render}</Card>;
}
