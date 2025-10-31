import { CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Flex } from '@/components/common/Flex';
import { Button } from '@/components/ui/button';

interface CheckoutActionsProps {
  isLoading: boolean;
  isEmpty: boolean;
  onConfirm: () => void;
}

const BUTTON_SIZES = 'lg';
const BUTTON_CLASS = 'flex-1';

const PROCESSING_TEXT = 'Procesando...';
const CONFIRM_TEXT = 'Confirmar Pedido (Demo)';
const CANCEL_TEXT = 'Cancelar';

export function CheckoutActions({ isLoading, isEmpty, onConfirm }: CheckoutActionsProps) {
  const isDisabled = isLoading || isEmpty;

  const confirmButtonContent = isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {PROCESSING_TEXT}
    </>
  ) : (
    <>
      <CheckCircle2 className="mr-2 h-4 w-4" />
      {CONFIRM_TEXT}
    </>
  );
  return (
    <Flex className="flex-col sm:flex-row gap-4">
      <Button
        variant="outline"
        size={BUTTON_SIZES}
        className={BUTTON_CLASS}
        asChild
      >
        <Link to="/products">{CANCEL_TEXT}</Link>
      </Button>
      <Button
        size={BUTTON_SIZES}
        className={`${BUTTON_CLASS} interactive-action`}
        onClick={onConfirm}
        disabled={isDisabled}
      >
        {confirmButtonContent}
      </Button>
    </Flex>
  );
}
