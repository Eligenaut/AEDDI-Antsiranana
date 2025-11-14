'use client';

import React, { useState, useEffect } from 'react';
import { url } from '../context/url.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default function CodeValidation({ email, onCodeValidated, onBack }) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  // Timer pour le code
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Formatage du temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Gestion de la saisie du code
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  // Validation du code
  const handleValidateCode = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${url}auth/validate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Code validé avec succès !');
        Notify.success('Code validé avec succès !');
        setTimeout(() => {
          onCodeValidated(code);
        }, 1500);
      } else {
        setError(data.message || 'Code incorrect');
        Notify.failure(data.message || 'Code incorrect');
      }
    } catch (error) {
      setError('Erreur lors de la validation');
      Notify.failure('Erreur lors de la validation');
    } finally {
      setIsLoading(false);
    }
  };

  // Renvoyer le code
  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${url}auth/send-validation-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Code renvoyé avec succès !');
        Notify.success('Code renvoyé avec succès !');
        setTimeLeft(300);
        setCanResend(false);
      } else {
        setError(data.message || 'Erreur lors de l\'envoi');
        Notify.failure(data.message || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi');
      Notify.failure('Erreur lors de l\'envoi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Validation du code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-white">
            Entrez le code à 6 chiffres envoyé à
          </p>
          <p className="text-center text-sm font-medium text-blue-600 dark:text-white">
            {email}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleValidateCode}>
          <div>
            <label htmlFor="code" className="sr-only">
              Code de validation
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              value={code}
              onChange={handleCodeChange}
              placeholder="123456"
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              maxLength={6}
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ← Retour
            </button>
            
            {canResend ? (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Envoi...' : 'Renvoyer le code'}
              </button>
            ) : (
              <div className="text-sm text-gray-500">
                Renvoyer dans {formatTime(timeLeft)}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Validation...' : 'Valider le code'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Le code expire dans {formatTime(timeLeft)}
          </p>
        </div>
      </div>
    </div>
  );
}
