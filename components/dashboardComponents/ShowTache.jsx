"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { X, User, Calendar, AlertTriangle, Clock } from "lucide-react";
import axios from "axios";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";

const PRIORITY_LABELS = {
  basse: "Basse",
  moyenne: "Moyenne",
  haute: "Haute",
  urgente: "Urgente",
};

const PRIORITY_COLORS = {
  basse: "text-gray-600 bg-gray-100",
  moyenne: "text-blue-600 bg-blue-100",
  haute: "text-orange-600 bg-orange-100",
  urgente: "text-red-600 bg-red-100",
};

const STATUT_LABELS = {
  en_attente: "En attente",
  en_cours: "En cours",
  terminee: "Terminée",
  annulee: "Annulée",
};

const STATUT_COLORS = {
  en_attente: "text-yellow-600 bg-yellow-100",
  en_cours: "text-blue-600 bg-blue-100",
  terminee: "text-green-600 bg-green-100",
  annulee: "text-red-600 bg-red-100",
};

export function ShowTache({ isOpen, onClose, tacheId }) {
  const [mounted, setMounted] = useState(false);
  const [tache, setTache] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen && tacheId) {
      fetchTache();
    }
  }, [isOpen, tacheId]);

  const fetchTache = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}taches/${tacheId}`, {
        headers: getAuthHeaders(),
      });
      if (response.data.success) {
        setTache(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la tâche:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[9999]"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-[10000] flex flex-col overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold">Détail de la tâche</h2>
              <button
                onClick={onClose}
                className="hover:bg-white/20 p-2 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : tache ? (
                <>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {tache.titre}
                    </h3>
                    {tache.description && (
                      <p className="mt-3 text-gray-600 leading-relaxed">
                        {tache.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                        <User className="w-4 h-4" />
                        <span>Assigné par</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {tache.assigned_by?.name || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                        <User className="w-4 h-4" />
                        <span>Assigné à</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tache.assigned_to?.length > 0
                          ? tache.assigned_to.map((u) => (
                              <span
                                key={u.id}
                                className="inline-block bg-purple-100 text-purple-700 rounded-full px-2 py-0.5 text-xs font-medium"
                              >
                                {u.name}
                              </span>
                            ))
                          : <p className="font-semibold text-gray-900">N/A</p>}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Priorité</span>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          PRIORITY_COLORS[tache.priorite] ||
                          "text-gray-500 bg-gray-100"
                        }`}
                      >
                        {PRIORITY_LABELS[tache.priorite] || tache.priorite}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                        <Clock className="w-4 h-4" />
                        <span>Statut</span>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          STATUT_COLORS[tache.statut] ||
                          "text-gray-500 bg-gray-100"
                        }`}
                      >
                        {STATUT_LABELS[tache.statut] || tache.statut}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>Date de début</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatDate(tache.date_debut)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>Date d'échéance</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatDate(tache.date_echeance)}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 pt-4 border-t border-gray-100">
                    Créée le {formatDate(tache.created_at)}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Tâche non trouvée
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
