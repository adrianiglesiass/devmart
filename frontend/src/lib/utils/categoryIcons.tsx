import {
  Cpu,
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  Mouse,
  Smartphone,
} from 'lucide-react';
import React from 'react';

// Mapeo de iconos para las categorías por slug
export const categoryIcons: Record<string, React.ReactElement> = {
  laptops: <Laptop />,
  smartphones: <Smartphone />,
  componentes: <Cpu />,
  monitores: <Monitor />,
  accesorios: <Headphones />,
  perifericos: <Keyboard />,
  // Fallback para categorías sin icono específico
  default: <Mouse />,
};

/**
 * Obtiene el icono correspondiente para una categoría
 * @param slug - El slug de la categoría
 * @returns El elemento React del icono
 */
export const getCategoryIcon = (slug: string | undefined): React.ReactElement => {
  if (!slug) return categoryIcons.default;
  return categoryIcons[slug] || categoryIcons.default;
};
