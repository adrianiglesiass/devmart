import { LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Cart } from '@/components/cart/Cart';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-3xl font-bold text-indigo-600 hover:text-indigo-700"
        >
          DevMart
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
          >
            Inicio
          </Link>
          <Link
            to="/products"
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
          >
            Productos
          </Link>
          <Link
            to="/categories"
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
          >
            Categorías
          </Link>
        </div>

        {/* Menu */}
        <div className="flex items-center space-x-5">
          <Cart />
          {isLoading ? (
            <LoaderCircle className="h-7 w-7 animate-spin text-indigo-600" />
          ) : isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    🔧 Admin Panel
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:inline">{user?.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="cursor-pointer"
                    >
                      👤 Mi perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/orders"
                      className="cursor-pointer"
                    >
                      📦 Mis pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 cursor-pointer"
                  >
                    🚪 Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/login">
              <Button className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105">
                Iniciar sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
