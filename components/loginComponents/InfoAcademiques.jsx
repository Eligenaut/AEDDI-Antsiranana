'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { url } from '../context/url.js';

export function InfoAcademiques({ formData, handleChange }) {
  const [etablissements, setEtablissements] = useState([]);
  const [parcours, setParcours] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [etabRes, promRes] = await Promise.all([
          fetch(`${url}data-register/etablissements`),
          fetch(`${url}data-register/promotions`),
        ]);
        const etabData = await etabRes.json();
        const promData = await promRes.json();
        if (etabData.success) {
          setEtablissements(etabData.data);
        }
        if (promData.success) {
          setPromotions(promData.data);
        }
      } catch (e) {
        console.error('Erreur chargement données inscription:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEtablissementChange = (e) => {
    const value = e.target.value;
    handleChange({ target: { name: 'etablissement', value } });
    handleChange({ target: { name: 'parcours', value: '' } });
    handleChange({ target: { name: 'niveau', value: '' } });

    const etab = etablissements.find((e) => e.id === parseInt(value));
    setParcours(etab?.parcours || []);
    setNiveaux([]);
  };

  const handleParcoursChange = (e) => {
    const value = e.target.value;
    handleChange({ target: { name: 'parcours', value } });
    handleChange({ target: { name: 'niveau', value: '' } });

    const parc = parcours.find((p) => p.id === parseInt(value));
    setNiveaux(parc?.niveaux || []);
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations académiques</h3>

      {loading ? (
        <p className="text-gray-500 text-sm">Chargement des données...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Établissement *</label>
              <select
                value={formData.etablissement}
                onChange={handleEtablissementChange}
                className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
              >
                <option value="">Sélectionner un établissement</option>
                {etablissements.map((etab) => (
                  <option key={etab.id} value={etab.id}>{etab.nom}</option>
                ))}
              </select>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parcours *</label>
              <select
                value={formData.parcours}
                onChange={handleParcoursChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
                disabled={!formData.etablissement}
              >
                <option value="">Sélectionner un parcours</option>
                {parcours.map((p) => (
                  <option key={p.id} value={p.id}>{p.nom}</option>
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
                onChange={(e) => handleChange({ target: { name: 'niveau', value: e.target.value } })}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
                disabled={!formData.parcours}
              >
                <option value="">Sélectionner un niveau</option>
                {niveaux.map((n) => (
                  <option key={n.id} value={n.id}>{n.nom}</option>
                ))}
              </select>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Promotion *</label>
              <select
                name="promotion"
                value={formData.promotion}
                onChange={(e) => handleChange({ target: { name: 'promotion', value: e.target.value } })}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
              >
                <option value="">Sélectionner une promotion</option>
                {promotions.map((p) => (
                  <option key={p.id} value={p.id}>{p.nom}</option>
                ))}
              </select>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
