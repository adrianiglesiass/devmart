import { LoaderCircle, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useState } from 'react';

import { useAuth } from '@/api/hooks/useAuth';
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

const navigationLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/products', label: 'Productos' },
  { to: '/categories', label: 'Categorías' },
] as const;

const authenticatedLinks = [
  { to: '/admin', label: 'Admin Panel', icon: '🔧', adminOnly: true },
  { to: '/profile', label: 'Mi perfil', icon: '👤', adminOnly: false },
  { to: '/orders', label: 'Mis pedidos', icon: '📦', adminOnly: false },
] as const;

export function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-3xl font-bold text-indigo-600 hover:text-indigo-700"
          onClick={closeMobileMenu}
        >
          DevMart
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Menu */}
        <div className="flex items-center space-x-3">
          <Cart />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Auth Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoading ? (
              <LoaderCircle className="h-7 w-7 animate-spin text-indigo-600" />
            ) : isAuthenticated ? (
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
                  {authenticatedLinks
                    .filter((link) => !link.adminOnly || user?.role === 'admin')
                    .map((link) => (
                      <DropdownMenuItem
                        key={link.to}
                        asChild
                      >
                        <Link
                          to={link.to}
                          className="interactive-link"
                        >
                          {link.icon} {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 interactive-link"
                  >
                    🚪 Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105 interactive-link">
                  Iniciar sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-6 py-4 space-y-3">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {authenticatedLinks
                  .filter((link) => !link.adminOnly || user?.role === 'admin')
                  .map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block py-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {link.icon} {link.label}
                    </Link>
                  ))}
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  🚪 Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
              >
                <Button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium shadow-md hover:bg-indigo-700">
                  Iniciar sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
