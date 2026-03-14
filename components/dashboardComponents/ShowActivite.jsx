'use client';
import { useEffect, useState } from 'react';
import { X, Loader2, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';

export function ShowActivite({ isOpen, onClose, activiteId }) {
  const [mounted, setMounted] = useState(false); // ✅ ajouté
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activite, setActivite] = useState(null);

  useEffect(() => {
    setMounted(true); // ✅ ajouté
  }, []);

  useEffect(() => {
    if (isOpen && activiteId) {
      setLoading(true);
      setError(null);

      axios
        .get(`${url}activites/${activiteId}`, { headers: getAuthHeaders() })
        .then((res) => {
          if (res.data.success) setActivite(res.data.data);
          else setError("Erreur lors du chargement de l'activité");
        })
        .catch(() => setError("Erreur lors du chargement de l'activité"))
        .finally(() => setLoading(false));
    }
  }, [isOpen, activiteId]);

  // ✅ Bloque le rendu côté serveur
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[600px] bg-white shadow-2xl z-50 flex flex-col overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6" />
                <h2 className="text-xl font-bold">Détail de l'activité</h2>
              </div>
              <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 flex-1">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              ) : activite ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{activite.nom}</h3>
                    <p className="text-gray-600 leading-relaxed">{activite.description}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Statut</span>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        activite.statut === 'en_cours'
                          ? 'bg-green-100 text-green-800'
                          : activite.statut === 'terminee'
                          ? 'bg-blue-100 text-blue-800'
                          : activite.statut === 'annulee'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {activite.statut === 'en_cours'
                        ? 'En cours'
                        : activite.statut === 'terminee'
                        ? 'Terminée'
                        : activite.statut === 'annulee'
                        ? 'Annulée'
                        : 'Planifiée'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Date de début</span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {new Date(activite.date_debut).toLocaleDateString('fr-FR')}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Date de fin</span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {new Date(activite.date_fin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}