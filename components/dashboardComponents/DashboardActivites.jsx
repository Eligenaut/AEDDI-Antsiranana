'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Filter, AlertCircle, CheckCircle, Clock, X, Edit, Trash2, Eye, Users } from 'lucide-react';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import { AddActivite } from './AddActivite';
import { ShowActivite } from './ShowActivite';
import { ModalConfirmation } from '../common/ModalConfirmation.jsx';
import { usePermissions } from '../context/permissions';
import Notiflix from 'notiflix';

export function DashboardActivites() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActiviteId, setShowActiviteId] = useState(null);
  const [activiteToEdit, setActiviteToEdit] = useState(null);
  const [activiteToDelete, setActiviteToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { ready, can } = usePermissions();
  const canCreate = ready && can('create_activite');
  const canEdit = ready && can('edit_activite');
  const canDelete = ready && can('delete_activite');

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}activites`, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        setActivities(response.data.data);
      } else {
        setError('Erreur lors du chargement des activités');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error);
      setError('Erreur lors du chargement des activités');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };
  const totalActivities = activities.length;
  const activitiesEnCours = activities.filter(a => a.statut === 'en_cours').length;
  const activitiesTerminees = activities.filter(a => a.statut === 'terminee').length;

  const fetchActiviteById = async (id) => {
    try {
      const response = await axios.get(`${url}activites/${id}`, {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        setActiviteToEdit(response.data.data);
        setShowAddModal(true);
      } else {
        Notiflix.Notify.failure('Erreur lors du chargement de l\'activité');
      }
    } catch (error) {
      Notiflix.Notify.failure('Erreur lors du chargement de l\'activité');
    }
  };

  const handleDeleteActivite = async () => {
    if (!activiteToDelete) return;
    try {
      const response = await axios.delete(`${url}activites/${activiteToDelete.id}`, {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        await fetchActivities();
        Notiflix.Notify.success('Activité supprimée avec succès !');
      } else {
        Notiflix.Notify.failure('Erreur lors de la suppression de l\'activité');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'activité:', error);
      Notiflix.Notify.failure('Erreur lors de la suppression de l\'activité');
    } finally {
      setShowDeleteModal(false);
      setActiviteToDelete(null);
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
            <h1 className="text-lg font-semibold text-gray-900 mb-1 sm:text-3xl sm:font-bold sm:mb-2">Gestion des Activités 📅</h1>
          </div>
          {canCreate && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1.5 text-xs rounded-lg flex items-center space-x-2 transition-colors sm:px-3 sm:py-2 sm:text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Nouvelle activité</span>
            </motion.button>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{activitiesEnCours}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">{activitiesTerminees}</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:block bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Activités</p>
              <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="block lg:hidden bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Activités</p>
            <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
          </div>
        </div>
      </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date début</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date fin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span>Chargement des activités...</span>
                    </div>
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="text-lg font-medium text-gray-600">
                        Aucun donnée enregistré
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <motion.tr
                    key={activity.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{activity.nom}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{activity.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(activity.date_debut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(activity.date_fin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-[5px] font-semibold ${activity.statut === 'en_cours' ? 'text-green-500' : 'text-red-500'}`}>
                        {activity.statut === 'en_cours' ? 'En cours' : 'Terminée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="Voir les détails" onClick={() => setShowActiviteId(activity.id)}>
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEdit && (
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Modifier"
                            onClick={() => fetchActiviteById(activity.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {canDelete && (
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                            onClick={() => {
                              setActiviteToDelete(activity);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}                  F
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      <AddActivite
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setActiviteToEdit(null); }}
        onSubmit={() => {
          setShowAddModal(false);
          setActiviteToEdit(null);
          fetchActivities();
        }}
        initialValues={activiteToEdit || null}
      />
      <ShowActivite isOpen={!!showActiviteId} onClose={() => setShowActiviteId(null)} activiteId={showActiviteId} />
      <ModalConfirmation
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setActiviteToDelete(null); }}
        onConfirm={handleDeleteActivite}
        title="Supprimer l'activité ?"
        message={`Êtes-vous sûr de vouloir supprimer l'activité "${activiteToDelete?.nom}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </main>
  );
}