import {
  ArrowLeft,
  FolderTree,
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/api/hooks/useAuth';
import { useCategories } from '@/api/hooks/useCategories';
import { useOrders } from '@/api/hooks/useOrders';
import { useProducts } from '@/api/hooks/useProducts';
import { CategoriesManagement } from '@/components/admin/CategoriesManagement';
import { DashboardCard } from '@/components/admin/DashboardCard';
import { OrdersManagement } from '@/components/admin/OrdersManagement';
import { ProductsManagement } from '@/components/admin/ProductsManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: orders = [] } = useOrders();

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const lowStockProducts = products.filter((p) => (p.stock || 0) < 10).length;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-all transform hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </button>
        <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Bienvenido, {user?.username}. Gestiona productos, categorías y órdenes desde aquí.
        </p>
      </div>

      <Tabs
        defaultValue="dashboard"
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger
            value="dashboard"
            className="gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="gap-2"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Productos</span>
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="gap-2"
          >
            <FolderTree className="h-4 w-4" />
            <span className="hidden sm:inline">Categorías</span>
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Órdenes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="dashboard"
          className="space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Total Productos"
              value={products.length.toString()}
              description="Productos en el catálogo"
              icon={<Package className="h-4 w-4" />}
            />
            <DashboardCard
              title="Categorías"
              value={categories.length.toString()}
              description="Categorías activas"
              icon={<FolderTree className="h-4 w-4" />}
            />
            <DashboardCard
              title="Órdenes"
              value={orders.length.toString()}
              description="Órdenes totales"
              icon={<ShoppingCart className="h-4 w-4" />}
            />
            <DashboardCard
              title="Ingresos"
              value={`€${totalRevenue.toFixed(2)}`}
              description="Total facturado"
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">Resumen</h2>
              <p className="text-muted-foreground mb-4">
                Utiliza las pestañas superiores para gestionar diferentes aspectos de la tienda.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Package className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Productos:</strong> Crea, edita y elimina productos. Gestiona precios,
                    stock e imágenes.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <FolderTree className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Categorías:</strong> Organiza tus productos en categorías para facilitar
                    la navegación.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>Órdenes:</strong> Visualiza y gestiona el estado de las órdenes de los
                    clientes.
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">Alertas</h2>
              <div className="space-y-4">
                {lowStockProducts > 0 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <Package className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Stock bajo</p>
                      <p className="text-xs text-yellow-700">
                        {lowStockProducts} producto{lowStockProducts > 1 ? 's' : ''} con menos de 10
                        unidades
                      </p>
                    </div>
                  </div>
                )}

                {orders.filter((o) => o.status === 'pending').length > 0 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <ShoppingCart className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Órdenes pendientes</p>
                      <p className="text-xs text-blue-700">
                        {orders.filter((o) => o.status === 'pending').length} orden
                        {orders.filter((o) => o.status === 'pending').length > 1 ? 'es' : ''}{' '}
                        esperando procesamiento
                      </p>
                    </div>
                  </div>
                )}

                {lowStockProducts === 0 &&
                  orders.filter((o) => o.status === 'pending').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No hay alertas en este momento</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <ProductsManagement />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesManagement />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
