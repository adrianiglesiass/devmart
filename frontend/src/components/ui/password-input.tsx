import { Eye, EyeOff } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function clsx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string;
};

export function PasswordInput({ className, containerClassName, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={clsx('relative', containerClassName)}>
      <Input
        type={visible ? 'text' : 'password'}
        className={className}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}
