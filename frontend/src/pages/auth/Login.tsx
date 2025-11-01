import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/api/services/auth.api';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthFormError } from '@/components/auth/AuthFormError';
import { FormField } from '@/components/auth/FormField';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { BackButton } from '@/components/common/BackButton';
import { Flex } from '@/components/common/Flex';
import { CardFooter } from '@/components/ui/card';
import { AuthFormProvider } from '@/context/AuthFormContext';
import { BACK_BUTTON_TEXT, EMAIL_FIELD, PASSWORD_FIELD } from '@/lib/constants/auth.constants';
import { type LoginFormData, loginSchema } from '@/lib/validations/auth';

const LOGIN_SUBMIT_TEXT = 'Iniciar Sesión';
const LOGIN_LOADING_TEXT = 'Iniciando sesión...';
const LOGIN_REGISTER_TEXT = '¿No tienes cuenta?';
const LOGIN_REGISTER_LINK_TEXT = 'Regístrate aquí';

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
      <BackButton
        to="/"
        text={BACK_BUTTON_TEXT}
        className="absolute top-6 left-6"
      />
      <Flex className="min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
        <AuthCard description="Inicia sesión en tu cuenta">
          <AuthFormProvider
            loading={loading}
            errorMessage={errorMessage}
            register={register as any}
            errors={errors as any}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <AuthFormError message={errorMessage} />

              <FormField
                id="email"
                label={EMAIL_FIELD.label}
                placeholder={EMAIL_FIELD.placeholder}
                type="email"
                autoComplete={EMAIL_FIELD.autoComplete}
              />

              <FormField
                id="password"
                label={PASSWORD_FIELD.label}
                placeholder={PASSWORD_FIELD.placeholder}
                type="password"
                autoComplete={PASSWORD_FIELD.autoComplete}
              />

              <CardFooter className="flex flex-col gap-4 px-0">
                <SubmitButton
                  text={LOGIN_SUBMIT_TEXT}
                  loadingText={LOGIN_LOADING_TEXT}
                  isLoading={loading}
                />

                <p className="text-sm text-center text-gray-600">
                  {LOGIN_REGISTER_TEXT}{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline interactive-link"
                  >
                    {LOGIN_REGISTER_LINK_TEXT}
                  </Link>
                </p>
              </CardFooter>
            </form>
          </AuthFormProvider>
        </AuthCard>
      </Flex>
    </>
  );
}
