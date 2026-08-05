'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../uiComponents/Button.jsx';
import { url } from '../context/url.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function RegisterPassword({ email, onPasswordCreated }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${url}auth/check-verification`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!data.verified) {
          router.replace(`/verification-code?email=${encodeURIComponent(email)}`);
          return;
        }
      } catch {
        router.replace(`/verification-code?email=${encodeURIComponent(email)}`);
        return;
      }
      setIsChecking(false);
    };
    check();
  }, [email, router]);
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
      Notify.failure('Le mot de passe ne respecte pas tous les critères requis.');
      return;
    }

    if (!passwordsMatch) {
      setError('Les mots de passe ne correspondent pas.');
      Notify.failure('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch(`${url}auth/create-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email,
          password: formData.password, 
          confirmPassword: formData.confirmPassword 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la création du mot de passe');
        Notify.failure(errorData.message || 'Erreur lors de la création du mot de passe');
        setIsCreating(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Mot de passe créé avec succès ! Redirection en cours...');
        Notify.success('Mot de passe créé avec succès !');
        
        // L'authentification est désormais gérée par cookie httpOnly (backend).
        // On conserve uniquement les infos utilisateur pour l'affichage.
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        setTimeout(() => {
          onPasswordCreated(data.token || '');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors de la création du mot de passe');
        Notify.failure(data.message || 'Erreur lors de la création du mot de passe');
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMsg = 'Erreur lors de la création du mot de passe. Veuillez réessayer.';
      setError(errorMsg);
      Notify.failure(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto"
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Créer votre mot de passe
        </h1>
        <p className="text-gray-600">
          Saisissez le code reçu par email pour créer votre mot de passe.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {email}
        </p>
      </motion.div>

      {isChecking ? (
        <div className="text-center py-8">
          <span className="animate-spin inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
          <p className="text-gray-500 mt-2">Vérification...</p>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Champ Mot de Passe */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
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
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
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

          {/* Critères de validation */}
          {formData.password && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2"
            >
              <p className="text-xs font-semibold text-gray-700">Critères :</p>
              <div className="space-y-1">
                {[
                  { label: '8 caractères minimum', valid: passwordValidation.checks.minLength },
                  { label: 'Une majuscule', valid: passwordValidation.checks.hasUpperCase },
                  { label: 'Une minuscule', valid: passwordValidation.checks.hasLowerCase },
                  { label: 'Un chiffre', valid: passwordValidation.checks.hasNumbers },
                  { label: 'Un caractère spécial (!@#$%^&*)', valid: passwordValidation.checks.hasSpecialChar }
                ].map((check, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                      check.valid 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-400'
                    }`}>
                      {check.valid && '✓'}
                    </span>
                    <span className={`text-xs ${
                      check.valid 
                        ? 'text-green-700' 
                        : 'text-gray-500'
                    }`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Champ Confirmation Mot de Passe */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
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
              aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
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

          {/* Indicateur de correspondance */}
          {formData.confirmPassword && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 p-2 rounded-lg flex items-center gap-2 ${
                passwordsMatch
                  ? 'bg-green-50'
                  : 'bg-red-50'
              }`}
            >
              <span className={`w-4 h-4 rounded-full ${
                passwordsMatch ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span className={`text-xs font-medium ${
                passwordsMatch
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}>
                {passwordsMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas'}
              </span>
            </motion.div>
          )}
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

        {/* Bouton Soumettre */}
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
            {isCreating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Création en cours...
              </span>
            ) : (
              'Créer mon mot de passe'
            )}
          </Button>
        </motion.div>
      </form>
      )}

      {/* Message de sécurité */}
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