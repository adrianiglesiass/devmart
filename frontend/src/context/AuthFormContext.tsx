import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface AuthFormContextType {
  loading: boolean;
  errorMessage: string;
  register: (fieldName: string) => any;
  errors: Record<string, { message?: string }>;
}

const AuthFormContext = createContext<AuthFormContextType | undefined>(undefined);

export function AuthFormProvider({
  children,
  loading,
  errorMessage,
  register,
  errors,
}: AuthFormContextType & { children: ReactNode }) {
  return (
    <AuthFormContext.Provider value={{ loading, errorMessage, register, errors }}>
      {children}
    </AuthFormContext.Provider>
  );
}

export function useAuthForm() {
  const context = useContext(AuthFormContext);
  if (!context) {
    throw new Error('useAuthForm must be used within AuthFormProvider');
  }
  return context;
}
