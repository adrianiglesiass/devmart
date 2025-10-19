import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="text-center py-16">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Bienvenido a DevMart
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Tu tienda online de productos tecnológicos. Encuentra los mejores gadgets y accesorios.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/products">
          <Button
            className="bg-black"
            size="lg"
          >
            Explorar Productos
          </Button>
        </Link>
        <Link to="/categories">
          <Button
            size="lg"
            variant="outline"
          >
            Ver Categorías
          </Button>
        </Link>
      </div>
    </section>
  );
}
