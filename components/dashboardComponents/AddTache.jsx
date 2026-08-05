"use client";
import { useEffect, useRef, useState } from "react";
import {
  X,
  Loader2,
  Save,
  User,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import axios from "axios";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";
import Notiflix from "notiflix";
import { MultiSelect } from "./MultiSelect";

const PRIORITES = [
  { value: "basse", label: "Basse" },
  { value: "moyenne", label: "Moyenne" },
  { value: "haute", label: "Haute" },
  { value: "urgente", label: "Urgente" },
];

const STATUTS = [
  { value: "en_attente", label: "En attente" },
  { value: "en_cours", label: "En cours" },
  { value: "terminee", label: "Terminée" },
  { value: "annulee", label: "Annulée" },
];

export function AddTache({ isOpen, onClose, onSubmit, initialValues }) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date_debut: "",
    assigned_to: [],
    priorite: "moyenne",
    date_echeance: "",
    statut: "en_attente",
  });
  const [bureauMembers, setBureauMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        titre: initialValues.titre || "",
        description: initialValues.description || "",
        date_debut: initialValues.date_debut || "",
        assigned_to: initialValues.assigned_to?.map((u) => u.id) || [],
        priorite: initialValues.priorite || "moyenne",
        date_echeance: initialValues.date_echeance || "",
        statut: initialValues.statut || "en_attente",
      });
    } else {
      resetForm();
    }
  }, [initialValues, isOpen]);

  useEffect(() => {
    const fetchBureauMembers = async () => {
      try {
        const response = await axios.get(`${url}members`, {
          headers: getAuthHeaders(),
        });
        if (response.data.success) {
          const bureau = response.data.data.filter(
            (m) => m.role === "BUREAU"
          );
          setBureauMembers(bureau);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des membres:", error);
      }
    };
    if (isOpen) {
      fetchBureauMembers();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      titre: "",
      description: "",
      date_debut: "",
      assigned_to: [],
      priorite: "moyenne",
      date_echeance: "",
      statut: "en_attente",
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titre.trim()) newErrors.titre = "Le titre est requis";
    if (!formData.assigned_to || formData.assigned_to.length === 0)
      newErrors.assigned_to = "Veuillez assigner la tâche à au moins un membre";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        titre: formData.titre.trim(),
        description: formData.description.trim(),
        date_debut: formData.date_debut || null,
        assigned_to: formData.assigned_to,
        priorite: formData.priorite,
        date_echeance: formData.date_echeance || null,
        statut: formData.statut,
      };

      let response;

      if (initialValues?.id) {
        response = await axios.put(
          `${url}taches/${initialValues.id}`,
          payload,
          { headers: getAuthHeaders() }
        );
      } else {
        response = await axios.post(`${url}taches`, payload, {
          headers: getAuthHeaders(),
        });
      }

      if (response.data.success) {
        Notiflix.Notify.success(
          `Tâche ${initialValues ? "modifiée" : "créée"} avec succès !`
        );
        onSubmit(response.data.data || {});
        handleClose();
      } else {
        Notiflix.Notify.failure(
          response.data.message || "Erreur lors de la création/modification"
        );
      }
    } catch (err) {
      Notiflix.Notify.failure(
        err.response?.data?.message ||
          "Erreur lors de la création/modification"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
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
            onClick={handleClose}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white shadow-2xl z-[10000] flex flex-col overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold">
                {initialValues ? "Modifier la tâche" : "Nouvelle tâche"}
              </h2>
              <button
                onClick={handleClose}
                className="hover:bg-white/20 p-2 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => handleInputChange("titre", e.target.value)}
                  placeholder="Ex : Préparer le rapport financier"
                  className={`w-full px-3 py-2 text-black border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${errors.titre ? "border-red-300" : "border-gray-300"}`}
                  disabled={isSubmitting}
                />
                {errors.titre && (
                  <p className="text-red-500 text-xs mt-1">{errors.titre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  placeholder="Décrivez la tâche..."
                  className="w-full px-3 py-2 border text-black rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none border-gray-300"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Assigner à *
                </label>
                <MultiSelect
                  options={bureauMembers}
                  selectedValues={formData.assigned_to}
                  onChange={(values) => handleInputChange("assigned_to", values)}
                  placeholder="Sélectionner un ou plusieurs membres"
                  disabled={isSubmitting}
                  error={errors.assigned_to}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Date début
                  </label>
                  <input
                    type="date"
                    value={formData.date_debut}
                    onChange={(e) =>
                      handleInputChange("date_debut", e.target.value)
                    }
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Date échéance
                  </label>
                  <input
                    type="date"
                    value={formData.date_echeance}
                    onChange={(e) =>
                      handleInputChange("date_echeance", e.target.value)
                    }
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Priorité
                </label>
                <select
                  value={formData.priorite}
                  onChange={(e) =>
                    handleInputChange("priorite", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg text-black px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isSubmitting}
                >
                  {PRIORITES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) =>
                    handleInputChange("statut", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg text-black px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isSubmitting}
                >
                  {STATUTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 flex items-center gap-2 transition text-sm disabled:opacity-50 font-semibold shadow"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {initialValues ? "Mise à jour..." : "Création..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>
                        {initialValues ? "Mettre à jour" : "Créer la tâche"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
