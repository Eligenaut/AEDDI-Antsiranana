'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '../uiComponents/Button';
import { url } from '../context/url.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function PasswordCreation({ email, onPasswordCreated }) {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      checks: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    };
  };

  const passwordValidation = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!passwordValidation.isValid) {
      setError('Le mot de passe ne respecte pas tous les critères requis.');
      return;
    }

    if (!passwordsMatch) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsCreating(true);

    try {
      const resp = await fetch(`${url}auth/create-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: formData.password, confirmPassword: formData.confirmPassword })
      });
      const data = await resp.json();

      if (data.success) {
        setMessage('✅ Mot de passe créé avec succès ! Redirection en cours...');
        Notify.success('Mot de passe créé avec succès !');
        
        // Le token est déjà stocké après la vérification, on redirige directement
        setTimeout(() => {
          onPasswordCreated('token-already-stored');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors de la création du mot de passe');
        Notify.failure(data.message || 'Erreur lors de la création du mot de passe');
      }
    } catch (error) {
      setError('Erreur lors de la création du mot de passe. Veuillez réessayer.');
      Notify.failure('Erreur lors de la création du mot de passe. Veuillez réessayer.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white p-8 dark:bg-gray-800/90 rounded-2xl shadow-lg max-w-md mx-auto"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Créer votre mot de passe
        </h1>
        <p className="text-gray-600 dark:text-white">
          Votre email a été vérifié avec succès !
        </p>
        <p className="text-sm text-gray-500 dark:text-white mt-1">
          {email}
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Créez un mot de passe sécurisé"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmez votre mot de passe"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </motion.div>
        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <p className="text-sm text-green-800">{message}</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isCreating || !passwordValidation.isValid || !passwordsMatch}
          >
            {isCreating ? 'Création en cours...' : 'Créer mon mot de passe'}
          </Button>
        </motion.div>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <p className="text-xs text-blue-800">
          <strong>🔒 Sécurité :</strong> Votre mot de passe est chiffré et stocké de manière sécurisée. 
          Ne le partagez jamais avec d'autres personnes.
        </p>
      </motion.div>
    </motion.div>
  );
}
