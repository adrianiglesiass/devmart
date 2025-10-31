interface FormFieldErrorProps {
  message?: string;
}

export function FormFieldError({ message }: FormFieldErrorProps) {
  if (!message) return null;

  return <p className="text-sm text-red-600">{message}</p>;
}
