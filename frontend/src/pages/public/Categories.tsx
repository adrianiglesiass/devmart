import { Link } from 'react-router-dom';

import React from 'react';

import { useCategories } from '@/api/hooks/useCategories';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategoryIcon } from '@/lib/utils/categoryIcons';

export default function Categories() {
  const { data: categories, isLoading, error } = useCategories();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todas las Categorías</h1>
          <p className="text-gray-600 text-lg">
            Explora nuestras categorías y encuentra lo que buscas
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600">Cargando categorías...</p>
        ) : error ? (
          <p className="text-center text-red-600">Error al cargar las categorías</p>
        ) : !categories || categories.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">No hay categorías disponibles</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const icon = getCategoryIcon(category.slug);

              return (
                <Link
                  key={category.id}
                  to={`/categories/${category.slug}`}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="h-12 w-12 mb-4 text-indigo-600 group-hover:text-indigo-700">
                          {React.cloneElement(icon, {
                            className: 'h-full w-full',
                            strokeWidth: 1.5,
                          } as any)}
                        </div>
                        <Badge variant="secondary">
                          {category.product_count === 1
                            ? '1 producto'
                            : `${category.product_count} productos`}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl group-hover:text-indigo-600 transition-colors">
                        {category.name}
                      </CardTitle>
                      {category.description && (
                        <CardDescription className="text-base">
                          {category.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <span className="text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors flex items-center">
                        Ver productos
                        <span className="ml-1 transition-all group-hover:ml-2">&rarr;</span>
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
