import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import { X, Trash2, Save, Loader2, AlertCircle, CheckCircle, DollarSign, User, Calendar } from 'lucide-react';

export function CotisationModal({ isOpen, onClose, user, onUpdate }) {
  const [cotisations, setCotisations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalCotisations, setOriginalCotisations] = useState([]);

  useEffect(() => {
    if (isOpen && user) {
      fetchCotisations();
    }
  }, [isOpen, user]);

  const fetchCotisations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${url}cotisations/member/${user?.id}`, {
        headers: getAuthHeaders(),
      });
      if (response.data.success) {
        const cotisationsData = response.data.data.map((c) => ({
          cotisation: {
            id: c.cotisation.id,
            nom: c.cotisation.nom,
            montant: c.cotisation.montant,
          },
          statut: c.statut,
          montant_restant: c.montant_restant || 0,
        }));
        setCotisations(cotisationsData);
        setOriginalCotisations(JSON.parse(JSON.stringify(cotisationsData)));
        setHasChanges(false);
      } else {
        setError('Erreur lors du chargement des cotisations');
      }
    } catch (e) {
      setError('Erreur lors du chargement des cotisations');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (idx, field, value) => {
    setCotisations(cotisations =>
      cotisations.map((c, i) =>
        i === idx ? { ...c, [field]: value } : c
      )
    );
    setHasChanges(true);
  };

  const handleUpdateAll = async () => {
    setUpdating(true);
    setError(null);
    try {
      const updatePromises = cotisations.map(async (cotisation, idx) => {
        const original = originalCotisations[idx];
        if (original && (
          original.statut !== cotisation.statut ||
          original.montant_restant !== cotisation.montant_restant
        )) {
          return axios.put(`${url}cotisations/${cotisation.cotisation.id}/member/${user?.id}/status`,
            {
              statut: cotisation.statut,
              montant_restant: cotisation.statut === 'reste' ? cotisation.montant_restant : 0,
            },
            { headers: getAuthHeaders() }
          );
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      setHasChanges(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (e) {
      setError('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (cotisation) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette cotisation pour ce membre ?')) return;
    setUpdating(true);
    setError(null);
    try {
      await axios.delete(`${url}cotisations/${cotisation.cotisation.id}/member/${user?.id}`, {
        headers: getAuthHeaders(),
      });
      if (onUpdate) {
        onUpdate();
      }
    } catch (e) {
      setError('Erreur lors de la suppression');
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 relative overflow-hidden">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Gestion des cotisations</h2>
                <p className="text-blue-100">{user.name}</p>
              </div>
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
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des cotisations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tableau des cotisations */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4" />
                            <span>Cotisation</span>
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant restant
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cotisations.map((c, idx) => (
                        <tr key={c.cotisation.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{c.cotisation.nom}</div>
                          </td>

                          {/* Montant */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{c.cotisation.montant.toLocaleString()} AR</div>
                          </td>

                          {/* Statut */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <select
                              value={c.statut}
                              onChange={e => handleChange(idx, 'statut', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="paye">✅ Payé</option>
                              <option value="non_paye">❌ Non payé</option>
                              <option value="reste">⚠️ Reste</option>
                            </select>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {c.statut === 'reste' ? (
                              <input
                                type="number"
                                min={0}
                                max={c.cotisation.montant}
                                value={c.montant_restant}
                                onChange={e => handleChange(idx, 'montant_restant', parseFloat(e.target.value) || 0)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0"
                              />
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleDelete(c)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              disabled={updating}
                              title="Supprimer cette cotisation pour ce membre"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {hasChanges ? (
                    <span className="flex items-center space-x-2 text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>Modifications non sauvegardées</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Toutes les modifications sont sauvegardées</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={handleUpdateAll}
                  disabled={!hasChanges || updating}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Mise à jour...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Mettre à jour tout</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
