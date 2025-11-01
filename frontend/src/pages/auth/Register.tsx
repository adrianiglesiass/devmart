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
import {
  BACK_BUTTON_TEXT,
  CONFIRM_PASSWORD_FIELD,
  EMAIL_FIELD,
  PASSWORD_FIELD,
  USERNAME_FIELD,
} from '@/lib/constants/auth.constants';
import { type RegisterFormData, registerSchema } from '@/lib/validations/auth';

const REGISTER_SUBMIT_TEXT = 'Registrarse';
const REGISTER_LOADING_TEXT = 'Creando cuenta...';
const REGISTER_LOGIN_TEXT = '¿Ya tienes cuenta?';
const REGISTER_LOGIN_LINK_TEXT = 'Inicia sesión';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
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
        'Error al crear la cuenta. Intenta de nuevo.';

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
        <AuthCard description="Crea tu cuenta">
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
                id="username"
                label={USERNAME_FIELD.label}
                placeholder={USERNAME_FIELD.placeholder}
                type="text"
                autoComplete={USERNAME_FIELD.autoComplete}
              />

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
                autoComplete="new-password"
              />

              <FormField
                id="confirmPassword"
                label={CONFIRM_PASSWORD_FIELD.label}
                placeholder={CONFIRM_PASSWORD_FIELD.placeholder}
                type="password"
                autoComplete={CONFIRM_PASSWORD_FIELD.autoComplete}
              />

              <CardFooter className="flex flex-col gap-4 px-0">
                <SubmitButton
                  text={REGISTER_SUBMIT_TEXT}
                  loadingText={REGISTER_LOADING_TEXT}
                  isLoading={loading}
                />

                <p className="text-sm text-center text-gray-600">
                  {REGISTER_LOGIN_TEXT}{' '}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline interactive-link"
                  >
                    {REGISTER_LOGIN_LINK_TEXT}
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
