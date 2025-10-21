import { CategoryCard } from '@/components/home/CategoryCard';
import { HeroSection } from '@/components/home/HeroSection';
import { Layout } from '@/components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <HeroSection />

      {/* Categories */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Categorías Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard
            title="Electrónica"
            description="Últimos gadgets y tecnología de punta"
            link="/categories/electronics"
            buttonText="Ver productos"
          />

          <CategoryCard
            title="Ordenadores"
            description="Laptops,PCs"
            link="/categories/computers"
            buttonText="Ver productos"
          />

          <CategoryCard
            title="Accesorios"
            description="Todo lo que necesitas para tu setup"
            link="/categories/accessories"
            buttonText="Ver productos"
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Novedades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-4">Imagen 1</div>
            <h3 className="font-bold mb-2">Titulo</h3>
            <p className="text-gray-600">Descripcion</p>
          </div>
          <div>
            <div className=" mt-1  text-4xl mb-4">Imagen 2</div>
            <h3 className="font-bold mb-2">Titulo</h3>
            <p className="text-gray-600">Descripcion</p>
          </div>
          <div>
            <div className="text-4xl mb-4">Imagen 3</div>
            <h3 className="font-bold mb-2">Titulo</h3>
            <p className="text-gray-600">Descripcion</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
