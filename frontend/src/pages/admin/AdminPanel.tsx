import {
  ArrowLeft,
  FolderTree,
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useMemo } from 'react';

import { useAuth } from '@/api/hooks/useAuth';
import { useCategories } from '@/api/hooks/useCategories';
import { useOrders } from '@/api/hooks/useOrders';
import { useProducts } from '@/api/hooks/useProducts';
import { CategoriesManagement } from '@/components/admin/CategoriesManagement';
import { DashboardAlerts } from '@/components/admin/DashboardAlerts';
import { DashboardCard } from '@/components/admin/DashboardCard';
import { DashboardSummary } from '@/components/admin/DashboardSummary';
import { OrdersManagement } from '@/components/admin/OrdersManagement';
import { ProductsManagement } from '@/components/admin/ProductsManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: orders = [] } = useOrders();

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + (order.total || 0), 0),
    [orders],
  );
  const lowStockProducts = useMemo(
    () => products.filter((p) => (p.stock || 0) < 10).length,
    [products],
  );
  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'pending').length,
    [orders],
  );

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
            <DashboardSummary />

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">Alertas</h2>
              <DashboardAlerts
                lowStockProducts={lowStockProducts}
                pendingOrdersCount={pendingOrdersCount}
              />
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
