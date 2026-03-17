'use client';

import { motion } from 'framer-motion';
import { Button } from '../uiComponents/Button';
import { useState } from 'react';
import { url, url_frontend } from '../context/url.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { InfoPersonnelles } from './InfoPersonnelles';
import { InfoAcademiques } from './InfoAcademiques';
import { Logement } from './Logement';

export function RegisterForm({ onSwitchToLogin, onRegistrationSubmit, isSubmitting = false, initialEmail = '' }) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: initialEmail,
    etablissement: '',
    parcours: '',
    niveau: '',
    promotion: '',
    logement: 'campus',
    blocCampus: '',
    quartier: '',
    telephone: '',
    image: null,
  });

  const [currentStep, setCurrentStep] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    isChecking: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleEmailCheck = async () => {
    if (!formData.email.trim()) return;
    setEmailValidation({ isValid: false, isChecking: true });

    try {
      const resp = await fetch(`${url}auth/check-email-allowed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim() })
      });
      const response = await resp.json();

      if (response.success) {
        setEmailValidation({ isValid: true, isChecking: false });
        Notify.success('Email autorisé !');
      } else {
        setEmailValidation({ isValid: false, isChecking: false });
        Notify.failure(response.message || 'Email non autorisé');
      }
    } catch (error) {
      setEmailValidation({ isValid: false, isChecking: false });
      Notify.failure('Erreur lors de la vérification');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      Notify.failure('Veuillez entrer un email');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Vérifier email
      const checkResp = await fetch(`${url}auth/check-email-allowed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim() }),
      });
      const checkData = await checkResp.json();

      if (!checkData.success) {
        Notify.failure(checkData.message || 'Email non autorisé');
        setIsLoading(false);
        return;
      }

      // 2. Préparer payload avec image
      let payload = { ...formData };
      const hasFile = formData.image && formData.image instanceof File;
      if (hasFile) {
        const toBase64 = (file) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });
        const base64Image = await toBase64(formData.image);
        payload = {
          ...payload,
          image: base64Image,
          imageName: formData.image.name,
          imageType: formData.image.type
        };
      }

      // 3. Inscription
      const resp = await fetch(`${url}auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, url_frontend }),
      });
      const data = await resp.json();

      if (data.success) {
        Notify.success('Inscription réussie ! Vérifiez votre email pour créer votre mot de passe.');
        if (onRegistrationSubmit) onRegistrationSubmit(data);
        setCurrentStep('success');
      } else {
        console.log('Erreurs:', data.errors);
        Notify.failure(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error(error);
      Notify.failure('Erreur réseau');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl w-full max-w-md flex flex-col items-center p-8 shadow-2xl"
          style={{
            boxShadow: '0 2px 16px 0 rgba(34, 197, 94, 0.2)',
            borderColor: '#86efac',
            borderWidth: 2,
            borderStyle: 'solid'
          }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-6 mt-6">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-extrabold mb-3 text-center text-gray-800 dark:text-white">
            Inscription réussie !
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-6">
            Un email a été envoyé à <strong>{formData.email}</strong>.<br />
            Cliquez sur le lien dans l'email pour créer votre mot de passe.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
            <p className="text-sm text-blue-800 text-center">
              📧 Vérifiez votre boîte mail et vos spams.
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToLogin || (() => window.location.href = '/acceuil')}
            className="mt-6 text-blue-600 hover:underline text-sm font-medium"
          >
            ← Retour à la connexion
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white p-6 dark:bg-gray-800/90 rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto"
    >
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Inscription Étudiant AEDDI
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InfoPersonnelles
          formData={formData}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleEmailCheck={handleEmailCheck}
          emailValidation={emailValidation}
          setEmailValidation={setEmailValidation}
        />
        <InfoAcademiques
          formData={formData}
          handleChange={handleChange}
        />
        <Logement
          formData={formData}
          handleChange={handleChange}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading || isSubmitting}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Inscription en cours...
              </span>
            ) : "S'inscrire"}
          </Button>
        </motion.div>
      </form>

      <p className="text-sm text-gray-500 mt-4 text-center">
        Déjà un compte ?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin || (() => window.location.href = '/acceuil')}
          className="text-blue-600 hover:underline font-medium"
        >
          Se connecter
        </button>
      </p>
    </motion.div>
  );
}