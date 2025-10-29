import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900">
          Bienvenido a{' '}
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            DevMart
          </span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          Tu tienda online de productos tecnológicos. Encuentra los mejores gadgets y accesorios.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products">
            <Button
              className="bg-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1 h-auto w-full sm:w-auto"
              size="lg"
            >
              Explorar Productos
            </Button>
          </Link>
          <Link to="/categories">
            <Button
              size="lg"
              variant="outline"
              className="bg-gray-200 text-gray-800 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-300 transition-all transform hover:-translate-y-1 h-auto border-0 w-full sm:w-auto"
            >
              Ver Categorías
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
