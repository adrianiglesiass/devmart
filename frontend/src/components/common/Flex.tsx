import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex', className)}
      {...props}
    >
      {children}
    </div>
  ),
);

Flex.displayName = 'Flex';
