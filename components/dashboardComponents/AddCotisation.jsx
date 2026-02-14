'use client';
import { useEffect, useState } from 'react';
import { X, DollarSign, Calendar, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export function AddCotisation({ isOpen, onClose, onSubmit, initialValues }) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    montant: '',
    date_debut: '',
    date_fin: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        nom: initialValues.nom || '',
        description: initialValues.description || '',
        montant: initialValues.montant?.toString() || '',
        date_debut: initialValues.date_debut || '',
        date_fin: initialValues.date_fin || ''
      });
    } else {
      setFormData({ nom: '', description: '', montant: '', date_debut: '', date_fin: '' });
    }
  }, [initialValues, isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.montant || parseFloat(formData.montant) <= 0) newErrors.montant = 'Le montant doit être supérieur à 0';
    if (!formData.date_debut) newErrors.date_debut = 'La date de début est requise';
    if (!formData.date_fin) newErrors.date_fin = 'La date de fin est requise';
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
      await new Promise(r => setTimeout(r, 1000)); // simulate API delay
      onSubmit({
        nom: formData.nom.trim(),
        description: formData.description.trim(),
        montant: parseFloat(formData.montant),
        date_debut: formData.date_debut,
        date_fin: formData.date_fin
      });
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ nom: '', description: '', montant: '', date_debut: '', date_fin: '' });
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
            className="fixed inset-0 z-[9999] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* PANEL */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-[10000] overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {initialValues ? 'Mettre à jour la cotisation' : 'Nouvelle Cotisation'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {initialValues ? 'Modifier les informations de la cotisation' : 'Ajouter une nouvelle cotisation'}
                  </p>
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

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={e => handleInputChange('nom', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.nom ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Ex: Cotisation Annuelle 2024"
                  disabled={isSubmitting}
                />
                {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Description détaillée..."
                  disabled={isSubmitting}
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant (AR) *</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.montant}
                    onChange={e => handleInputChange('montant', e.target.value)}
                    min="0"
                    step="100"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.montant ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.montant && <p className="mt-1 text-sm text-red-600">{errors.montant}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.date_debut}
                      onChange={e => handleInputChange('date_debut', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.date_debut ? 'border-red-300' : 'border-gray-300'}`}
                      disabled={isSubmitting}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.date_debut && <p className="mt-1 text-sm text-red-600">{errors.date_debut}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin *</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.date_fin}
                      onChange={e => handleInputChange('date_fin', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.date_fin ? 'border-red-300' : 'border-gray-300'}`}
                      disabled={isSubmitting}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.date_fin && <p className="mt-1 text-sm text-red-600">{errors.date_fin}</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
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
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
