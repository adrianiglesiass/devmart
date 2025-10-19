import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryCardProps {
  title: string;
  description: string;
  link: string;
  buttonText: string;
}

export function CategoryCard({ title, description, link, buttonText }: CategoryCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link to={link}>
          <Button
            variant="outline"
            className="w-full"
          >
            {buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
