import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, ShoppingBag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/api/services/auth.api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { type LoginFormData, loginSchema } from '@/lib/validations/auth';

function ErrorAlert({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 leading-relaxed">{message}</p>
    </div>
  );
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await authApi.login(data);
      // Actualizar cache con usuario autenticado
      if (response.user) {
        queryClient.setQueryData(['me'], response.user);
      }
      // Forzar revalidación
      queryClient.invalidateQueries({ queryKey: ['me'] });
      navigate('/');
    } catch (err: any) {
      const error =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Error al iniciar sesión. Verifica tus credenciales.';

      setErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors interactive-link"
        >
          ← Volver al mercado
        </Link>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-blue-600 p-3 rounded-full">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">DevMart</CardTitle>
            <CardDescription className="text-base">Inicia sesión en tu cuenta</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <ErrorAlert message={errorMessage} />

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full interactive-action"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>

              <p className="text-sm text-center text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline interactive-link"
                >
                  Regístrate aquí
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
