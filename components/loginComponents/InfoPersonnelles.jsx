'use client';

import { motion } from 'framer-motion';

export function InfoPersonnelles({ formData, handleChange, handleFileChange, handleEmailCheck, emailValidation, setEmailValidation }) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Informations personnelles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Nom *</label>
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

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Prénom *</label>
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
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                handleChange(e);
                setEmailValidation({ isValid: false, isChecking: false });
              }}
              placeholder="exemple@email.com"
              className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all ${
                emailValidation.isValid
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              disabled={emailValidation.isChecking || !formData.email.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              {emailValidation.isChecking ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : emailValidation.isValid ? '✅ Vérifié' : 'Vérifier'}
            </button>
          </div>
          {emailValidation.isValid && (
            <p className="mt-1 text-sm text-green-600 font-medium">✅ Email autorisé !</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
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

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
        />
      </motion.div>
    </div>
  );
}