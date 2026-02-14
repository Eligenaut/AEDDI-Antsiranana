'use client';

import { motion } from 'framer-motion';
import { Button } from '../uiComponents/Button';
import { useState } from 'react';
import { etablissements, quartiers, optionsCampus, getNiveauxOptions, getPromotionsOptions } from './DataRegister';
import { url } from '../context/url.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function RegisterForm({onSwitchToLogin, onRegistrationSubmit, isSubmitting = false, initialEmail = '' }) {
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

  const [selectedEtablissement, setSelectedEtablissement] = useState('');
  const [selectedParcours, setSelectedParcours] = useState('');
  const [selectedCampusType, setSelectedCampusType] = useState('');

  const [currentStep, setCurrentStep] = useState('email');
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    isChecking: false,
    message: ''
  });

  // États pour la vérification
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const handleEmailValidation = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setEmailValidation({ isValid: false, isChecking: false, message: 'Veuillez entrer un email' });
      return;
    }

    setEmailValidation({ isValid: false, isChecking: true, message: 'Vérification en cours...' });

    try {
      const resp = await fetch(`${url}auth/check-email-allowed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim() })
      });
      const response = await resp.json();

      if (response.success) {
        setEmailValidation({ isValid: true, isChecking: false, message: 'Email autorisé !' });
        Notify.success('Email vérifié avec succès !');
        setCurrentStep('form');
      } else {
        setEmailValidation({ isValid: false, isChecking: false, message: response.message || 'Email non autorisé' });
        Notify.failure(response.message || 'Cet email n\'existe pas dans notre base de données');
      }
    } catch (error) {
      setEmailValidation({ isValid: false, isChecking: false, message: error.message || 'Erreur lors de la vérification' });
      Notify.failure('Erreur lors de la vérification de l\'email');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit appelé !', formData);
    
    const submitData = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      etablissement: formData.etablissement,
      parcours: formData.parcours,
      niveau: formData.niveau,
      promotion: formData.promotion,
      logement: formData.logement,
      telephone: formData.telephone,
      image: formData.image
    };
    
    if (formData.logement === 'campus' && formData.blocCampus) {
      submitData.blocCampus = formData.blocCampus;
    }
    
    if (formData.logement === 'ville' && formData.quartier) {
      submitData.quartier = formData.quartier;
    }

    // Convertir l'image en base64 si elle existe
    let payload = { ...submitData };
    const hasFile = submitData.image && submitData.image instanceof File;
    if (hasFile) {
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
      const base64Image = await toBase64(submitData.image);
      payload = {
        ...payload,
        image: base64Image,
        imageName: submitData.image.name,
        imageType: submitData.image.type,
      };
    }

    // Stocker les données dans localStorage au lieu de les envoyer au backend
    localStorage.setItem('pending_registration_data', JSON.stringify(payload));
    setCurrentStep('verification');
    
    console.log('Données stockées dans localStorage:', payload);
    
    if (onRegistrationSubmit) {
      onRegistrationSubmit(payload);
      return;
    }
    
    // Simuler un succès et passer à l'étape de vérification
    Notify.success('Données enregistrées ! Un email de vérification va être envoyé.');
    setCurrentStep('verification');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      image: file
    });
  };

  const handleEtablissementChange = (e) => {
    const value = e.target.value;
    setSelectedEtablissement(value);
    setSelectedParcours('');
    setFormData({
      ...formData,
      etablissement: value,
      parcours: ''
    });
  };

  const handleParcoursChange = (e) => {
    const value = e.target.value;
    setSelectedParcours(value);
    setFormData({
      ...formData,
      parcours: value
    });
  };

  const handleCampusTypeChange = (e) => {
    const value = e.target.value;
    setSelectedCampusType(value);
    setFormData({
      ...formData,
      blocCampus: ''
    });
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationError('');
    setVerificationMessage('');

    try {
      // Récupérer les données du localStorage
      const pendingData = JSON.parse(localStorage.getItem('pending_registration_data') || '{}');
      console.log('Données récupérées du localStorage pour vérification:', pendingData);
      
      const response = await fetch(`${url}auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          verificationCode: verificationCode,
          registrationData: pendingData // Envoyer les données d'inscription
        }),
      });
      
      const data = await response.json();

      if (data.success) {
        setVerificationMessage('✅ Vérification réussie ! Redirection vers la création de mot de passe...');
        Notify.success('Vérification réussie !');
        
        // Stocker le token et les données utilisateur
        if (data.token && data.user) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Nettoyer les données temporaires
        localStorage.removeItem('pending_registration_data');
        
        // Passer à l'étape suivante (création de mot de passe)
        setTimeout(() => {
          if (onRegistrationSubmit) {
            onRegistrationSubmit({ step: 'password', email: formData.email });
          }
        }, 1500);
      } else {
        setVerificationError(data.message || 'Code de vérification invalide');
        Notify.failure(data.message || 'Code de vérification invalide');
      }
    } catch (error) {
      setVerificationError('Erreur lors de la vérification. Veuillez réessayer.');
      Notify.failure('Erreur lors de la vérification. Veuillez réessayer.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (currentStep === 'verification') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col items-center relative transition-all duration-300 p-0 sm:p-6 md:p-8 shadow-2xl"
          style={{
            boxShadow: '0 2px 16px 0 rgba(124, 58, 237, 0.15)',
            borderColor: '#a78bfa',
            borderWidth: 2,
            borderStyle: 'solid',
          }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-500 rounded-full flex items-center justify-center mb-4 drop-shadow-lg mt-6">
            <span className="text-3xl text-white">📧</span>
          </div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold mb-6 text-center text-gray-800 dark:text-white tracking-tight"
          >
            Vérification Email
          </motion.h1>
          
          <form onSubmit={handleVerification} className="space-y-6 w-full max-w-md px-2 sm:px-0">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Code de vérification *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Entrez le code à 6 chiffres"
                  className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white shadow-sm transition-all text-center text-lg tracking-widest"
                  maxLength="6"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </span>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-2">
              <span className="text-xl mt-0.5">ℹ️</span>
              <p className="text-sm text-blue-800">
                Un code de vérification a été envoyé à <strong>{formData.email}</strong><br />
                Vérifiez votre boîte mail et entrez le code ci-dessus.
              </p>
            </div>

            {verificationMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">{verificationMessage}</p>
              </div>
            )}

            {verificationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{verificationError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-lg"
              disabled={isVerifying || verificationCode.length !== 6}
            >
              {isVerifying && (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {isVerifying ? 'Vérification...' : 'Vérifier le code'}
            </button>
          </form>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm text-gray-500 mt-6 text-center"
          >
            <button
              type="button"
              onClick={() => setCurrentStep('form')}
              className="text-blue-600 hover:underline font-medium"
            >
              ← Retour au formulaire
            </button>
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (currentStep === 'email') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col items-center relative transition-all duration-300 p-0 sm:p-6 md:p-8 shadow-2xl"
          style={{
            boxShadow: '0 2px 16px 0 rgba(124, 58, 237, 0.15)',
            borderColor: '#a78bfa',
            borderWidth: 2,
            borderStyle: 'solid',
          }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mb-4 drop-shadow-lg mt-6">
            <span className="text-3xl text-white">🎓</span>
          </div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold mb-6 text-center text-gray-800 dark:text-white tracking-tight"
          >
            Inscription Étudiant AEDDI
          </motion.h1>
          <form onSubmit={handleEmailValidation} className="space-y-6 w-full max-w-md px-2 sm:px-0">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email de l'étudiant *
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="exemple@email.com"
                  className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white shadow-sm transition-all"
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-2">
              <span className="text-xl mt-0.5">ℹ️</span>
              <p className="text-sm text-blue-800">
                Votre email doit être préalablement autorisé par le trésorier.<br />
                Si vous n'avez pas reçu d'autorisation, contactez le trésorier de l'AEDDI.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-lg"
              disabled={emailValidation.isChecking}
            >
              {emailValidation.isChecking && (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {emailValidation.isChecking ? 'Vérification...' : 'Vérifier l\'email'}
            </button>
          </form>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm text-gray-500 mt-6 text-center"
          >
            Déjà un compte ?{' '}
            <button
              type="button"
              onClick={(() => window.location.href = '/')}
              className="text-blue-600 hover:underline font-medium"
            >
              Se connecter
            </button>
          </motion.p>
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
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-center mb-6 text-blue-600"
      >
        Inscription Étudiant AEDDI
      </motion.h1>
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-green-600 text-white">
            1
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-blue-600 text-white">
            2
          </div>
        </div>
        <div className="flex justify-center space-x-4 mt-2 text-xs text-gray-500">
          <span>Email</span>
          <span>Formulaire</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informations personnelles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Prénom *
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Votre prénom"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="+261 XX XX XXX XX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo de profil
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
            />
          </motion.div>
        </div>
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations académiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Établissement *
              </label>
              <select
                name="etablissement"
                value={selectedEtablissement}
                onChange={handleEtablissementChange}
                className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
              >
                <option value="">Sélectionner un établissement</option>
                {Object.entries(etablissements).map(([key, etab]) => (
                  <option key={key} value={key}>{etab.nom}</option>
                ))}
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parcours *
              </label>
              <select
                name="parcours"
                value={selectedParcours}
                onChange={handleParcoursChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
                disabled={!selectedEtablissement}
              >
                <option value="">Sélectionner un parcours</option>
                {selectedEtablissement && etablissements[selectedEtablissement] && (
                  etablissements[selectedEtablissement].parcours.map(parc => (
                    <option key={parc} value={parc}>{parc}</option>
                  ))
                )}
              </select>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau d'étude *
              </label>
              <select
                name="niveau"
                value={formData.niveau}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
                disabled={!selectedParcours}
              >
                <option value="">Sélectionner un niveau</option>
                {getNiveauxOptions(selectedParcours).map(niveau => (
                  <option key={niveau} value={niveau}>{niveau}</option>
                ))}
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promotion *
              </label>
              <select
                name="promotion"
                value={formData.promotion}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
              >
                <option value="">Sélectionner une promotion</option>
                {getPromotionsOptions().map(promo => (
                  <option key={promo} value={promo}>{promo}</option>
                ))}
              </select>
            </motion.div>
          </div>
        </div>

        {/* Informations de logement */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Logement</h3>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-4"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de logement *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="logement"
                  value="campus"
                  checked={formData.logement === 'campus'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Campus
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="logement"
                  value="ville"
                  checked={formData.logement === 'ville'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Ville
              </label>
            </div>
          </motion.div>

          {formData.logement === 'campus' && (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de logement campus *
                </label>
                <select
                  name="campusType"
                  value={selectedCampusType}
                  onChange={handleCampusTypeChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  {Object.entries(optionsCampus).map(([key, type]) => (
                    <option key={key} value={key}>{type.nom}</option>
                  ))}
                </select>
              </motion.div>

              {selectedCampusType && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    {optionsCampus[selectedCampusType]?.nom} - Chambre *
                  </label>
                  <select
                    name="blocCampus"
                    value={formData.blocCampus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                    required
                  >
                    <option value="">Sélectionner une chambre</option>
                    {optionsCampus[selectedCampusType]?.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </motion.div>
              )}
            </div>
          )}

          {formData.logement === 'ville' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quartier *
              </label>
              <select
                name="quartier"
                value={formData.quartier}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
              >
                <option value="">Sélectionner un quartier</option>
                {quartiers.map(quartier => (
                  <option key={quartier} value={quartier}>{quartier}</option>
                ))}
              </select>
            </motion.div>
          )}
        </div>

        <div className="pb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  <strong>✅ Email validé !</strong> Votre code a été vérifié avec succès. Vous pouvez maintenant compléter votre inscription.
                </p>
              </div>
            </div>
          </div>
        </div>

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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
          </Button>
        </motion.div>
      </form>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-sm text-gray-500 mt-4 text-center"
      >
        Déjà un compte ?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin || (() => window.location.href = '/acceuil')}
          className="text-blue-600 hover:underline font-medium"
        >
          Se connecter
        </button>
      </motion.p>
    </motion.div>
  );
}
