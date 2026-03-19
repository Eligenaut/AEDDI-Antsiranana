"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  X,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { AddCotisation } from "./AddCotisation";
import axios from "axios";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";
import { ShowCotisation } from "./ShowCotisation";
import Notiflix from "notiflix";
import { ModalConfirmation } from "../common/ModalConfirmation";

export function DashboardCotisations() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [cotisationToEdit, setCotisationToEdit] = useState(null);
  const [cotisations, setCotisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCotisationId, setShowCotisationId] = useState(null);
  const [cotisationToDelete, setCotisationToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchCotisations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}cotisations`, {
        headers: getAuthHeaders(),
      });
      if (response.data.success) {
        setCotisations(response.data.data);
      } else {
        setError("Erreur lors du chargement des cotisations");
      }
    } catch (error) {
      setError("Erreur lors du chargement des cotisations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetchCotisations();
    } else {
      setError("Vous devez être connecté pour accéder à cette page");
      setLoading(false);
    }
  }, []);

  const formatMontant = (montant) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
    })
      .format(montant)
      .replace("MGA", "AR");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const handleAddCotisation = async () => {
    await fetchCotisations();
    setShowAddModal(false);
    setCotisationToEdit(null);
  };

  const handleDeleteCotisation = async () => {
    if (!cotisationToDelete) return;
    try {
      const response = await axios.delete(
        `${url}cotisations/${cotisationToDelete.id}`,
        {
          headers: getAuthHeaders(),
        },
      );
      if (response.data.success) {
        await fetchCotisations();
        Notiflix.Notify.success("Cotisation supprimée avec succès !");
      } else {
        Notiflix.Notify.failure("Erreur lors de la suppression");
      }
    } catch (error) {
      Notiflix.Notify.failure("Erreur lors de la suppression");
    } finally {
      setShowDeleteModal(false);
      setCotisationToDelete(null);
    }
  };

  // Statistiques
  const totalCotisations = cotisations.length;
  const montantTotal = cotisations.reduce(
    (sum, c) => sum + (c.montant || 0),
    0,
  );
  const totalPayees = cotisations.reduce(
    (sum, c) => sum + (c.membres_payes || 0),
    0,
  );
  const totalNonPayees = cotisations.reduce(
    (sum, c) => sum + ((c.total_membres || 0) - (c.membres_payes || 0)),
    0,
  );

  return (
    <main className="flex-1 overflow-y-auto p-2 sm:p-6 pb-20 lg:pb-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 sm:text-3xl sm:font-bold">
            Gestion des Cotisations
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 text-xs rounded-lg flex items-center space-x-2 transition-colors sm:px-3 sm:py-2 sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Nouvelle cotisation</span>
          </motion.button>
        </div>
      </motion.div>

      {/* STATS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Cotisations</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCotisations}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-100 p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-200 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Membres payés</p>
              <p className="text-2xl font-bold text-gray-900">{totalPayees}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-100 p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-200 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Montant total</p>
              <p className="text-lg font-bold text-gray-900">
                {formatMontant(montantTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-100 p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-red-200 p-2 rounded-lg">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Non payés</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalNonPayees}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ERREUR */}
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

      {/* TABLEAU */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date début
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paiements
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      <span>Chargement des cotisations...</span>
                    </div>
                  </td>
                </tr>
              ) : cotisations.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="text-lg font-medium text-gray-600">
                        Aucune donnée enregistrée
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                cotisations.map((cotisation) => (
                  <motion.tr
                    key={cotisation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {cotisation.nom}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {cotisation.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {formatMontant(cotisation.montant)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(cotisation.date_debut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(cotisation.date_fin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold text-sm">
                        {cotisation.membres_payes}/{cotisation.total_membres}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir les détails"
                          onClick={() => setShowCotisationId(cotisation.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Modifier"
                          onClick={() => {
                            setCotisationToEdit(cotisation);
                            setShowAddModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                          onClick={() => {
                            setCotisationToDelete(cotisation);
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

      {/* MODALS */}
      <AddCotisation
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setCotisationToEdit(null);
        }}
        onSubmit={handleAddCotisation}
        initialValues={cotisationToEdit}
      />

      <ShowCotisation
        isOpen={!!showCotisationId}
        onClose={() => setShowCotisationId(null)}
        cotisationId={showCotisationId}
        cotisations={cotisations}
      />

      <ModalConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCotisationToDelete(null);
        }}
        onConfirm={handleDeleteCotisation}
        title="Supprimer la cotisation ?"
        message={`Êtes-vous sûr de vouloir supprimer la cotisation "${cotisationToDelete?.nom}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </main>
  );
}
