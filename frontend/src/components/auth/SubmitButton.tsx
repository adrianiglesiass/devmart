import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  text: string;
  loadingText: string;
  isLoading: boolean;
  className?: string;
}

export function SubmitButton({ text, loadingText, isLoading, className = '' }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={`w-full interactive-action ${className}`}
      disabled={isLoading}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? loadingText : text}
    </Button>
  );
}
