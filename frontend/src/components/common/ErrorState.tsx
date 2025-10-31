import { AlertCircle } from 'lucide-react';

import { Flex } from '@/components/common/Flex';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  minHeight?: string;
}

export function ErrorState({
  message = 'Algo salió mal',
  actionLabel = 'Reintentar',
  onAction,
  minHeight = 'min-h-[500px]',
}: ErrorStateProps) {
  return (
    <Flex className={`flex-col justify-center items-center ${minHeight}`}>
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <p className="text-gray-600 mb-6">{message}</p>
        {onAction && (
          <Button
            onClick={onAction}
            variant="outline"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Flex>
  );
}
