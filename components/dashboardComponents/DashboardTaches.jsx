'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Plus, AlertCircle, Eye, Edit, Trash2, ClipboardList, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import { AddTache } from './AddTache';
import { ShowTache } from './ShowTache';
import { ModalConfirmation } from '../common/ModalConfirmation.jsx';
import Notiflix from 'notiflix';

const PRIORITY_LABELS = {
  basse: 'Basse',
  moyenne: 'Moyenne',
  haute: 'Haute',
  urgente: 'Urgente',
};

const PRIORITY_COLORS = {
  basse: 'text-gray-500 bg-gray-100',
  moyenne: 'text-blue-600 bg-blue-100',
  haute: 'text-orange-600 bg-orange-100',
  urgente: 'text-red-600 bg-red-100',
};

const STATUT_LABELS = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  terminee: 'Terminée',
  annulee: 'Annulée',
};

const STATUT_COLORS = {
  en_attente: 'text-yellow-600 bg-yellow-100',
  en_cours: 'text-blue-600 bg-blue-100',
  terminee: 'text-green-600 bg-green-100',
  annulee: 'text-red-600 bg-red-100',
};

export function DashboardTaches() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTacheId, setShowTacheId] = useState(null);
  const [tacheToEdit, setTacheToEdit] = useState(null);
  const [tacheToDelete, setTacheToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filterStatut, setFilterStatut] = useState('');
  const [filterPriorite, setFilterPriorite] = useState('');

  const fetchTaches = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatut) params.append('statut', filterStatut);
      if (filterPriorite) params.append('priorite', filterPriorite);

      const response = await axios.get(`${url}taches?${params}`, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        setTaches(response.data.data);
      } else {
        setError('Erreur lors du chargement des tâches');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      setError('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchTaches();
    } else {
      setError('Vous devez être connecté pour accéder à cette page');
      setLoading(false);
    }
  }, [filterStatut, filterPriorite]);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const totalTaches = taches.length;
  const tachesEnAttente = taches.filter(t => t.statut === 'en_attente').length;
  const tachesEnCours = taches.filter(t => t.statut === 'en_cours').length;
  const tachesTerminees = taches.filter(t => t.statut === 'terminee').length;

  const fetchTacheById = async (id) => {
    try {
      const response = await axios.get(`${url}taches/${id}`, {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        setTacheToEdit(response.data.data);
        setShowAddModal(true);
      } else {
        Notiflix.Notify.failure('Erreur lors du chargement de la tâche');
      }
    } catch (error) {
      Notiflix.Notify.failure('Erreur lors du chargement de la tâche');
    }
  };

  const handleDeleteTache = async () => {
    if (!tacheToDelete) return;
    try {
      const response = await axios.delete(`${url}taches/${tacheToDelete.id}`, {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        await fetchTaches();
        Notiflix.Notify.success('Tâche supprimée avec succès !');
      } else {
        Notiflix.Notify.failure('Erreur lors de la suppression de la tâche');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      Notiflix.Notify.failure('Erreur lors de la suppression de la tâche');
    } finally {
      setShowDeleteModal(false);
      setTacheToDelete(null);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-2 sm:p-6 pb-20 lg:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 mb-1 sm:text-3xl sm:font-bold sm:mb-2">Gestion des Tâches 📋</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1.5 text-xs rounded-lg flex items-center space-x-2 transition-colors sm:px-3 sm:py-2 sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Nouvelle tâche</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{tachesEnAttente}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{tachesEnCours}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">{tachesTerminees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <ClipboardList className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalTaches}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200 mb-6"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">Statut:</label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Tous</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="terminee">Terminée</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">Priorité:</label>
            <select
              value={filterPriorite}
              onChange={(e) => setFilterPriorite(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Toutes</option>
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tâche</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigné à</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Début</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span>Chargement des tâches...</span>
                    </div>
                  </td>
                </tr>
              ) : taches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <ClipboardList className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="text-lg font-medium text-gray-600">
                        Aucune tâche enregistrée
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                taches.map((tache) => (
                  <motion.tr
                    key={tache.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{tache.titre}</div>
                      {tache.description && (
                        <div className="text-xs text-gray-500 max-w-xs truncate">{tache.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tache.assigned_to?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[tache.priorite] || 'text-gray-500 bg-gray-100'}`}>
                        {PRIORITY_LABELS[tache.priorite] || tache.priorite}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUT_COLORS[tache.statut] || 'text-gray-500 bg-gray-100'}`}>
                        {STATUT_LABELS[tache.statut] || tache.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(tache.date_debut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(tache.date_echeance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir les détails"
                          onClick={() => setShowTacheId(tache.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Modifier"
                          onClick={() => fetchTacheById(tache.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                          onClick={() => {
                            setTacheToDelete(tache);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AddTache
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setTacheToEdit(null); }}
        onSubmit={() => {
          setShowAddModal(false);
          setTacheToEdit(null);
          fetchTaches();
        }}
        initialValues={tacheToEdit || null}
      />
      <ShowTache isOpen={!!showTacheId} onClose={() => setShowTacheId(null)} tacheId={showTacheId} />
      <ModalConfirmation
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setTacheToDelete(null); }}
        onConfirm={handleDeleteTache}
        title="Supprimer la tâche ?"
        message={`Êtes-vous sûr de vouloir supprimer la tâche "${tacheToDelete?.titre}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </main>
  );
}
