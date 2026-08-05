'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from './LoginContexte';

export function LoginForm({ onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { connecter, connecterGoogle, loading, loadingGoogle } = useLogin(); // ✅ ajout loadingGoogle
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await connecter(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLogin = async () => {
    await connecterGoogle();
  };

  const handleForgotPassword = () => {
    router.push('/mot-de-passe-oublie');
  };

  const handleDevenirMembre = () => {
    if (onSwitchToRegister) {
      onSwitchToRegister();
    } else {
      router.push('/devenir-membre');
    }
  };

  return (
    <div className="flex items-center justify-center bg-white w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{
          boxShadow: '0 4px 24px 0 rgba(124, 58, 237, 0.25)',
          borderColor: '#7c3aed',
        }}
        style={{
          boxShadow: '0 2px 16px 0 rgba(124, 58, 237, 0.15)',
          borderColor: '#a78bfa',
          borderWidth: 2,
          borderStyle: 'solid',
        }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col items-center relative transition-all duration-300 px-4 sm:px-6 md:px-8 py-6 sm:py-6 md:py-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mb-4 drop-shadow-lg">
          <span className="text-3xl text-white">🔐</span>
        </div>

        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 tracking-tight px-2">
          Connexion à AEDDI-DIEGO
        </h1>

        {/* ✅ Bouton Google avec loadingGoogle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full mb-6"
        >
          <button
            onClick={handleGoogleLogin}
            disabled={loadingGoogle}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-[6px] shadow transition-all duration-150 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingGoogle ? (
              <span className="animate-spin inline-block w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2">
                <g>
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.91 2.36 30.28 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.36 13.09 17.74 9.5 24 9.5z" />
                  <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.99 37.09 46.1 31.27 46.1 24.55z" />
                  <path fill="#FBBC05" d="M10.67 28.29c-1.01-2.9-1.01-6.01 0-8.91l-7.98-6.2C.99 17.09 0 20.45 0 24c0 3.55.99 6.91 2.69 9.82l7.98-6.2z" />
                  <path fill="#EA4335" d="M24 48c6.28 0 11.91-2.09 15.91-5.73l-7.19-5.6c-2.01 1.35-4.59 2.13-8.72 2.13-6.26 0-11.64-3.59-13.33-8.82l-7.98 6.2C6.73 42.2 14.82 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </g>
              </svg>
            )}
            {loadingGoogle ? 'Connexion Google...' : 'Se connecter avec Google'}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative w-full mb-6 mt-6"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/80 text-gray-500">ou</span>
          </div>
        </motion.div>

        <form className="space-y-4 w-full px-0" onSubmit={handleSubmit} autoComplete="on">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 pl-10 border rounded-[6px] focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 text-gray-900 shadow-sm transition-all"
                placeholder="exemple@aeddi.mg"
                required
                autoComplete="email"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16v16H4z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 pl-10 pr-10 border rounded-[6px] focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 text-gray-900 shadow-sm transition-all"
                placeholder="Votre mot de passe"
                required
                autoComplete="current-password"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="9" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label="Afficher/masquer le mot de passe"
              >
                {showPassword ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* ✅ Bouton Se connecter — utilise uniquement loading */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 rounded-[6px] shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              )}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-4 text-sm w-full px-2"
        >
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-pink-500 hover:underline font-semibold"
          >
            Mot de passe oublié ?
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-2 text-center text-sm text-gray-600 px-2"
        >
          <p>Pas encore membre ?</p>
          <button
            type="button"
            onClick={handleDevenirMembre}
            className="mt-1 text-blue-600 hover:underline font-medium"
          >
            Devenir membre
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}