import { Package, ShoppingCart } from 'lucide-react';

interface DashboardAlertsProps {
  lowStockProducts: number;
  pendingOrdersCount: number;
}

export function DashboardAlerts({ lowStockProducts, pendingOrdersCount }: DashboardAlertsProps) {
  return (
    <div className="space-y-4">
      {lowStockProducts > 0 && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <Package className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Stock bajo</p>
            <p className="text-xs text-yellow-700">
              {lowStockProducts} producto{lowStockProducts > 1 ? 's' : ''} con menos de 10 unidades
            </p>
          </div>
        </div>
      )}

      {pendingOrdersCount > 0 && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <ShoppingCart className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Órdenes pendientes</p>
            <p className="text-xs text-blue-700">
              {pendingOrdersCount} orden
              {pendingOrdersCount > 1 ? 'es' : ''} esperando procesamiento
            </p>
          </div>
        </div>
      )}

      {lowStockProducts === 0 && pendingOrdersCount === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No hay alertas en este momento</p>
        </div>
      )}
    </div>
  );
}
