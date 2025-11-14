'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '../uiComponents/Button';
import { url } from '../context/url.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function VerificationPage({ email, onVerificationSuccess, onResendEmail }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleVerification = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');
    setMessage('');

    try {
      const resp = await fetch(`${url}auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode }),
      });
      const data = await resp.json();

      if (data.success) {
        setMessage('✅ Vérification réussie ! Redirection vers la création de mot de passe...');
        Notify.success('Vérification réussie !');
        
        // Stocker le token et les données utilisateur immédiatement après vérification
        if (data.token && data.user) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Passer à l'étape suivante (création de mot de passe)
        setTimeout(() => {
          onVerificationSuccess();
        }, 1500);
      } else {
        setError(data.message || 'Code de vérification invalide');
        Notify.failure(data.message || 'Code de vérification invalide');
      }
    } catch (error) {
      setError('Erreur lors de la vérification. Veuillez réessayer.');
      Notify.failure('Erreur lors de la vérification. Veuillez réessayer.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${url}auth/resend-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();

      if (data.success) {
        setMessage('📧 Nouvel email de vérification envoyé !');
        Notify.success('Nouvel email de vérification envoyé !');
      } else {
        setError(data.message || 'Erreur lors de l\'envoi de l\'email');
        Notify.failure(data.message || 'Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
      Notify.failure('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
    } finally {
      setIsResending(false);
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
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Vérification de votre email
        </h1>
        <p className="text-gray-600">
          Nous avons envoyé un code de vérification à
        </p>
        <p className="font-semibold text-blue-600">{email}</p>
      </motion.div>

      <form onSubmit={handleVerification} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code de vérification
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Entrez le code à 6 chiffres"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all text-center text-lg tracking-widest"
            maxLength={6}
            required
          />
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
          transition={{ delay: 0.4 }}
        >
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isVerifying || verificationCode.length !== 6}
          >
            {isVerifying ? 'Vérification...' : 'Vérifier mon email'}
          </Button>
        </motion.div>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-500 mb-3">
          Vous n'avez pas reçu l'email ?
        </p>
        <button
          type="button"
          onClick={handleResendEmail}
          disabled={isResending}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:opacity-50"
        >
          {isResending ? 'Envoi en cours...' : 'Renvoyer l\'email'}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <p className="text-xs text-blue-800">
          <strong>💡 Conseil :</strong> Vérifiez votre dossier spam si vous ne trouvez pas l'email.
          Le code de vérification expire dans 15 minutes.
        </p>
      </motion.div>
    </motion.div>
  );
}
