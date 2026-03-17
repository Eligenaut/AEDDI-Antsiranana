'use client';
import { useEffect, useRef, useState } from 'react';
import { X, Loader2, Save, MapPin, ImageIcon, Calendar, Trash2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import Notiflix from 'notiflix';

const CATEGORIES = [
  { value: 'Sport',     emoji: '⚽', label: 'Sport' },
  { value: 'Culture',   emoji: '🎭', label: 'Culture' },
  { value: 'Formation', emoji: '🎓', label: 'Formation' },
  { value: 'Autre',     emoji: '📌', label: 'Autre' },
];

export function AddActivite({ isOpen, onClose, onSubmit, initialValues }) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    statut: 'en_cours',
    lieu: '',
    categorie: 'Autre',
  });
  const [imageFile, setImageFile] = useState(null);       // fichier sélectionné
  const [imagePreview, setImagePreview] = useState('');   // URL d'aperçu local ou existante
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        nom:         initialValues.nom         || '',
        description: initialValues.description || '',
        dateDebut:   initialValues.date_debut  || '',
        dateFin:     initialValues.date_fin    || '',
        statut:      initialValues.statut      || 'en_cours',
        lieu:        initialValues.lieu        || '',
        categorie:   initialValues.categorie   || 'Autre',
      });
      setImagePreview(initialValues.image || '');
      setImageFile(null);
    } else {
      resetForm();
    }
  }, [initialValues, isOpen]);

  const resetForm = () => {
    setFormData({ nom: '', description: '', dateDebut: '', dateFin: '', statut: 'en_cours', lieu: '', categorie: 'Autre' });
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Sélection d'image depuis la galerie
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim())         newErrors.nom         = 'Le nom est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.dateDebut)          newErrors.dateDebut   = 'Date de début requise';
    if (!formData.dateFin)            newErrors.dateFin     = 'Date de fin requise';
    if (!formData.lieu.trim())        newErrors.lieu        = 'Le lieu est requis';
    if (formData.dateDebut && formData.dateFin && new Date(formData.dateDebut) > new Date(formData.dateFin))
      newErrors.dateFin = 'La date de fin doit être après la date de début';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // FormData pour envoyer le fichier image en multipart
      const data = new FormData();
      data.append('nom',         formData.nom.trim());
      data.append('description', formData.description.trim());
      data.append('date_debut',  formData.dateDebut);
      data.append('date_fin',    formData.dateFin);
      data.append('statut',      formData.statut);
      data.append('lieu',        formData.lieu.trim());
      data.append('categorie',   formData.categorie);
      if (imageFile) {
        data.append('image', imageFile);
      }

      // Ne pas forcer Content-Type : axios le définit automatiquement avec le boundary
      const headers = getAuthHeaders();
      delete headers['Content-Type'];

      const response = initialValues?.id
        ? await axios.put(`${url}activites/${initialValues.id}`, data, { headers })
        : await axios.post(`${url}activites`, data, { headers });

      if (response.data.success) {
        Notiflix.Notify.success(`Activité ${initialValues ? 'modifiée' : 'créée'} avec succès !`);
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
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold">
                {initialValues ? "Modifier l'activité" : "Nouvelle activité"}
              </h2>
              <button onClick={handleClose} className="hover:bg-white/20 p-2 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">

              {/* ── Image upload ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Image
                </label>

                {imagePreview ? (
                  <div className="relative h-44 rounded-xl overflow-hidden border border-gray-200 group">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay au hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                      >
                        <Upload className="w-3.5 h-3.5" /> Changer
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Supprimer
      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-purple-400 hover:text-purple-500 hover:bg-purple-50 transition-all"
                  >
                    <Upload className="w-7 h-7" />
                    <span className="text-sm font-medium">Choisir depuis la galerie</span>
                    <span className="text-xs">JPG, PNG, WEBP</span>
                  </button>
                )}

                {/* Input fichier caché */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* ── Nom ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Ex : Tournoi Inter-Associations"
                  className={`w-full px-3 py-2 text-black border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${errors.nom ? 'border-red-300' : 'border-gray-300'}`}
                  disabled={isSubmitting}
                />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
              </div>

              {/* ── Description ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  placeholder="Décrivez l'activité..."
                  className={`w-full px-3 py-2 border text-black rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                  disabled={isSubmitting}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* ── Dates ── */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Date début *
                  </label>
                  <input
                    type="date"
                    value={formData.dateDebut}
                    onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                    className={`w-full px-3 py-2 text-black border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${errors.dateDebut ? 'border-red-300' : 'border-gray-300'}`}
                    disabled={isSubmitting}
                  />
                  {errors.dateDebut && <p className="text-red-500 text-xs mt-1">{errors.dateDebut}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Date fin *
                  </label>
                  <input
                    type="date"
                    value={formData.dateFin}
                    onChange={(e) => handleInputChange('dateFin', e.target.value)}
                    className={`w-full px-3 py-2 text-black border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${errors.dateFin ? 'border-red-300' : 'border-gray-300'}`}
                    disabled={isSubmitting}
                  />
                  {errors.dateFin && <p className="text-red-500 text-xs mt-1">{errors.dateFin}</p>}
                </div>
              </div>

              {/* ── Lieu ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Lieu *
                </label>
                <input
                  type="text"
                  value={formData.lieu}
                  onChange={(e) => handleInputChange('lieu', e.target.value)}
                  placeholder="Ex : Stade Municipal de Diego-Suarez"
                  className={`w-full px-3 py-2 text-black border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${errors.lieu ? 'border-red-300' : 'border-gray-300'}`}
                  disabled={isSubmitting}
                />
                {errors.lieu && <p className="text-red-500 text-xs mt-1">{errors.lieu}</p>}
              </div>

              {/* ── Catégorie + Statut ── */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => handleInputChange('categorie', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg text-black px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.emoji} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.statut}
                    onChange={(e) => handleInputChange('statut', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg text-black px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="en_cours">🟢 En cours</option>
                    <option value="terminee">⚫ Terminée</option>
                  </select>
                </div>
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
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 flex items-center gap-2 transition text-sm disabled:opacity-50 font-semibold shadow"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{initialValues ? 'Mise à jour...' : 'Création...'}</span>
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