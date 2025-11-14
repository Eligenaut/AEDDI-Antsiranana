'use client';

import { useEffect, useState } from 'react';
import { getAuthHeaders } from '../context/headers';
import { url } from '../context/url';
import { Pencil, Mail, Phone, MapPin, Calendar, GraduationCap, Home } from 'lucide-react';
import UserEdit from './UserEdit';

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

export default function UserDetail() {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setError('');
  };

  const handleSave = (updatedData) => {
    setUserData(prev => ({ ...prev, ...updatedData }));
    setEditing(false);
    // Recharger les données pour avoir les données fraîches du serveur
    fetchUserData();
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${url}auth/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Erreur chargement utilisateur');

      const data = await res.json();
      if (data.success && data.user) {
        setUserData({
          ...data.user,
          blocCampus: data.user.blocCampus || data.user.bloc_campus || '',
        });
      } else throw new Error('Format utilisateur invalide');
    } catch (err) {
      setError('Impossible de charger les données utilisateur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  if (error && !userData) return <Alert type="error" message={error} />;
  if (!userData) return <div>Aucune donnée utilisateur</div>;

  return (
    <div className="w-full flex flex-col">
      <div className="bg-white shadow rounded-lg px-4 py-4 flex justify-between items-center border-b mb-4 flex-shrink-0">
        <h2 className="text-xl text-gray-800 font-semibold">Mon Profil</h2>
        <div className="flex gap-2">
          {editing && (
            <button 
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors shadow-sm"
            >
              Annuler
            </button>
          )}
          {!editing && (
            <button 
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <Pencil className="h-4 w-4" /> 
              <span>Modifier</span>
            </button>
          )}
        </div>
      </div>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg">
        {editing ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <UserEdit
              initialData={userData}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div className="w-full">
            {/* Informations principales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Colonne de gauche */}
              <div className="space-y-6">
                {/* Contact */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    Contact
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{userData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                        <p className="text-sm font-medium text-gray-900">{userData.telephone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logement */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Home className="h-5 w-5 text-indigo-600" />
                    Logement
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50">
                      <MapPin className="h-5 w-5 text-indigo-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Type de logement</p>
                        <p className="text-sm font-medium text-gray-900">
                          {userData.logement === 'campus' ? 'Campus' : userData.logement === 'ville' ? 'Ville' : 'Non spécifié'}
                        </p>
                      </div>
                    </div>
                    {userData.logement === 'campus' && userData.blocCampus && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                        <Home className="h-5 w-5 text-purple-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Bloc campus</p>
                          <p className="text-sm font-medium text-gray-900">{userData.blocCampus}</p>
                        </div>
                      </div>
                    )}
                    {userData.logement === 'ville' && userData.quartier && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                        <MapPin className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Quartier</p>
                          <p className="text-sm font-medium text-gray-900">{userData.quartier}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Colonne de droite */}
              <div className="space-y-6">
                {/* Informations académiques */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-indigo-600" />
                    Informations académiques
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500 font-medium">Établissement:</span>
                      <span className="text-gray-900 col-span-2">{userData.etablissement}</span>
                    </div>
                    <div className="border-t pt-3"></div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500 font-medium">Parcours:</span>
                      <span className="text-gray-900 col-span-2">{userData.parcours}</span>
                    </div>
                    <div className="border-t pt-3"></div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500 font-medium">Niveau:</span>
                      <span className="text-gray-900 col-span-2">{userData.niveau}</span>
                    </div>
                    <div className="border-t pt-3"></div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-500 font-medium">Promotion:</span>
                      <span className="text-gray-900 col-span-2">{userData.promotion}</span>
                    </div>
                  </div>
                </div>

                {/* Date d'inscription */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    Informations
                  </h3>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Membre depuis</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(userData.created_at).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
