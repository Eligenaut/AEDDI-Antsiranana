'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { url, url_frontend } from '../context/url.js';
import { baseHeaders } from '../context/headers.jsx';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useRouter } from 'next/navigation.js';

export function ForgetPassword({ onBack }) {
  const router = useRouter();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/login');
    }
  };

  const [formData, setFormData] = useState({
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${url}auth/forgot-password`, {
        method: 'POST',
        headers: {
          ...baseHeaders,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: formData.email,
          url_frontend: url_frontend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Notify.failure(errorData.message || 'Erreur lors de l\'envoi de l\'email');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        Notify.success(data.message || 'Email de réinitialisation envoyé avec succès');
        setSuccess(true);
      } else {
        Notify.failure(data.message || 'Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur:', error);
      Notify.failure('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col items-center relative transition-all duration-300 px-4 sm:px-6 md:px-8 py-6 sm:py-6 md:py-8"
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
        
        <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-800 tracking-tight px-2">
          Réinitialiser votre mot de passe
        </h1>

        {!success ? (
          <>
            <p className="text-center text-gray-600 text-sm mb-6 px-2">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 w-full px-0"
              onSubmit={handleEmailSubmit}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 text-gray-900 shadow-sm transition-all"
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 rounded-[6px] shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading && (
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                )}
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </motion.form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center w-full"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Email envoyé avec succès !
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Nous avons envoyé un lien de réinitialisation à :
            </p>
            <p className="text-gray-800 font-semibold mb-6">
              {formData.email}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                📧 Vérifiez votre boîte mail et vos spams. Le lien expire dans 24 heures.
              </p>
            </div>
          </motion.div>
        )}

        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-sm text-gray-600 px-2"
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