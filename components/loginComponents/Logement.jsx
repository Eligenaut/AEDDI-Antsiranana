'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { url } from '../context/url.js';

export function Logement({ formData, handleChange }) {
  const [typesLogement, setTypesLogement] = useState([]);
  const [optionsCampus, setOptionsCampus] = useState([]);
  const [sections, setSections] = useState([]);
  const [blocs, setBlocs] = useState([]);
  const [quartiers, setQuartiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logementRes, quartierRes] = await Promise.all([
          fetch(`${url}data-register/types-logement`),
          fetch(`${url}data-register/quartiers`),
        ]);
        const logementData = await logementRes.json();
        const quartierData = await quartierRes.json();
        if (logementData.success) {
          setTypesLogement(logementData.data);
        }
        if (quartierData.success) {
          setQuartiers(quartierData.data);
        }
      } catch (e) {
        console.error('Erreur chargement logement:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTypeChange = (e) => {
    const value = e.target.value;
    handleChange({ target: { name: 'type_logement', value } });
    handleChange({ target: { name: 'option_campus', value: '' } });
    handleChange({ target: { name: 'section_campus', value: '' } });
    handleChange({ target: { name: 'bloc_campus', value: '' } });

    const type = typesLogement.find((t) => t.id === parseInt(value));
    setOptionsCampus(type?.options_campus || []);
    setSections([]);
    setBlocs([]);
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    handleChange({ target: { name: 'option_campus', value } });
    handleChange({ target: { name: 'section_campus', value: '' } });
    handleChange({ target: { name: 'bloc_campus', value: '' } });

    const option = optionsCampus.find((o) => o.id === parseInt(value));
    setSections(option?.sections || []);
    setBlocs([]);
  };

  const handleSectionChange = (e) => {
    const value = e.target.value;
    handleChange({ target: { name: 'section_campus', value } });
    handleChange({ target: { name: 'bloc_campus', value: '' } });

    const section = sections.find((s) => s.id === parseInt(value));
    setBlocs(section?.blocs || []);
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Logement</h3>

      {loading ? (
        <p className="text-gray-500 text-sm">Chargement des données...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de logement *</label>
              <select
                name="type_logement"
                value={formData.type_logement}
                onChange={handleTypeChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
              >
                <option value="">Sélectionner un type</option>
                {typesLogement.map((t) => (
                  <option key={t.id} value={t.id}>{t.nom}</option>
                ))}
              </select>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Option Campus *</label>
              <select
                name="option_campus"
                value={formData.option_campus}
                onChange={handleOptionChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                required
                disabled={!formData.type_logement}
              >
                <option value="">Sélectionner une option</option>
                {optionsCampus.map((o) => (
                  <option key={o.id} value={o.id}>{o.nom}</option>
                ))}
              </select>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Campus</label>
              <select
                name="section_campus"
                value={formData.section_campus}
                onChange={handleSectionChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                disabled={!formData.option_campus}
              >
                <option value="">Sélectionner une section</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>{s.nom}</option>
                ))}
              </select>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bloc Campus</label>
              <select
                name="bloc_campus"
                value={formData.bloc_campus}
                onChange={(e) => handleChange({ target: { name: 'bloc_campus', value: e.target.value } })}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                disabled={!formData.section_campus}
              >
                <option value="">Sélectionner un bloc</option>
                {blocs.map((b) => (
                  <option key={b.id} value={b.id}>{b.nom}</option>
                ))}
              </select>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
              <select
                name="quartier"
                value={formData.quartier}
                onChange={(e) => handleChange({ target: { name: 'quartier', value: e.target.value } })}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              >
                <option value="">Sélectionner un quartier</option>
                {quartiers.map((q) => (
                  <option key={q.id} value={q.id}>{q.nom}</option>
                ))}
              </select>
            </motion.div>

            <div />
          </div>
        </>
      )}
    </div>
  );
}
