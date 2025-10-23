import { z } from 'zod';

export const strongPassword = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Al menos una mayúscula')
  .regex(/[a-z]/, 'Al menos una minúscula')
  .regex(/\d/, 'Al menos un número')
  .regex(/[^A-Za-z0-9]/, 'Al menos un símbolo');

export const loginSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
      .max(20, 'Máximo 20 caracteres'),
    email: z.email('Email inválido'),
    password: strongPassword,

    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
