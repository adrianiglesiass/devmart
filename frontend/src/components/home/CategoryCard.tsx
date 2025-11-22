import { Link } from 'react-router-dom';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryCardProps {
  icon: React.ReactElement<any, any>;
  title: string;
  description?: string;
  link: string;
  buttonText: string;
  badgeText?: string;
}

export function CategoryCard({
  icon,
  title,
  description,
  link,
  buttonText,
  badgeText,
}: CategoryCardProps) {
  return (
    <Link
      to={link}
      className="block interactive-link group"
    >
      <Card className="h-full bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 overflow-hidden cursor-pointer">
        <CardHeader className="p-8 pb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="h-12 w-12 text-gray-900 group-hover:text-indigo-700">
              {React.cloneElement(icon, {
                className: 'h-full w-full',
                strokeWidth: 1.5,
              })}
            </div>
            {badgeText && <Badge variant="secondary">{badgeText}</Badge>}
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900 !mb-1 !mt-0 group-hover:text-indigo-700 transition-colors">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-gray-600 text-base !mt-0">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <span className="text-indigo-600 font-semibold group-hover:text-indigo-800 transition-colors flex items-center">
            {buttonText}
            <span className="ml-1 transition-all group-hover:ml-2">&rarr;</span>
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
