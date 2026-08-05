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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    try {
      const resp = await fetch(`${url}admin/add-authorized-email`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email: email.trim(), role }),
      });

      const response = await resp.json();

      if (response.success) {
        Notiflix.Notify.success("Email ajouté avec succès !");
        setEmail("");
        setRole("NOVICE");
        onEmailAdded?.();
        onClose();
      } else {
        Notiflix.Notify.failure(response.message || "Erreur lors de l'ajout");
      }
    } catch (err) {
      Notiflix.Notify.failure(err.message || "Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-blue-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold tracking-tight">
                Ajouter un email autorisé
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-blue-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleAddEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@domaine.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rôle
                  </label>
                  <div className="flex gap-4">
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
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {isLoading ? "Ajout..." : "Ajouter"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
