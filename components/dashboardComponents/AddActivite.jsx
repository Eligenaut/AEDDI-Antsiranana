'use client';
import { useEffect, useState } from 'react';
import { X, Loader2, Calendar, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import Notiflix from 'notiflix';

export function AddActivite({ isOpen, onClose, onSubmit, initialValues }) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    statut: 'en_cours',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        nom: initialValues.nom || '',
        description: initialValues.description || '',
        dateDebut: initialValues.date_debut || '',
        dateFin: initialValues.date_fin || '',
        statut: initialValues.statut || 'en_cours',
      });
    } else {
      setFormData({ nom: '', description: '', dateDebut: '', dateFin: '', statut: 'en_cours' });
    }
  }, [initialValues, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.dateDebut) newErrors.dateDebut = 'Date de début requise';
    if (!formData.dateFin) newErrors.dateFin = 'Date de fin requise';
    if (formData.dateDebut && formData.dateFin && new Date(formData.dateDebut) >= new Date(formData.dateFin))
      newErrors.dateFin = 'La date de fin doit être après la date de début';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        nom: formData.nom.trim(),
        description: formData.description.trim(),
        date_debut: formData.dateDebut,
        date_fin: formData.dateFin,
        statut: formData.statut,
      };

      const response = initialValues?.id
        ? await axios.put(`${url}activites/${initialValues.id}`, payload, { headers: getAuthHeaders() })
        : await axios.post(`${url}activites`, payload, { headers: getAuthHeaders() });

      if (response.data.success) {
        Notiflix.Notify.success(`Activité ${initialValues ? 'modifiée' : 'créée'} avec succès !`);
        onSubmit(payload);
        handleClose();
      } else {
        Notiflix.Notify.failure('Erreur lors de la création/modification');
      }
    } catch (err) {
      Notiflix.Notify.failure(err.response?.data?.message || 'Erreur lors de la création/modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ nom: '', description: '', dateDebut: '', dateFin: '', statut: 'en_cours' });
      setErrors({});
      onClose();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-[9999]"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* PANEL */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-[10000] flex flex-col overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 text-white flex items-center justify-between">
              <h2 className="text-xl font-bold">{initialValues ? "Modifier l'activité" : "Nouvelle activité"}</h2>
              <button onClick={handleClose} className="hover:bg-white/20 p-2 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.nom ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.nom && <p className="text-red-600 text-sm mt-1">{errors.nom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date de début *</label>
                  <input
                    type="date"
                    value={formData.dateDebut}
                    onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.dateDebut ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.dateDebut && <p className="text-red-600 text-sm mt-1">{errors.dateDebut}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date de fin *</label>
                  <input
                    type="date"
                    value={formData.dateFin}
                    onChange={(e) => handleInputChange('dateFin', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.dateFin ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.dateFin && <p className="text-red-600 text-sm mt-1">{errors.dateFin}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Statut</label>
                <select
                  value={formData.statut}
                  onChange={(e) => handleInputChange('statut', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  disabled={isSubmitting}
                >
                  <option value="en_cours">En cours</option>
                  <option value="terminee">Terminée</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{initialValues ? "Mise à jour..." : "Création..."}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{initialValues ? "Mettre à jour" : "Créer l'activité"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
