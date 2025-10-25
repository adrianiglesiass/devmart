import { Info } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './alert';

interface DemoBannerProps {
  className?: string;
  title?: string;
  description?: string;
}

export function DemoBanner({
  className,
  title = 'Proyecto de Demostración',
  description = 'Este es un proyecto educativo. No se procesarán pagos reales ni se enviarán productos. El pedido es completamente simulado con fines de práctica.',
}: DemoBannerProps) {
  return (
    <Alert className={`border-blue-200 bg-blue-50 ${className || ''}`}>
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">{title}</AlertTitle>
      <AlertDescription className="text-blue-700">{description}</AlertDescription>
    </Alert>
  );
}
