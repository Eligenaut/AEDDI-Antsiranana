'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import Notiflix from 'notiflix';

export default function AddAuthorizedEmail({ isOpen, onClose, onEmailAdded }) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authorizedEmails, setAuthorizedEmails] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // 🔥 Important pour éviter "document is not defined"
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) loadAuthorizedEmails();
  }, [isOpen]);

  const loadAuthorizedEmails = async () => {
    try {
      const resp = await fetch(`${url}admin/authorized-emails`, {
        headers: getAuthHeaders(),
      });
      const response = await resp.json();
      if (response.success && response.data) {
        setAuthorizedEmails(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    try {
      const resp = await fetch(`${url}admin/add-authorized-email`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email: email.trim() }),
      });

      const response = await resp.json();

      if (response.success) {
        Notiflix.Notify.success('Email ajouté avec succès !');
        setGeneratedCode(response.code || '');
        setShowCode(true);
        setEmail('');
        loadAuthorizedEmails();
        onEmailAdded?.();
      } else {
        Notiflix.Notify.failure(response.message || "Erreur lors de l'ajout");
      }
    } catch (err) {
      Notiflix.Notify.failure(err.message || "Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmail = async (id) => {
    Notiflix.Confirm.show(
      "Supprimer l'email ?",
      "Êtes-vous sûr ?",
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
            Notiflix.Notify.success('Email supprimé !');
            loadAuthorizedEmails();
          } else {
            Notiflix.Notify.failure(response.message);
          }
        } catch (err) {
          Notiflix.Notify.failure("Erreur réseau");
        }
      }
    );
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between">
              <h2 className="text-xl font-bold">Ajouter un email autorisé</h2>
              <button onClick={onClose}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleAddEmail} className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md"
                >
                  {isLoading ? 'Ajout...' : 'Ajouter'}
                </button>
              </form>

              <div>
                <h3 className="text-lg font-medium">
                  Emails autorisés ({authorizedEmails.length})
                </h3>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
