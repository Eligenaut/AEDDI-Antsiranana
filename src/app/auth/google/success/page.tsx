'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function GoogleSuccessContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(userParam);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('Connexion Google réussie:', user);
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('Erreur lors du parsing des données:', error);
        window.location.href = '/login?error=google_parse_error';
      }
    } else {
      window.location.href = '/login?error=google_missing_params';
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
          <span className="text-3xl text-white">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Connexion réussie !
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Redirection en cours...
        </p>
      </div>
    </div>
  );
}

export default function GoogleSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <GoogleSuccessContent />
    </Suspense>
  );
}

