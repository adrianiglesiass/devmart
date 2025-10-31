import { ShoppingBag } from 'lucide-react';

import { Flex } from '@/components/common/Flex';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthCardProps {
  description: string;
  children: React.ReactNode;
}

const LOGO_TEXT = 'DevMart';

export function AuthCard({ description, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center space-y-4">
        <Flex className="justify-center">
          <div className="bg-blue-600 p-3 rounded-full">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
        </Flex>
        <CardTitle className="text-3xl font-bold">{LOGO_TEXT}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
