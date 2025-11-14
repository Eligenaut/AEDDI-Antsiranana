import { useEffect, useState } from 'react';
import { X, Loader2, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';

export function ShowActivite({ isOpen, onClose, activiteId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activite, setActivite] = useState(null);

  useEffect(() => {
    if (isOpen && activiteId) {
      setLoading(true);
      setError(null);
      axios.get(`${url}activites/${activiteId}`, { headers: getAuthHeaders() })
        .then(res => {
          if (res.data.success) {
            setActivite(res.data.data);
          } else {
            setError('Erreur lors du chargement de l\'activité');
          }
        })
        .catch(() => setError('Erreur lors du chargement de l\'activité'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, activiteId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 relative overflow-hidden">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Détail de l'activité</h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des détails...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          ) : activite ? (
            <div className="space-y-6">
              {/* Nom et Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{activite.nom}</h3>
                <p className="text-gray-600 leading-relaxed">{activite.description}</p>
              </div>

              {/* Statut */}
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Statut</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  activite.statut === 'en_cours' ? 'bg-green-100 text-green-800' :
                  activite.statut === 'terminee' ? 'bg-blue-100 text-blue-800' :
                  activite.statut === 'annulee' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {activite.statut === 'en_cours' ? 'En cours' :
                   activite.statut === 'terminee' ? 'Terminée' :
                   activite.statut === 'annulee' ? 'Annulée' :
                   'Planifiée'}
                </span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Date de début</span>
                  </div>
                  <p className="text-gray-900 font-medium">{new Date(activite.date_debut).toLocaleDateString('fr-FR')}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Date de fin</span>
                  </div>
                  <p className="text-gray-900 font-medium">{new Date(activite.date_fin).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
