'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function GoogleErrorContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      console.error('Erreur Google OAuth:', error);
    }
  }, [searchParams]);

  const handleRetry = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
          <span className="text-3xl text-white">✗</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Erreur de connexion
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Une erreur s&apos;est produite lors de la connexion avec Google.
        </p>
        <button
          onClick={handleRetry}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

export default function GoogleErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <GoogleErrorContent />
    </Suspense>
  );
}

