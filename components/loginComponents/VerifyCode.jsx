'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../uiComponents/Button';
import { url } from '../context/url.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function VerifyCode({ email: initialEmail }) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [email] = useState(initialEmail || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email) router.replace('/devenir-membre');
  }, [email, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    try {
      const res = await fetch(`${url}auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        Notify.failure(data.message || 'Erreur lors du renvoi');
        setIsResending(false);
        return;
      }
      Notify.success('Nouveau code envoyé !');
      setCountdown(60);
    } catch {
      Notify.failure('Erreur de connexion');
    }
    setIsResending(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      Notify.failure('Veuillez entrer un code à 6 chiffres');
      return;
    }
    setIsVerifying(true);
    try {
      const response = await fetch(`${url}auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        Notify.failure(data.message || 'Code invalide');
        setIsVerifying(false);
        return;
      }
      Notify.success('Code vérifié !');
      router.replace(`/creer-mot-de-passe?email=${encodeURIComponent(email)}`);
    } catch {
      Notify.failure('Erreur de connexion');
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl w-full max-w-md flex flex-col items-center p-8 shadow-2xl"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-6 mt-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold mb-2 text-center text-gray-800">
          Vérification
        </h1>
        <p className="text-gray-600 text-center text-sm mb-6">
          Un code à 6 chiffres a été envoyé à <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Entrez le code reçu par email
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              placeholder="0 0 0 0 0 0"
              className="w-full px-4 py-4 text-center text-3xl tracking-[12px] border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all"
              autoFocus
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isVerifying || code.length !== 6}>
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Vérification...
              </span>
            ) : 'Vérifier le code'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Vous n'avez pas reçu le code ?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
            className={`text-sm font-medium ${countdown > 0 || isResending ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'}`}
          >
            {isResending ? 'Envoi...' : countdown > 0 ? `Renvoyer dans ${countdown}s` : 'Renvoyer le code'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-4 text-blue-600 hover:underline text-sm font-medium"
        >
          ← Retour à la connexion
        </button>
      </motion.div>
    </div>
  );
}
