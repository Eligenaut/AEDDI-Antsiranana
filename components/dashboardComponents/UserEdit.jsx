'use client';

import { useState, useEffect } from 'react';
import { getAuthHeaders } from '../context/headers';
import { url } from '../context/url';
import { etablissements, optionsCampus, quartiers, getNiveauxOptions, getPromotionsOptions } from '../loginComponents/DataRegister';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

function isFile(obj) {
  return typeof File !== 'undefined' && obj instanceof File;
}

const Alert = ({ type, message }) => (
  <div className={`p-4 border-l-4 ${type === 'success' ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700'}`}>
    {message}
  </div>
);

export default function UserEdit({ isOpen, onCancel = () => {}, onClose = () => {}, initialData = {}, onSave, showRole = false, userId = null }) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [notifyCloseOnExit, setNotifyCloseOnExit] = useState(false);
  const [closing, setClosing] = useState(false);
  const [formData, setFormData] = useState({
    role: initialData.role || 'member',
    sub_role: initialData.sub_role || '',
    nom: initialData.nom || '',
    prenom: initialData.prenom || '',
    email: initialData.email || '',
    telephone: initialData.telephone || '',
    etablissement: initialData.etablissement || '',
    parcours: initialData.parcours || '',
    niveau: initialData.niveau || '',
    promotion: initialData.promotion || '',
    logement: initialData.logement || 'campus',
    blocCampus: initialData.blocCampus || '',
    quartier: initialData.quartier || '',
    image: initialData.image || null
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedEtablissement, setSelectedEtablissement] = useState(formData.etablissement);
  const [selectedParcours, setSelectedParcours] = useState(formData.parcours);
  const [selectedCampusType, setSelectedCampusType] = useState('');
  const [imagePreview, setImagePreview] = useState(formData.image);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      setIsVisible(true);
      setNotifyCloseOnExit(false);
      setClosing(false);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, mounted]);

  // ✅ Protégé par mounted
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = isVisible ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isVisible, mounted]);

  useEffect(() => {
    if (formData.blocCampus) {
      const type = Object.keys(optionsCampus).find(key =>
        optionsCampus[key].options.includes(formData.blocCampus)
      );
      setSelectedCampusType(type || '');
    }
  }, [formData.blocCampus]);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEtablissementChange = e => {
    const value = e.target.value;
    setSelectedEtablissement(value);
    setSelectedParcours('');
    setFormData(prev => ({ ...prev, etablissement: value, parcours: '', niveau: '', promotion: '' }));
  };

  const handleParcoursChange = e => {
    const value = e.target.value;
    setSelectedParcours(value);
    setFormData(prev => ({ ...prev, parcours: value, niveau: '', promotion: '' }));
  };

  const handleCampusTypeChange = e => {
    const value = e.target.value;
    setSelectedCampusType(value);
    setFormData(prev => ({ ...prev, blocCampus: '' }));
  };

  const handleFileChange = e => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (formData.logement === 'campus' && !formData.blocCampus) {
      setError('Le champ "bloc campus" est requis lorsque le logement est campus.');
      return;
    }
    if (formData.logement === 'ville' && !formData.quartier) {
      setError('Le champ "quartier" est requis lorsque le logement est en ville.');
      return;
    }

    setSaving(true);
    try {
      const payload = { ...formData };
      if (payload.role !== 'bureau') delete payload.sub_role;

      if (isFile(payload.image)) {
        const toBase64 = file => new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.onerror = rej;
          reader.readAsDataURL(file);
        });
        const base64Image = await toBase64(payload.image);
        payload.image = base64Image;
        payload.imageName = formData.image.name;
        payload.imageType = formData.image.type;
      }

      const endpoint = userId ? `${url}members/${userId}` : `${url}auth/me`;
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Erreur lors de la mise à jour');

      setSuccess('Profil mis à jour avec succès');
      if (onSave) onSave(data.data || payload);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Erreur de mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const resetFormState = () => {
    setFormData({ ...initialData });
    setError('');
    setSuccess('');
    setSelectedEtablissement(initialData.etablissement || '');
    setSelectedParcours(initialData.parcours || '');
    setSelectedCampusType('');
    setImagePreview(initialData.image || null);
  };

  const handleClose = () => {
    if (saving || closing) return;
    setClosing(true);
    setNotifyCloseOnExit(true);
    setIsVisible(false);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        if (notifyCloseOnExit) {
          resetFormState();
          onCancel();
          onClose();
          setNotifyCloseOnExit(false);
        }
        setClosing(false);
      }}
    >
      {isVisible && (
        <>
          <motion.div className="fixed inset-0 bg-black/30 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={handleClose} />
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Modifier le profil</h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-6 space-y-6">
              {success && <Alert type="success" message={success} />}
              {error && <Alert type="error" message={error} />}
              <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input type="text" name="nom" value={formData.nom} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                  </div>

                  {showRole && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rôle *</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400">
                          <option value="member">Membre</option>
                          <option value="bureau">Bureau</option>
                        </select>
                      </div>
                      {formData.role === 'bureau' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sous-rôle *</label>
                          <select name="sub_role" value={formData.sub_role || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400">
                            <option value="">Sélectionner un sous-rôle</option>
                            {Object.entries(SUB_ROLE_LABELS).map(([key, label]) => (
                              <option key={key} value={key}>{label}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                    {imagePreview && <img src={imagePreview} alt="Aperçu" className="mt-2 h-20 w-20 rounded-full object-cover border" />}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <button type="button" onClick={handleClose} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    {saving ? 'Mise à jour...' : 'Mettre à jour'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}