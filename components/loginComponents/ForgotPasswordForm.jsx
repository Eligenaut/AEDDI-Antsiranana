'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { url } from '../context/url.js';
import { baseHeaders } from '../context/headers.jsx';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useRouter } from 'next/navigation.js';

export function ForgotPasswordForm({ onBack }) {
  const router = useRouter();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/login');
    }
  };
  const [step, setStep] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${url}auth/forgot-password`, {
        method: 'POST',
        headers: baseHeaders,
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.success) {
        Notify.success(data.message);
        setStep('code');
      } else {
        Notify.failure(data.message || 'Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur:', error);
      Notify.failure('Erreur lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setStep('reset');
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      Notify.failure('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${url}auth/reset-password`, {
        method: 'POST',
        headers: baseHeaders,
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          password: formData.password,
          password_confirmation: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        Notify.success(data.message);
        if (data.token && data.user) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          router.push('/dashboard');
        }
      } else {
        Notify.failure(data.message || 'Erreur lors de la réinitialisation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      Notify.failure('Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col items-center relative transition-all duration-300 p-6 sm:p-6 md:p-8"
        style={{
          boxShadow: '0 2px 16px 0 rgba(124, 58, 237, 0.15)',
          borderColor: '#a78bfa',
          borderWidth: 2,
          borderStyle: 'solid',
        }}
      >
        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mb-4 drop-shadow-lg">
          <span className="text-3xl text-white">🔑</span>
        </div>
        
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 dark:text-white tracking-tight">
          {step === 'email' && 'Mot de passe oublié'}
          {step === 'code' && 'Code de vérification'}
          {step === 'reset' && 'Nouveau mot de passe'}
        </h1>

        {/* Étape 1: Email */}
        {step === 'email' && (
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 w-full"
            onSubmit={handleEmailSubmit}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white shadow-sm transition-all"
                  placeholder="exemple@aeddi.mg"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v16H4z"/>
                    <path d="M22 6l-10 7L2 6"/>
                  </svg>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {loading ? 'Envoi...' : 'Envoyer le code'}
            </button>
          </motion.form>
        )}

        {/* Étape 2: Code */}
        {step === 'code' && (
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 w-full"
            onSubmit={handleCodeSubmit}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Code de vérification
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white shadow-sm transition-all text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Entrez le code à 6 chiffres envoyé à {formData.email}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
            >
              Vérifier le code
            </button>
          </motion.form>
        )}

        {/* Étape 3: Nouveau mot de passe */}
        {step === 'reset' && (
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 w-full"
            onSubmit={handleResetSubmit}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white shadow-sm transition-all"
                  placeholder="Votre nouveau mot de passe"
                  required
                  minLength={8}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="9" r="7"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white shadow-sm transition-all"
                  placeholder="Confirmez votre mot de passe"
                  required
                  minLength={8}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="9" r="7"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </motion.form>
        )}

        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          <button
            type="button"
            onClick={handleBack}
            className="text-blue-600 hover:underline font-medium"
          >
            ← Retour à la connexion
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
