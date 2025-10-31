import { CheckCircle2, Info } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SimulationInfoProps {
  className?: string;
}

export function SimulationInfo({ className }: SimulationInfoProps) {
  return (
    <Card className={`border-amber-200 bg-amber-50 ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-amber-600" />
          Simulación de Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
            <p>Se creará un pedido de demostración en la base de datos</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
            <p>Verás una confirmación con los detalles del pedido simulado</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
            <p>No se requiere información de pago ni dirección real</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
