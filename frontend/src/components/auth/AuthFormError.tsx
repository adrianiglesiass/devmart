import { AlertCircle } from 'lucide-react';

import { Flex } from '@/components/common/Flex';

interface AuthFormErrorProps {
  message: string;
}

export function AuthFormError({ message }: AuthFormErrorProps) {
  if (!message) return null;

  return (
    <Flex className="items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 leading-relaxed">{message}</p>
    </Flex>
  );
}
