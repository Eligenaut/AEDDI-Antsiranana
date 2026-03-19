'use client';
import { useEffect, useRef, useState } from 'react';
import { X, Loader2, MapPin, ImageIcon, Calendar, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';

const CATEGORIES = [
  { value: 'Sport',     emoji: '⚽', label: 'Sport' },
  { value: 'Culture',   emoji: '🎭', label: 'Culture' },
  { value: 'Formation', emoji: '🎓', label: 'Formation' },
  { value: 'Autre',     emoji: '📌', label: 'Autre' },
];

const STATUT_OPTIONS = [
  { value: 'en_cours',   label: '🟢 En cours' },
  { value: 'terminee',   label: '⚫ Terminée' },
  { value: 'en_attente', label: '🟡 En attente' },
  { value: 'annulee',    label: '🔴 Annulée' },
];

export function ShowActivite({ isOpen, onClose, activiteId }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activite, setActivite] = useState(null);

  useEffect(() => setMounted(true), []);

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

  if (!mounted) return null;

  const statutLabel = STATUT_OPTIONS.find(s => s.value === activite?.statut)?.label ?? '';
  const categorieLabel = CATEGORIES.find(c => c.value === activite?.categorie);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-[9999]"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* PANEL */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white shadow-2xl z-[10000] flex flex-col overflow-y-auto"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold">Détail de l'activité</h2>
              <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-5 flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                  <p className="text-sm text-gray-400 font-medium">Chargement...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              ) : activite ? (
                <>
                  {/* ── Image ── */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" /> Image
                    </label>
                    {activite.image ? (
                      <div className="h-44 rounded-xl overflow-hidden border border-gray-200">
                        <img src={activite.image} alt={activite.nom} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-36 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-300">
                        <ImageIcon className="w-7 h-7" />
                        <span className="text-sm">Aucune image</span>
                      </div>
                    )}
                  </div>

                  {/* ── Nom ── */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                    <div className="w-full px-3 py-2 text-black border border-gray-200 rounded-lg text-sm bg-gray-50">
                      {activite.nom}
                    </div>
                  </div>

                  {/* ── Description ── */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <div className="w-full px-3 py-2 border text-black rounded-lg text-sm bg-gray-50 border-gray-200 min-h-[80px] leading-relaxed whitespace-pre-wrap">
                      {activite.description}
                    </div>
                  </div>

                  {/* ── Dates ── */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Date début
                      </label>
                      <div className="w-full px-3 py-2 text-black border border-gray-200 rounded-lg text-sm bg-gray-50">
                        {new Date(activite.date_debut).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Date fin
                      </label>
                      <div className="w-full px-3 py-2 text-black border border-gray-200 rounded-lg text-sm bg-gray-50">
                        {new Date(activite.date_fin).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  {/* ── Lieu ── */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Lieu
                    </label>
                    <div className="w-full px-3 py-2 text-black border border-gray-200 rounded-lg text-sm bg-gray-50">
                      {activite.lieu}
                    </div>
                  </div>

                  {/* ── Image lieu ── */}
                  {activite.image_lieu && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" /> Photo du lieu
                      </label>
                      <div className="h-36 rounded-xl overflow-hidden border border-gray-200">
                        <img src={activite.image_lieu} alt="lieu" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  {/* ── Catégorie + Statut ── */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Catégorie</label>
                      <div className="w-full px-3 py-2 text-black border border-gray-200 rounded-lg text-sm bg-gray-50">
                        {categorieLabel ? `${categorieLabel.emoji} ${categorieLabel.label}` : activite.categorie}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Statut</label>
                      <div className="w-full px-3 py-2 text-black border border-gray-200 rounded-lg text-sm bg-gray-50">
                        {statutLabel}
                      </div>
                    </div>
                  </div>

                  {/* ── Galerie ── */}
                  {activite.galerie?.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" /> Galerie
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {activite.galerie.map((img, i) => (
                          <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-200">
                            <img src={img} alt={`galerie-${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
                          </div>
                        ))}
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