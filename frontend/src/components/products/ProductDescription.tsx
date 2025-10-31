import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductDescriptionProps {
  description?: string;
}

const DEFAULT_DESCRIPTION = 'Sin descripción disponible.';

export function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Descripción</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-base leading-relaxed">
          {description || DEFAULT_DESCRIPTION}
        </p>
      </CardContent>
    </Card>
  );
}
