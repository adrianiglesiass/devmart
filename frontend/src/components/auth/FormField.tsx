import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { useAuthForm } from '@/context/AuthFormContext';

import { FormFieldError } from './FormFieldError';

interface FormFieldProps {
  id: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'email' | 'password';
  autoComplete?: string;
}

export function FormField({ id, label, placeholder, type = 'text', autoComplete }: FormFieldProps) {
  const { register, errors } = useAuthForm();
  const InputComponent = type === 'password' ? PasswordInput : Input;
  const error = errors[id]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <InputComponent
        id={id}
        type={type === 'password' ? undefined : type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register(id)}
      />
      <FormFieldError message={error} />
    </div>
  );
}
