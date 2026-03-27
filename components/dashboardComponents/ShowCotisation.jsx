"use client";
import { useEffect, useState } from "react";
import { X, Loader2, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import axios from "axios";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";

const STATUT_OPTIONS = [
  { value: "en_cours", label: "🟢 En cours" },
  { value: "terminee", label: "⚫ Terminée" },
  { value: "en_attente", label: "🟡 En attente" },
  { value: "annulee", label: "🔴 Annulée" },
];

export function ShowCotisation({
  isOpen,
  onClose,
  cotisationId,
  isAdmin,
  cotisations,
}) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cotisation, setCotisation] = useState(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen && cotisationId) {
      setLoading(true);
      setError(null);
      axios
        .get(`${url}cotisations/${cotisationId}`, { headers: getAuthHeaders() })
        .then((res) => {
          if (res.data.success) setCotisation(res.data.data);
          else setError("Erreur lors du chargement de la cotisation");
        })
        .catch(() => setError("Erreur lors du chargement de la cotisation"))
        .finally(() => setLoading(false));
    }
  }, [isOpen, cotisationId]);

  if (!mounted) return null;

  const memberData = !isAdmin
    ? (() => {
        const c = cotisations?.find((c) => c.id === cotisationId);
        return c
          ? {
              statut_paiement: c.statut_paiement,
              montant_restant: c.montant_restant,
            }
          : undefined;
      })()
    : undefined;

  const statutLabel =
    STATUT_OPTIONS.find((s) => s.value === cotisation?.statut)?.label ?? "";

  const statutPaiementLabel = (statut) => {
    if (statut === "paye") return "✅ Payé";
    if (statut === "reste") return "⚠️ Reste à payer";
    if (statut === "non_paye") return "❌ Non payé";
    return statut;
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-[9999]"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* PANEL */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white shadow-2xl z-[10000] flex flex-col overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold">
                {memberData
                  ? "Mon état de cotisation"
                  : "Détail de la cotisation"}
              </h2>
              <button
                onClick={onClose}
                className="hover:bg-white/20 p-2 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENT */}
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin text-green-500" />
                <p className="text-sm font-medium">Chargement des données...</p>
              </div>
            ) : error ? (
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            ) : cotisation ? (
              <div className="p-6 space-y-5">
                {/* ── Nom ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nom
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium bg-gray-50 text-sm">
                    {cotisation.nom}
                  </div>
                </div>

                {/* ── Description ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium bg-gray-50 text-sm min-h-[80px] leading-relaxed whitespace-pre-wrap">
                    {cotisation.description}
                  </div>
                </div>

                {/* ── Montant ── */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Montant Ancien (AR)
                    </label>
                    <div className="relative">
                      <div className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium bg-gray-50 text-sm">
                        {Number(cotisation.montant_ancien).toLocaleString(
                          "fr-FR",
                        )}{" "}
                        AR
                      </div>
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Montant Novice (AR)
                    </label>
                    <div className="relative">
                      <div className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium bg-gray-50 text-sm">
                        {Number(cotisation.montant_novice).toLocaleString(
                          "fr-FR",
                        )}{" "}
                        AR
                      </div>
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* ── Dates ── */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Date début
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium bg-gray-50 text-sm">
                      {new Date(cotisation.date_debut).toLocaleDateString(
                        "fr-FR",
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Date fin
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium bg-gray-50 text-sm">
                      {new Date(cotisation.date_fin).toLocaleDateString(
                        "fr-FR",
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Statut cotisation ── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Statut
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium bg-gray-50 text-sm">
                    {statutLabel}
                  </div>
                </div>

                {/* ── Vue membre : état de paiement ── */}
                {memberData?.statut_paiement && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Mon état de paiement
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium bg-gray-50 text-sm">
                        {statutPaiementLabel(memberData.statut_paiement)}
                      </div>
                    </div>

                    {memberData.statut_paiement === "reste" &&
                      memberData.montant_restant && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Montant restant (AR)
                          </label>
                          <div className="relative">
                            <div className="w-full pl-10 pr-3 py-2 border border-amber-200 rounded-lg text-amber-800 font-medium bg-amber-50 text-sm">
                              {Number(
                                memberData.montant_restant,
                              ).toLocaleString("fr-FR")}{" "}
                              AR
                            </div>
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
