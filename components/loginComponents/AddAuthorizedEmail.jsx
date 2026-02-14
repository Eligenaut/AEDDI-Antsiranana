'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import Notiflix from 'notiflix';

export default function AddAuthorizedEmail({ isOpen, onClose, onEmailAdded }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authorizedEmails, setAuthorizedEmails] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    if (isOpen) loadAuthorizedEmails();
  }, [isOpen]);

  const loadAuthorizedEmails = async () => {
    try {
      const resp = await fetch(`${url}admin/authorized-emails`, { headers: getAuthHeaders() });
      const response = await resp.json();
      if (response.success && response.data) setAuthorizedEmails(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des emails:', err);
    }
  };

  const handleAddEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Veuillez entrer un email');

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const resp = await fetch(`${url}admin/add-authorized-email`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email: email.trim() }),
      });
      const response = await resp.json();

      if (response.success) {
        setSuccess('Email ajouté avec succès !');
        Notiflix.Notify.success('Email ajouté avec succès !');
        setGeneratedCode(response.code || '');
        setShowCode(true);
        setEmail('');
        loadAuthorizedEmails();
        onEmailAdded?.();
      } else {
        setError(response.message || 'Erreur lors de l\'ajout');
        Notiflix.Notify.failure(response.message || 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout');
      Notiflix.Notify.failure(err.message || 'Erreur lors de l\'ajout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmail = async (id) => {
    Notiflix.Confirm.show(
      "Supprimer l'email ?",
      "Êtes-vous sûr de vouloir supprimer cet email autorisé ?",
      "Supprimer",
      "Annuler",
      async () => {
        try {
          const resp = await fetch(`${url}admin/delete-authorized-email/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          });
          const response = await resp.json();
          if (response.success) {
            Notiflix.Notify.success('Email supprimé avec succès !');
            loadAuthorizedEmails();
          } else {
            Notiflix.Notify.failure(response.message || 'Erreur lors de la suppression');
          }
        } catch (err) {
          Notiflix.Notify.failure(err.message || 'Erreur lors de la suppression');
        }
      }
    );
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white flex items-center justify-between">
              <h2 className="text-xl font-bold">Ajouter un email autorisé</h2>
              <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              <form onSubmit={handleAddEmail} className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Ajout...' : 'Ajouter'}
                </button>
              </form>

              {showCode && generatedCode && (
                <div className="rounded-md bg-blue-50 p-4">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Code généré</h3>
                  <div className="text-2xl font-mono text-blue-600 bg-white p-3 rounded border">{generatedCode}</div>
                  <button
                    onClick={() => setShowCode(false)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                  >
                    Fermer
                  </button>
                </div>
              )}

              {/* Emails autorisés */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Emails autorisés ({authorizedEmails.length})
                </h3>
                {authorizedEmails.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun email autorisé pour le moment</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th>Email</th>
                          <th>Code</th>
                          <th>Statut</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {authorizedEmails.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 text-sm text-gray-900">{item.email}</td>
                            <td className="px-6 py-4 text-sm font-mono">{item.code}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                item.used ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.used ? 'Utilisé' : 'En attente'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString('fr-FR')}</td>
                            <td className="px-6 py-4 text-sm">
                              <button onClick={() => handleDeleteEmail(item.id)} className="text-red-600 hover:text-red-900">
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
