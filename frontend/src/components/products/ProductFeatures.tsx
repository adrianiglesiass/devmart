import { Package, Shield, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Flex } from '@/components/common/Flex';
import { Card, CardContent } from '@/components/ui/card';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Truck,
    title: 'Envío rápido',
    description: 'Entrega en 2-3 días hábiles',
  },
  {
    icon: Shield,
    title: 'Garantía de 2 años',
    description: 'Protección completa del fabricante',
  },
  {
    icon: Package,
    title: 'Devoluciones gratis',
    description: '30 días para cambios y devoluciones',
  },
];

interface FeatureItemProps {
  feature: Feature;
}

function FeatureItem({ feature }: FeatureItemProps) {
  const IconComponent = feature.icon;

  return (
    <Card className="border-2 hover:border-indigo-200 transition-colors">
      <CardContent className="p-4">
        <Flex className="gap-4 items-start">
          {/* Icon Container */}
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-indigo-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        </Flex>
      </CardContent>
    </Card>
  );
}

export function ProductFeatures() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {FEATURES.map((feature, index) => (
        <FeatureItem
          key={index}
          feature={feature}
        />
      ))}
    </div>
  );
}
