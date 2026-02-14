"use client";
import { useEffect, useState } from 'react';
import { X, Loader2, DollarSign, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';

export function ShowCotisation({ isOpen, onClose, cotisationId, isAdmin, cotisations }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cotisation, setCotisation] = useState(null);
  const [visible, setVisible] = useState(isOpen);

  const memberData = !isAdmin ? (() => {
    const cotisationData = cotisations.find(c => c.id === cotisationId);
    return cotisationData ? {
      statut_paiement: cotisationData.statut_paiement,
      montant_restant: cotisationData.montant_restant
    } : undefined;
  })() : undefined;

  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && cotisationId) {
      setLoading(true);
      setError(null);
      axios.get(`${url}cotisations/${cotisationId}`, { headers: getAuthHeaders() })
        .then(res => {
          if (res.data.success) setCotisation(res.data.data);
          else setError('Erreur lors du chargement de la cotisation');
        })
        .catch(() => setError('Erreur lors du chargement de la cotisation'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, cotisationId]);

  const handleClose = () => setVisible(false);
  const handleAnimationComplete = () => {
    if (!visible) onClose();
  };

  return createPortal(
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            onAnimationComplete={handleAnimationComplete}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            onAnimationComplete={handleAnimationComplete}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">
                  {memberData ? 'Mon état de cotisation' : 'Détail de la cotisation'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              ) : cotisation ? (
                <>
                  {/* Nom et description */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{cotisation.nom}</h3>
                    <p className="text-gray-600 leading-relaxed">{cotisation.description}</p>
                  </div>

                  {/* Vue membre ou admin */}
                  {memberData && memberData.statut_paiement ? (
                    <div className="space-y-6">
                      {/* État de paiement */}
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
                          <div className="text-center text-yellow-700 font-bold text-2xl">
                            {memberData.montant_restant.toLocaleString()} AR
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Vue admin */
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
                  )}
                </>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
