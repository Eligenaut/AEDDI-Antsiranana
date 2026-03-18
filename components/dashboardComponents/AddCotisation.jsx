'use client';
import { useEffect, useState } from 'react';
import { X, DollarSign, Calendar, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import Notiflix from 'notiflix';

export function AddCotisation({ isOpen, onClose, onSubmit, initialValues }) {
  const [mounted, setMounted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    montant: '',
    date_debut: '',
    date_fin: '',
    statut: 'en_cours',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (initialValues?.id) {
      fetchCotisationById(initialValues.id);
    } else {
      resetForm();
    }
  }, [initialValues, isOpen]);

  useEffect(() => {
    if (formData.statut === 'en_attente') {
      const dateDebut = new Date(formData.date_debut);
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);
      if (!formData.date_debut || dateDebut <= aujourdhui) {
        setFormData(prev => ({ ...prev, statut: 'en_cours' }));
      }
    }
  }, [formData.date_debut]);

  const fetchCotisationById = async (id) => {
    setLoadingData(true);
    try {
      const response = await axios.get(`${url}cotisations/${id}`, {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        const c = response.data.data;
        setFormData({
          nom:         c.nom         || '',
          description: c.description || '',
          montant:     c.montant?.toString() || '',
          date_debut:  c.date_debut  || '',
          date_fin:    c.date_fin    || '',
          statut:      c.statut      || 'en_cours',
        });
      }
    } catch (err) {
      Notiflix.Notify.failure('Erreur lors du chargement de la cotisation');
    } finally {
      setLoadingData(false);
    }
  };

  const resetForm = () => {
    setFormData({ nom: '', description: '', montant: '', date_debut: '', date_fin: '', statut: 'en_cours' });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim())         newErrors.nom         = 'Le nom est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.montant || parseFloat(formData.montant) <= 0)
      newErrors.montant = 'Le montant doit être supérieur à 0';
    if (!formData.date_debut) newErrors.date_debut = 'La date de début est requise';
    if (!formData.date_fin)   newErrors.date_fin   = 'La date de fin est requise';
    if (formData.date_debut && formData.date_fin && new Date(formData.date_debut) >= new Date(formData.date_fin))
      newErrors.date_fin = 'La date de fin doit être postérieure à la date de début';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        nom:         formData.nom.trim(),
        description: formData.description.trim(),
        montant:     parseFloat(formData.montant),
        date_debut:  formData.date_debut,
        date_fin:    formData.date_fin,
        statut:      formData.statut,
      };

      const headers = getAuthHeaders();
      let response;

      if (initialValues?.id) {
        response = await axios.put(`${url}cotisations/${initialValues.id}`, payload, { headers });
      } else {
        response = await axios.post(`${url}cotisations`, payload, { headers });
      }

      if (response.data.success) {
        Notiflix.Notify.success(`Cotisation ${initialValues ? 'modifiée' : 'créée'} avec succès !`);
        onSubmit(response.data.data || {});
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
      resetForm();
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
            className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white shadow-2xl z-[10000] flex flex-col overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold">
                {initialValues ? 'Modifier la cotisation' : 'Nouvelle cotisation'}
              </h2>
              <button onClick={handleClose} className="hover:bg-white/20 p-2 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SPINNER chargement données */}
            {loadingData ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin text-green-500" />
                <p className="text-sm font-medium">Chargement des données...</p>
              </div>
            ) : (
              /* FORM */
              <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">

                {/* ── Nom ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={e => handleInputChange('nom', e.target.value)}
                    placeholder="Ex: Cotisation Annuelle 2026"
                    className={`w-full px-3 py-2 text-black border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${errors.nom ? 'border-red-300' : 'border-gray-300'}`}
                    disabled={isSubmitting}
                  />
                  {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                </div>

                {/* ── Description ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    rows={3}
                    placeholder="Description détaillée..."
                    className={`w-full px-3 py-2 border text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                    disabled={isSubmitting}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* ── Montant ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Montant (AR) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.montant}
                      onChange={e => handleInputChange('montant', e.target.value)}
                      min="0.01"
                      step="any"
                      placeholder="Ex: 50000"
                      className={`w-full pl-10 pr-3 py-2 text-black border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${errors.montant ? 'border-red-300' : 'border-gray-300'}`}
                      disabled={isSubmitting}
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.montant && <p className="text-red-500 text-xs mt-1">{errors.montant}</p>}
                </div>

                {/* ── Dates ── */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Date début *
                    </label>
                    <input
                      type="date"
                      value={formData.date_debut}
                      onChange={e => handleInputChange('date_debut', e.target.value)}
                      className={`w-full px-3 py-2 text-black border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${errors.date_debut ? 'border-red-300' : 'border-gray-300'}`}
                      disabled={isSubmitting}
                    />
                    {errors.date_debut && <p className="text-red-500 text-xs mt-1">{errors.date_debut}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Date fin *
                    </label>
                    <input
                      type="date"
                      value={formData.date_fin}
                      onChange={e => handleInputChange('date_fin', e.target.value)}
                      className={`w-full px-3 py-2 text-black border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${errors.date_fin ? 'border-red-300' : 'border-gray-300'}`}
                      disabled={isSubmitting}
                    />
                    {errors.date_fin && <p className="text-red-500 text-xs mt-1">{errors.date_fin}</p>}
                  </div>
                </div>

                {/* ── Statut ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.statut}
                    onChange={e => handleInputChange('statut', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg text-black px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="en_cours">🟢 En cours</option>
                    <option value="terminee">⚫ Terminée</option>
                    {formData.date_debut && new Date(formData.date_debut) > new Date() && (
                      <option value="en_attente">🟡 En attente</option>
                    )}
                    <option value="annulee">🔴 Annulée</option>
                  </select>
                </div>

                {/* ── Boutons ── */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg hover:opacity-90 flex items-center gap-2 transition text-sm disabled:opacity-50 font-semibold shadow"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{initialValues ? 'Mise à jour...' : 'Création...'}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{initialValues ? 'Mettre à jour' : 'Créer'}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}