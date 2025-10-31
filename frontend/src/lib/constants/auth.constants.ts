// Placeholders comunes
export const PASSWORD_PLACEHOLDER = '••••••••';
export const EMAIL_PLACEHOLDER = 'tu@email.com';
export const USERNAME_PLACEHOLDER = 'tu_usuario';

// Etiquetas comunes
export const EMAIL_LABEL = 'Email';
export const PASSWORD_LABEL = 'Contraseña';
export const USERNAME_LABEL = 'Nombre de usuario';
export const CONFIRM_PASSWORD_LABEL = 'Confirmar contraseña';

// Textos comunes
export const BACK_BUTTON_TEXT = 'Volver al mercado';

// Configuraciones de formulario
export const EMAIL_FIELD = {
  label: EMAIL_LABEL,
  placeholder: EMAIL_PLACEHOLDER,
  autoComplete: 'email' as const,
};

export const PASSWORD_FIELD = {
  label: PASSWORD_LABEL,
  placeholder: PASSWORD_PLACEHOLDER,
  autoComplete: 'current-password' as const,
};

export const USERNAME_FIELD = {
  label: USERNAME_LABEL,
  placeholder: USERNAME_PLACEHOLDER,
  autoComplete: 'username' as const,
};

export const CONFIRM_PASSWORD_FIELD = {
  label: CONFIRM_PASSWORD_LABEL,
  placeholder: PASSWORD_PLACEHOLDER,
  autoComplete: 'new-password' as const,
};
