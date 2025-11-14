'use client';

import { useState, useEffect } from 'react';
import { getAuthHeaders } from '../context/headers';
import { url } from '../context/url';
import { etablissements, optionsCampus, quartiers, getNiveauxOptions, getPromotionsOptions } from '../loginComponents/DataRegister';
import { ROLES, SUB_ROLES, SUB_ROLE_LABELS } from '../context/roles';

function isFile(obj) {
  return typeof File !== 'undefined' && obj instanceof File;
}

const Alert = ({ type, message }) => (
  <div
    className={`p-4 border-l-4 ${
      type === 'success'
        ? 'bg-green-50 border-green-400 text-green-700'
        : 'bg-red-50 border-red-400 text-red-700'
    }`}
  >
    {message}
  </div>
);

export default function UserEdit({
  initialData,
  onSave: onSaveCallback,
  onCancel,
  showRole = false,
  userId = null
}) {
  const [formData, setFormData] = useState(() => ({
    ...initialData,
    role: initialData?.role || 'member',
    sub_role: initialData?.sub_role || '',
    nom: initialData?.nom || '',
    prenom: initialData?.prenom || '',
    email: initialData?.email || '',
    telephone: initialData?.telephone || '',
    etablissement: initialData?.etablissement || '',
    parcours: initialData?.parcours || '',
    niveau: initialData?.niveau || '',
    promotion: initialData?.promotion || '',
    logement: initialData?.logement || 'campus',
    blocCampus: initialData?.blocCampus || '',
    quartier: initialData?.quartier || '',
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedEtablissement, setSelectedEtablissement] = useState('');
  const [selectedParcours, setSelectedParcours] = useState('');
  const [selectedCampusType, setSelectedCampusType] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // useEffect d'init du formData (ajout sécurité sub_role)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        sub_role: initialData.sub_role || '',
      });
      if (initialData.image && typeof initialData.image === 'string') {
        setImagePreview(initialData.image);
      }
      if (initialData.etablissement) setSelectedEtablissement(initialData.etablissement);
      if (initialData.parcours) setSelectedParcours(initialData.parcours);
      if (initialData.blocCampus) {
        const campusType = Object.keys(optionsCampus).find(key =>
          optionsCampus[key].options.includes(initialData.blocCampus)
        ) || '';
        setSelectedCampusType(campusType);
      }
    }
  }, [initialData]);

  // Ajout pour gestion automatique du sub_role
  useEffect(() => {
    if (formData.role !== 'bureau' && formData.sub_role) {
      setFormData(prev => {
        const copy = { ...prev };
        delete copy.sub_role;
        return copy;
      });
    }
  }, [formData.role]);

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEtablissementChange = (e) => {
    const value = e.target.value;
    setSelectedEtablissement(value);
    setSelectedParcours('');
    setFormData(prev => ({
      ...prev,
      etablissement: value,
      parcours: '',
      niveau: '',
      promotion: '',
    }));
  };

  const handleParcoursChange = (e) => {
    const value = e.target.value;
    setSelectedParcours(value);
    setFormData(prev => ({
      ...prev,
      parcours: value,
      niveau: '',
      promotion: '',
    }));
  };

  const handleCampusTypeChange = (e) => {
    const value = e.target.value;
    setSelectedCampusType(value);
    setFormData(prev => ({ ...prev, blocCampus: '' }));
  };

  const handleFileChange = (e) => {
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
    if (formData.logement === 'campus' && !formData.blocCampus) {
      setError('Le champ "bloc campus" est requis lorsque le logement est campus.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let payload = { ...formData };

      const { id, created_at, updated_at, avatar, profile_image, ...cleanPayload } = payload;
      
      if (isFile(formData.image)) {
        const toBase64 = (file) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });
        const base64Image = await toBase64(formData.image);
        cleanPayload.image = base64Image;
        cleanPayload.imageName = formData.image.name;
        cleanPayload.imageType = formData.image.type;
      }

      if (payload.role !== 'bureau') {
        delete payload.sub_role;
      }

      const endpoint = userId ? `${url}members/${userId}` : `${url}auth/me`;
      
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(cleanPayload)
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMessage = data.message || data.error || 'Erreur lors de la mise à jour';
        throw new Error(errorMessage);
      }

      setSuccess('Profil mis à jour avec succès');
      
      // Appeler le callback si fourni avec les données mises à jour du serveur
      if (onSaveCallback) {
        onSaveCallback(data.data || cleanPayload);
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Erreur de mise à jour');
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="space-y-6">
      {success && (
        <div className="mb-4">
          <Alert type="success" message={success} />
        </div>
      )}
      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} />
        </div>
      )}
      <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
          <input type="text" name="nom" value={formData.nom || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
          <input type="text" name="prenom" value={formData.prenom || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
          <input type="tel" name="telephone" value={formData.telephone || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
        </div>
        {showRole && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rôle *</label>
              <select name="role" value={formData.role || 'member'} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
                <option value="member">Membre</option>
                <option value="bureau">Membre de bureau</option>
              </select>
            </div>
            {formData.role === 'bureau' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sous-rôle *</label>
                <select name="sub_role" value={formData.sub_role || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
                  <option value="">Sélectionner un sous-rôle</option>
                  <optgroup label="Direction">
                    <option value={SUB_ROLES.PRESIDENT}>{SUB_ROLE_LABELS[SUB_ROLES.PRESIDENT]}</option>
                    <option value={SUB_ROLES.VICE_PRESIDENT}>{SUB_ROLE_LABELS[SUB_ROLES.VICE_PRESIDENT]}</option>
                  </optgroup>
                  <optgroup label="Finances">
                    <option value={SUB_ROLES.TRESORIER}>{SUB_ROLE_LABELS[SUB_ROLES.TRESORIER]}</option>
                    <option value={SUB_ROLES.VICE_TRESORIER}>{SUB_ROLE_LABELS[SUB_ROLES.VICE_TRESORIER]}</option>
                    <option value={SUB_ROLES.COMMISSAIRE_COMPTE}>{SUB_ROLE_LABELS[SUB_ROLES.COMMISSAIRE_COMPTE]}</option>
                  </optgroup>
                  <optgroup label="Commissions">
                    <option value={SUB_ROLES.COMMISSION_CERCLE_ETUDE}>{SUB_ROLE_LABELS[SUB_ROLES.COMMISSION_CERCLE_ETUDE]}</option>
                    <option value={SUB_ROLES.COMMISSION_INFORMATIQUE}>{SUB_ROLE_LABELS[SUB_ROLES.COMMISSION_INFORMATIQUE]}</option>
                    <option value={SUB_ROLES.COMMISSION_LOGEMENT}>{SUB_ROLE_LABELS[SUB_ROLES.COMMISSION_LOGEMENT]}</option>
                    <option value={SUB_ROLES.COMMISSION_SOCIAL}>{SUB_ROLE_LABELS[SUB_ROLES.COMMISSION_SOCIAL]}</option>
                    <option value={SUB_ROLES.COMMISSION_FETE}>{SUB_ROLE_LABELS[SUB_ROLES.COMMISSION_FETE]}</option>
                    <option value={SUB_ROLES.COMMISSION_SPORT}>{SUB_ROLE_LABELS[SUB_ROLES.COMMISSION_SPORT]}</option>
                    <option value={SUB_ROLES.COMMISSION_COMMUNICATION}>{SUB_ROLE_LABELS[SUB_ROLES.COMMISSION_COMMUNICATION]}</option>
                    <option value={SUB_ROLES.COMMISSION_ENVIRONNEMENT}>{SUB_ROLE_LABELS[SUB_ROLES.COMMISSION_ENVIRONNEMENT]}</option>
                  </optgroup>
                </select>
              </div>
            )}
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
          {imagePreview && <img src={imagePreview} alt="Aperçu" className="mt-2 h-20 w-20 rounded-full object-cover border" />}
        </div>
      </div>
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations académiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Établissement *</label>
            <select name="etablissement" value={selectedEtablissement} onChange={handleEtablissementChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
              <option value="">Sélectionner un établissement</option>
              {Object.entries(etablissements).map(([key, etab]) => (
                <option key={key} value={key}>{etab.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parcours *</label>
            <select name="parcours" value={selectedParcours} onChange={handleParcoursChange} required disabled={!selectedEtablissement} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
              <option value="">Sélectionner un parcours</option>
              {selectedEtablissement && etablissements[selectedEtablissement]?.parcours.map((parc) => (
                <option key={parc} value={parc}>{parc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Niveau d'étude *</label>
            <select name="niveau" value={formData.niveau || ''} onChange={handleChange} required disabled={!selectedParcours} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
              <option value="">Sélectionner un niveau</option>
              {getNiveauxOptions(selectedParcours).map((niveau) => (
                <option key={niveau} value={niveau}>{niveau}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Promotion *</label>
            <select name="promotion" value={formData.promotion || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
              <option value="">Sélectionner une promotion</option>
              {getPromotionsOptions().map((promo) => (
                <option key={promo} value={promo}>{promo}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Logement</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de logement *</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input type="radio" name="logement" value="campus" checked={formData.logement === 'campus'} onChange={handleChange} className="mr-2" /> Campus
            </label>
            <label className="flex items-center">
              <input type="radio" name="logement" value="ville" checked={formData.logement === 'ville'} onChange={handleChange} className="mr-2" /> Ville
            </label>
          </div>
        </div>
        {formData.logement === 'campus' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de logement campus *</label>
              <select name="campusType" value={selectedCampusType} onChange={handleCampusTypeChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
                <option value="">Sélectionner un type</option>
                {Object.entries(optionsCampus).map(([key, type]) => (
                  <option key={key} value={key}>{type.nom}</option>
                ))}
              </select>
            </div>
            {selectedCampusType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{optionsCampus[selectedCampusType]?.nom} - Chambre *</label>
                <select name="blocCampus" value={formData.blocCampus || ''} onChange={handleChange} required={formData.logement === 'campus'} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
                  <option value="">Sélectionner une chambre</option>
                  {optionsCampus[selectedCampusType]?.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        {formData.logement === 'ville' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quartier *</label>
            <select name="quartier" value={formData.quartier || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
              <option value="">Sélectionner un quartier</option>
              {quartiers.map((quartier) => (
                <option key={quartier} value={quartier}>{quartier}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Mise à jour...' : 'Mettre à jour'}
        </button>
      </div>
    </form>
    </div>
  );
}
