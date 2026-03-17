'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { etablissements, getNiveauxOptions, getPromotionsOptions } from './DataRegister';

export function InfoAcademiques({ formData, handleChange }) {
  const [selectedEtablissement, setSelectedEtablissement] = useState('');
  const [selectedParcours, setSelectedParcours] = useState('');

  const handleEtablissementChange = (e) => {
    const value = e.target.value;
    setSelectedEtablissement(value);
    setSelectedParcours('');
    handleChange({ target: { name: 'etablissement', value } });
    handleChange({ target: { name: 'parcours', value: '' } });
  };

  const handleParcoursChange = (e) => {
    const value = e.target.value;
    setSelectedParcours(value);
    handleChange({ target: { name: 'parcours', value } });
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations académiques</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Établissement *</label>
          <select
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

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Parcours *</label>
          <select
            value={selectedParcours}
            onChange={handleParcoursChange}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
            required
            disabled={!selectedEtablissement}
          >
            <option value="">Sélectionner un parcours</option>
            {selectedEtablissement && etablissements[selectedEtablissement]?.parcours.map(parc => (
              <option key={parc} value={parc}>{parc}</option>
            ))}
          </select>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Niveau d'étude *</label>
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

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Promotion *</label>
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
  );
}