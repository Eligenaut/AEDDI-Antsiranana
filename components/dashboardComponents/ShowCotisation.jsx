import { useEffect, useState } from 'react';
import { X, Loader2, DollarSign, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';

export function ShowCotisation({ isOpen, onClose, cotisationId, isAdmin, cotisations }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cotisation, setCotisation] = useState(null);

  // Calculer les données du membre
  const memberData = !isAdmin ? (() => {
    const cotisationData = cotisations.find(c => c.id === cotisationId);
    console.log('ShowCotisation - cotisationData trouvée:', cotisationData);
    return cotisationData ? {
      statut_paiement: cotisationData.statut_paiement,
      montant_restant: cotisationData.montant_restant
    } : undefined;
  })() : undefined;

  // Debug pour voir les données reçues
  console.log('ShowCotisation - memberData:', memberData);
  console.log('ShowCotisation - isAdmin:', isAdmin);
  console.log('ShowCotisation - cotisationId:', cotisationId);

  useEffect(() => {
    if (isOpen && cotisationId) {
      setLoading(true);
      setError(null);
      axios.get(`${url}cotisations/${cotisationId}`, { headers: getAuthHeaders() })
        .then(res => {
          if (res.data.success) {
            setCotisation(res.data.data);
          } else {
            setError('Erreur lors du chargement de la cotisation');
          }
        })
        .catch(() => setError('Erreur lors du chargement de la cotisation'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, cotisationId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 relative overflow-hidden">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">{memberData ? 'Mon état de cotisation' : 'Détail de la cotisation'}</h2>
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
                <Loader2 className="w-8 h-8 animate-spin text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des détails...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          ) : cotisation ? (
            <div className="space-y-6">
              {/* Nom et Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{cotisation.nom}</h3>
                <p className="text-gray-600 leading-relaxed">{cotisation.description}</p>
              </div>

              {memberData && memberData.statut_paiement ? (
                /* Vue membre - État de paiement */
                <div className="space-y-6">
                  {/* État de paiement du membre */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-800">Mon état de paiement</h3>
                    </div>
                    
                    <div className="flex items-center justify-center mb-4">
                      <span className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${
                        memberData.statut_paiement === 'paye' ? 'bg-green-100 text-green-800' :
                        memberData.statut_paiement === 'reste' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {memberData.statut_paiement === 'paye' ? '✅ Payé' :
                         memberData.statut_paiement === 'reste' ? '⚠️ Reste à payer' :
                         '❌ Non payé'}
                      </span>
                    </div>

                    {memberData.statut_paiement === 'reste' && memberData.montant_restant && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Montant restant à payer :</p>
                        <p className="text-2xl font-bold text-yellow-700">{memberData.montant_restant.toLocaleString()} AR</p>
                      </div>
                    )}

                    {memberData.statut_paiement === 'paye' && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Montant total payé :</p>
                        <p className="text-2xl font-bold text-green-700">{cotisation.montant.toLocaleString()} AR</p>
                      </div>
                    )}

                    {memberData.statut_paiement === 'non_paye' && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Montant à payer :</p>
                        <p className="text-2xl font-bold text-red-700">{cotisation.montant.toLocaleString()} AR</p>
                      </div>
                    )}
                  </div>

                  {/* Informations de la cotisation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Montant total</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{cotisation.montant.toLocaleString()} AR</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Période</span>
                      </div>
                      <p className="text-sm text-gray-900">
                        {new Date(cotisation.date_debut).toLocaleDateString('fr-FR')} - {new Date(cotisation.date_fin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Vue admin - Détails complets */
                <>
                  {/* Informations principales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Montant</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">{cotisation.montant.toLocaleString()} AR</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">Statut</span>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        cotisation.statut === 'active' ? 'bg-green-100 text-green-800' :
                        cotisation.statut === 'terminee' ? 'bg-blue-100 text-blue-800' :
                        cotisation.statut === 'annulee' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cotisation.statut === 'active' ? 'Active' :
                         cotisation.statut === 'terminee' ? 'Terminée' :
                         cotisation.statut === 'annulee' ? 'Annulée' :
                         'En préparation'}
                      </span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Date de début</span>
                      </div>
                      <p className="text-gray-900 font-medium">{new Date(cotisation.date_debut).toLocaleDateString('fr-FR')}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Date de fin</span>
                      </div>
                      <p className="text-gray-900 font-medium">{new Date(cotisation.date_fin).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
