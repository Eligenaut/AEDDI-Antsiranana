'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { url } from '../context/url.js';

export function Logement({ formData, handleChange }) {
  const [typesLogement, setTypesLogement] = useState([]);
  const [quartiers, setQuartiers] = useState([]);

  const [sections, setSections] = useState([]);
  const [blocs, setBlocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const campusType = typesLogement.find(
    (t) => t.nom.toLowerCase() === 'campus'
  );

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

  const campusOptions =
    campusType && Array.isArray(campusType.options_campus)
      ? campusType.options_campus
      : typesLogement.flatMap(
          (t) => t.options_campus || []
        );

  const handleCampusSelect = (e) => {
    const value = e.target.value;
    handleChange({ target: { name: 'option_campus', value } });
    handleChange({ target: { name: 'section_campus', value: '' } });
    handleChange({ target: { name: 'bloc_campus', value: '' } });

    const option = campusOptions.find((o) => o.id === parseInt(value));
    setSections(option?.sections || []);
    setBlocs([]);
  };

  const handleSectionSelect = (e) => {
    const value = e.target.value;
    handleChange({ target: { name: 'section_campus', value } });
    handleChange({ target: { name: 'bloc_campus', value: '' } });

    const section = sections.find((s) => s.id === parseInt(value));
    setBlocs(section?.blocs || []);
  };

  const handleCampusToggle = (checked) => {
    handleChange({ target: { name: 'hasCampusLogement', value: checked } });
    if (!checked) {
      handleChange({ target: { name: 'type_logement', value: '' } });
      handleChange({ target: { name: 'option_campus', value: '' } });
      handleChange({ target: { name: 'section_campus', value: '' } });
      handleChange({ target: { name: 'bloc_campus', value: '' } });
      setSections([]);
      setBlocs([]);
    } else {
      handleChange({ target: { name: 'type_logement', value: String(campusType?.id || '') } });
    }
  };

  if (loading) {
    return (
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Logement</h3>
        <p className="text-gray-500 text-sm">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 pb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Logement</h3>

      {/* ─── Checkbox Logement Campus ─── */}
      <label className="flex items-center gap-3 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
        <input
          type="checkbox"
          checked={formData.hasCampusLogement || false}
          onChange={(e) => handleCampusToggle(e.target.checked)}
          className="w-5 h-5 accent-blue-600"
        />
        <span className="text-sm font-medium text-blue-800">
          🏠 Logement Campus
        </span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ─── Logement Campus (conditionnel) ─── */}
        <AnimatePresence>
          {formData.hasCampusLogement && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="border border-blue-200 rounded-xl p-4 bg-blue-50"
            >
              <h4 className="font-semibold text-blue-800 mb-3">Logement Campus</h4>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campus / Résidence
              </label>
              <select
                name="option_campus"
                value={formData.option_campus}
                onChange={handleCampusSelect}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all mb-3"
              >
                <option value="">Sélectionner</option>
                {campusOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.nom}</option>
                ))}
              </select>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bâtiment
              </label>
              <select
                name="section_campus"
                value={formData.section_campus}
                onChange={handleSectionSelect}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all mb-3"
                disabled={!formData.option_campus}
              >
                <option value="">Sélectionner</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>{s.nom}</option>
                ))}
              </select>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Porte / Chambre
              </label>
              <select
                name="bloc_campus"
                value={formData.bloc_campus}
                onChange={(e) => handleChange({ target: { name: 'bloc_campus', value: e.target.value } })}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                disabled={!formData.section_campus}
              >
                <option value="">Sélectionner</option>
                {blocs.map((b) => (
                  <option key={b.id} value={b.id}>{b.nom}</option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Logement Ville (toujours visible) ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`border rounded-xl p-4 ${
            formData.hasCampusLogement
              ? 'border-green-200 bg-green-50'
              : 'border-green-300 bg-green-50 md:col-span-2'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-green-800">🏙️ Logement en Ville</span>
            <span className="text-xs text-red-500 font-medium">* Obligatoire</span>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quartier
          </label>
          <select
            name="quartier"
            value={formData.quartier}
            onChange={(e) => handleChange({ target: { name: 'quartier', value: e.target.value } })}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
            required
          >
            <option value="">Sélectionner un quartier</option>
            {quartiers.map((q) => (
              <option key={q.id} value={q.id}>{q.nom}</option>
            ))}
          </select>
        </motion.div>
      </div>
    </div>
  );
}
