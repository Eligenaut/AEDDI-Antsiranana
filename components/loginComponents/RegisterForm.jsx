'use client';

import { motion } from 'framer-motion';
import { Button } from '../uiComponents/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { url, url_frontend } from '../context/url.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { InfoPersonnelles } from './InfoPersonnelles';
import { InfoAcademiques } from './InfoAcademiques';
import { Logement } from './Logement';

export function RegisterForm({ onSwitchToLogin, onRegistrationSubmit, isSubmitting = false, initialEmail = '' }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: initialEmail,
    etablissement: '',
    parcours: '',
    niveau: '',
    promotion: '',
    hasCampusLogement: false,
    type_logement: '',
    option_campus: '',
    section_campus: '',
    bloc_campus: '',
    quartier: '',
    telephone: '',
    image: null,
  });

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
    const email = formData.email.trim();
    
    if (!email) {
      Notify.failure('Veuillez entrer un email');
      return;
    }

    setEmailValidation({ isValid: false, isChecking: true });

    try {
      const response = await fetch(`${url}auth/check-email-allowed`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      // Vérifier le statut HTTP
      if (!response.ok) {
        const errorData = await response.json();
        setEmailValidation({ isValid: false, isChecking: false });
        Notify.failure(errorData.message || 'Email non autorisé');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setEmailValidation({ isValid: true, isChecking: false });
        Notify.success('Email autorisé !');
      } else {
        setEmailValidation({ isValid: false, isChecking: false });
        Notify.failure(data.message || 'Email non autorisé');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification email:', error);
      setEmailValidation({ isValid: false, isChecking: false });
      Notify.failure('Erreur de connexion. Vérifiez votre serveur.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();

    if (!email) {
      Notify.failure('Veuillez entrer un email');
      return;
    }

    // Vérifier que les champs obligatoires sont remplis
    if (!formData.nom || !formData.prenom || !formData.etablissement || 
        !formData.parcours || !formData.niveau || !formData.promotion || 
        !formData.telephone || !formData.quartier) {
      Notify.failure('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Vérifier email
      const checkResponse = await fetch(`${url}auth/check-email-allowed`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!checkResponse.ok) {
        const errorData = await checkResponse.json();
        Notify.failure(errorData.message || 'Email non autorisé');
        setIsLoading(false);
        return;
      }

      const checkData = await checkResponse.json();

      if (!checkData.success) {
        Notify.failure(checkData.message || 'Email non autorisé');
        setIsLoading(false);
        return;
      }

      // 2. Préparer le payload avec image
      let payload = { 
        ...formData,
        email,
        url_frontend 
      };

      const hasFile = formData.image && formData.image instanceof File;
      if (hasFile) {
        const toBase64 = (file) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
        });

        try {
          const base64Image = await toBase64(formData.image);
          payload = {
            ...payload,
            image: base64Image,
            imageName: formData.image.name,
            imageType: formData.image.type
          };
        } catch (imgError) {
          console.error('Erreur conversion image:', imgError);
          Notify.failure('Erreur lors du traitement de l\'image');
          setIsLoading(false);
          return;
        }
      }

      // 3. Soumettre l'inscription
      const registerResponse = await fetch(`${url}auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        console.error('Erreurs inscription:', registerData.errors || registerData);
        Notify.failure(registerData.message || "Erreur lors de l'inscription");
        setIsLoading(false);
        return;
      }

      if (registerData.success) {
        Notify.success('Inscription réussie ! Un code à 6 chiffres vous a été envoyé par email.');
        if (onRegistrationSubmit) onRegistrationSubmit(registerData);
        router.replace(`/verification-code?email=${encodeURIComponent(email)}`);
      } else {
        Notify.failure(registerData.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      Notify.failure('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white p-6 rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto"
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