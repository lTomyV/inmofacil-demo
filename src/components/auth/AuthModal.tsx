import React, { useState, FormEvent } from 'react';
import { Theme } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
  theme: Theme;
  isDark: boolean;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  theme,
  isDark
}) => {
  // Login form state
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    email: '',
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDNI = (dni: string): boolean => {
    const dniRegex = /^\d{7,8}$/;
    return dniRegex.test(dni);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Login form handlers
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: FormErrors = {};

    if (!loginForm.email) {
      errors.email = 'El email es requerido';
    } else if (!validateEmail(loginForm.email)) {
      errors.email = 'Email inválido';
    }

    if (!loginForm.password) {
      errors.password = 'La contraseña es requerida';
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setIsLoading(true);
    // TODO: Implement actual login logic
    setTimeout(() => {
      console.log('Login:', loginForm);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  // Register form handlers
  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: FormErrors = {};

    if (!registerForm.email) {
      errors.email = 'El email es requerido';
    } else if (!validateEmail(registerForm.email)) {
      errors.email = 'Email inválido';
    }

    if (!registerForm.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    }

    if (!registerForm.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    }

    if (!registerForm.dni) {
      errors.dni = 'El DNI es requerido';
    } else if (!validateDNI(registerForm.dni)) {
      errors.dni = 'DNI inválido (7-8 dígitos)';
    }

    if (!registerForm.phone) {
      errors.phone = 'El teléfono es requerido';
    } else if (!validatePhone(registerForm.phone)) {
      errors.phone = 'Teléfono inválido';
    }

    if (!registerForm.password) {
      errors.password = 'La contraseña es requerida';
    } else if (!validatePassword(registerForm.password)) {
      errors.password = 'Mínimo 8 caracteres';
    }

    if (!registerForm.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    setIsLoading(true);
    // TODO: Implement actual registration logic
    setTimeout(() => {
      console.log('Register:', registerForm);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login');
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4">
          <button
            onClick={() => onTabChange('login')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'login'
                ? `${theme.bgClass} text-white`
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => onTabChange('register')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'register'
                ? `${theme.bgClass} text-white`
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-750 transition-all mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative bg-white dark:bg-slate-900 px-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">o continúa con email</span>
            </div>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, email: e.target.value });
                    setLoginErrors({ ...loginErrors, email: '' });
                  }}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${
                    loginErrors.email
                      ? 'border-red-500'
                      : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors`}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
                {loginErrors.email && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {loginErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Contraseña
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, password: e.target.value });
                    setLoginErrors({ ...loginErrors, password: '' });
                  }}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${
                    loginErrors.password
                      ? 'border-red-500'
                      : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {loginErrors.password && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {loginErrors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-600 dark:text-slate-400">Recordarme</span>
                </label>
                <button
                  type="button"
                  className={`${theme.textClass} hover:underline font-bold`}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${theme.bgClass} text-white px-6 py-3 rounded-xl font-bold shadow-lg ${theme.shadowClass} hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Iniciando...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label htmlFor="register-email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  id="register-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, email: e.target.value });
                    setRegisterErrors({ ...registerErrors, email: '' });
                  }}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${
                    registerErrors.email
                      ? 'border-red-500'
                      : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors`}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
                {registerErrors.email && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {registerErrors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="register-firstname" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Nombre/s *
                  </label>
                  <input
                    id="register-firstname"
                    type="text"
                    value={registerForm.firstName}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, firstName: e.target.value });
                      setRegisterErrors({ ...registerErrors, firstName: '' });
                    }}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${
                      registerErrors.firstName
                        ? 'border-red-500'
                        : 'border-slate-200 dark:border-slate-700'
                    } rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors`}
                    placeholder="Juan"
                    disabled={isLoading}
                  />
                  {registerErrors.firstName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <i className="fa-solid fa-circle-exclamation"></i>
                      {registerErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-lastname" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Apellido/s *
                  </label>
                  <input
                    id="register-lastname"
                    type="text"
                    value={registerForm.lastName}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, lastName: e.target.value });
                      setRegisterErrors({ ...registerErrors, lastName: '' });
                    }}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${
                      registerErrors.lastName
                        ? 'border-red-500'
                        : 'border-slate-200 dark:border-slate-700'
                    } rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors`}
                    placeholder="Pérez"
                    disabled={isLoading}
                  />
                  {registerErrors.lastName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <i className="fa-solid fa-circle-exclamation"></i>
                      {registerErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="register-dni" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    DNI *
                  </label>
                  <input
                    id="register-dni"
                    type="text"
                    value={registerForm.dni}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setRegisterForm({ ...registerForm, dni: value });
                      setRegisterErrors({ ...registerErrors, dni: '' });
                    }}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${
                      registerErrors.dni
                        ? 'border-red-500'
                        : 'border-slate-200 dark:border-slate-700'
                    } rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors`}
                    placeholder="12345678"
                    maxLength={8}
                    disabled={isLoading}
                  />
                  {registerErrors.dni && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <i className="fa-solid fa-circle-exclamation"></i>
                      {registerErrors.dni}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-phone" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    id="register-phone"
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, phone: e.target.value });
                      setRegisterErrors({ ...registerErrors, phone: '' });
                    }}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${
                      registerErrors.phone
                        ? 'border-red-500'
                        : 'border-slate-200 dark:border-slate-700'
                    } rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors`}
                    placeholder="+54 9 11 1234-5678"
                    disabled={isLoading}
                  />
                  {registerErrors.phone && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <i className="fa-solid fa-circle-exclamation"></i>
                      {registerErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Contraseña *
                </label>
                <input
                  id="register-password"
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, password: e.target.value });
                    setRegisterErrors({ ...registerErrors, password: '' });
                  }}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${
                    registerErrors.password
                      ? 'border-red-500'
                      : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors`}
                  placeholder="Mínimo 8 caracteres"
                  disabled={isLoading}
                />
                {registerErrors.password && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {registerErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="register-confirm-password" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Repetir Contraseña *
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, confirmPassword: e.target.value });
                    setRegisterErrors({ ...registerErrors, confirmPassword: '' });
                  }}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 ${
                    registerErrors.confirmPassword
                      ? 'border-red-500'
                      : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors`}
                  placeholder="Confirma tu contraseña"
                  disabled={isLoading}
                />
                {registerErrors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {registerErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span>
                    Acepto los{' '}
                    <button type="button" className={`${theme.textClass} hover:underline font-bold`}>
                      términos y condiciones
                    </button>
                    {' '}y la{' '}
                    <button type="button" className={`${theme.textClass} hover:underline font-bold`}>
                      política de privacidad
                    </button>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${theme.bgClass} text-white px-6 py-3 rounded-xl font-bold shadow-lg ${theme.shadowClass} hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Creando cuenta...
                  </span>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
