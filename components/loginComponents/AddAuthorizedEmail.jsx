"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { X, Trash2, Mail } from "lucide-react";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";
import Notiflix from "notiflix";

export default function AddAuthorizedEmail({ isOpen, onClose, onEmailAdded }) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("NOVICE");
  const [authorizedEmails, setAuthorizedEmails] = useState([]);

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
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email: email.trim(), role }),
      });

      const response = await resp.json();

      if (response.success) {
        Notiflix.Notify.success("Email ajouté avec succès !");
        setEmail("");
        setRole("NOVICE");
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
      "Êtes-vous sûr de vouloir supprimer cet email ?",
      "Supprimer",
      "Annuler",
      async () => {
        try {
          const resp = await fetch(
            `${url}admin/delete-authorized-email/${id}`,
            {
              method: "DELETE",
              headers: getAuthHeaders(),
            },
          );

          const response = await resp.json();

          if (response.success) {
            Notiflix.Notify.success("Email supprimé !");
            loadAuthorizedEmails();
          } else {
            Notiflix.Notify.failure(response.message);
          }
        } catch (err) {
          Notiflix.Notify.failure("Erreur réseau");
        }
      },
    );
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fond sombre */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panneau */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[600px] bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold tracking-tight">
                Emails autorisés
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-blue-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden p-6 gap-6">
              {/* Formulaire d'ajout */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Ajouter un nouvel email
                </p>
                <form onSubmit={handleAddEmail} className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemple@domaine.com"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {isLoading ? "Ajout..." : "Ajouter"}
                    </button>
                  </div>

                  {/* Sélecteur de rôle */}
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="NOVICE"
                        checked={role === "NOVICE"}
                        onChange={() => setRole("NOVICE")}
                        className="accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">Novice</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="MEMBER"
                        checked={role === "MEMBER"}
                        onChange={() => setRole("MEMBER")}
                        className="accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">Ancien</span>
                    </label>
                  </div>
                </form>
              </div>
              {/* Liste des emails */}
              <div className="flex flex-col flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Liste des emails autorisés{" "}
                  <span className="ml-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {authorizedEmails.length}
                  </span>
                </p>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {authorizedEmails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <Mail className="w-10 h-10 mb-3 opacity-40" />
                      <p className="text-sm font-medium">
                        Aucun email autorisé
                      </p>
                    </div>
                  ) : (
                    authorizedEmails.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-gray-800 truncate">
                              {item.email}
                            </span>
                            <span
                              className={`text-xs font-semibold ${
                                item.role === "MEMBER"
                                  ? "text-green-600"
                                  : "text-orange-500"
                              }`}
                            >
                              {item.role === "MEMBER" ? "Ancien" : "Novice"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteEmail(item.id)}
                          className="ml-3 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
