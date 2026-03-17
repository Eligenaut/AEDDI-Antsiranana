'use client';

import { motion } from 'framer-motion';
import { quartiers, optionsCampus } from './DataRegister';
import { useState } from 'react';

export function Logement({ formData, handleChange }) {
  const [selectedCampusType, setSelectedCampusType] = useState('');

  const handleCampusTypeChange = (e) => {
    setSelectedCampusType(e.target.value);
    handleChange({ target: { name: 'blocCampus', value: '' } });
  };

  return (
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
          <label className="flex items-center cursor-pointer">
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
          <label className="flex items-center cursor-pointer">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
  );
}