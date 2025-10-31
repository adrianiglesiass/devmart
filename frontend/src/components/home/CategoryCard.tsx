import { Link } from 'react-router-dom';

import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryCardProps {
  icon: React.ReactElement<any, any>;
  title: string;
  description: string;
  link: string;
  buttonText: string;
}

export function CategoryCard({ icon, title, description, link, buttonText }: CategoryCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden">
      <CardHeader className="p-8 pb-6">
        <div className="mb-4 h-12 w-12">
          {React.cloneElement(icon, {
            className: 'h-full w-full text-black',
            strokeWidth: 1.5,
          })}
        </div>
        <CardTitle className="text-2xl font-semibold text-gray-900 !mb-1 !mt-0">{title}</CardTitle>
        <CardDescription className="text-gray-600 text-base !mt-0">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <Link
          to={link}
          className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors group flex items-center interactive-link"
        >
          {buttonText}
          <span className="ml-1 transition-all group-hover:ml-2">&rarr;</span>
        </Link>
      </CardContent>
    </Card>
  );
}
