import { FolderTree, Package, ShoppingCart } from 'lucide-react';

export function DashboardSummary() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-xl font-semibold mb-4">Resumen</h2>
      <p className="text-muted-foreground mb-4">
        Utiliza las pestañas superiores para gestionar diferentes aspectos de la tienda.
      </p>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <Package className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <strong>Productos:</strong> Crea, edita y elimina productos. Gestiona precios, stock e
            imágenes.
          </div>
        </li>
        <li className="flex items-start gap-2">
          <FolderTree className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <strong>Categorías:</strong> Organiza tus productos en categorías para facilitar la
            navegación.
          </div>
        </li>
        <li className="flex items-start gap-2">
          <ShoppingCart className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <strong>Órdenes:</strong> Visualiza y gestiona el estado de las órdenes de los clientes.
          </div>
        </li>
      </ul>
    </div>
  );
}
