'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Calendar, FileText, Save, Loader2, Play } from 'lucide-react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import Notiflix from 'notiflix';

export function AddActivite({ isOpen, onClose, onSubmit, initialValues }) {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    statut: 'en_cours',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  useEffect(() => {
    if (initialValues) {
      setFormData({
        nom: initialValues.nom || '',
        description: initialValues.description || '',
        dateDebut: initialValues.date_debut || '',
        dateFin: initialValues.date_fin || '',
        statut: initialValues.statut || '',
      });
    } else {
      setFormData({
        nom: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        statut: 'en_cours',
      });
    }
  }, [initialValues, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.dateDebut) {
      newErrors.dateDebut = 'La date de début est requise';
    }

    if (!formData.dateFin) {
      newErrors.dateFin = 'La date de fin est requise';
    }

    if (formData.dateDebut && formData.dateFin && new Date(formData.dateDebut) >= new Date(formData.dateFin)) {
      newErrors.dateFin = 'La date de fin doit être postérieure à la date de début';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let response;
      if (initialValues && initialValues.id) {
        response = await axios.put(`${url}activites/${initialValues.id}`, {
          nom: formData.nom.trim(),
          description: formData.description.trim(),
          date_debut: formData.dateDebut,
          date_fin: formData.dateFin,
          statut: formData.statut
        }, {
          headers: getAuthHeaders()
        });
      } else {
        response = await axios.post(`${url}activites`, {
          nom: formData.nom.trim(),
          description: formData.description.trim(),
          date_debut: formData.dateDebut,
          date_fin: formData.dateFin,
          statut: formData.statut
        }, {
          headers: getAuthHeaders()
        });
      }

      if (response.data.success) {
        Notiflix.Notify.success('Activité ' + (initialValues ? 'modifiée' : 'créée') + ' avec succès !');
        onSubmit({
          nom: formData.nom.trim(),
          description: formData.description.trim(),
          dateDebut: formData.dateDebut,
          dateFin: formData.dateFin,
          statut: formData.statut
        });
        setFormData({
          nom: '',
          description: '',
          dateDebut: '',
          dateFin: '',
          statut: 'en_cours',
        });
        setErrors({});
        onClose();
      } else {
        Notiflix.Notify.failure('Erreur lors de la ' + (initialValues ? 'modification' : 'création') + ' de l\'activité');
        setErrors({ general: 'Erreur lors de la ' + (initialValues ? 'modification' : 'création') + ' de l\'activité' });
      }

    } catch (error) {
      console.error('Erreur lors de la ' + (initialValues ? 'modification' : 'création') + ' de l\'activité:', error);
      if (error.response?.data?.message) {
        Notiflix.Notify.failure(error.response.data.message);
        setErrors({ general: error.response.data.message });
      } else {
        Notiflix.Notify.failure('Erreur lors de la ' + (initialValues ? 'modification' : 'création') + ' de l\'activité');
        setErrors({ general: 'Erreur lors de la ' + (initialValues ? 'modification' : 'création') + ' de l\'activité' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        nom: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        statut: 'en_cours'
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <>
      {mounted && isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{initialValues ? 'Mettre à jour l\'activité' : 'Nouvelle Activité'}</h2>
                    <p className="text-sm text-gray-500">{initialValues ? 'Modifier les informations de l\'activité' : 'Ajouter une nouvelle activité'}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'activité *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.nom ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Formation React Avancé"
                    disabled={isSubmitting}
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Description détaillée de l'activité..."
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="dateDebut"
                        value={formData.dateDebut}
                        onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.dateDebut ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.dateDebut && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateDebut}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="dateFin"
                        value={formData.dateFin}
                        onChange={(e) => handleInputChange('dateFin', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.dateFin ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.dateFin && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateFin}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    id="statut"
                    value={formData.statut}
                    onChange={e => handleInputChange('statut', e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                    disabled={isSubmitting}
                  >
                    <option value="en_cours">En cours</option>
                    <option value="terminee">Terminée</option>
                  </select>
                  {errors.statut && <p className="text-red-600 text-xs mt-1">{errors.statut}</p>}
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{initialValues ? 'Mise à jour...' : 'Création...'}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{initialValues ? 'Mettre à jour' : 'Créer l\'activité'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
