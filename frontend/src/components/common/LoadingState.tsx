import { Flex } from '@/components/common/Flex';

interface LoadingStateProps {
  message?: string;
  minHeight?: string;
}

export function LoadingState({
  message = 'Cargando...',
  minHeight = 'min-h-[500px]',
}: LoadingStateProps) {
  return (
    <Flex className={`justify-center items-center ${minHeight}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </Flex>
  );
}
