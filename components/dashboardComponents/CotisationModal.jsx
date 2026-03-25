'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Trash2, Save, Loader2, AlertCircle, CheckCircle, DollarSign, User } from 'lucide-react';

export function CotisationModal({ isOpen, onClose, user, onUpdate }) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [notifyCloseOnExit, setNotifyCloseOnExit] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeUser, setActiveUser] = useState(user || null);
  const [cotisations, setCotisations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalCotisations, setOriginalCotisations] = useState([]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isOpen && user) {
      setActiveUser(user);
      setIsVisible(true);
      setNotifyCloseOnExit(false);
      setClosing(false);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, user, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = isVisible ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isVisible, mounted]);

  useEffect(() => {
    if (isOpen && user?.id) fetchCotisations(user.id);
  }, [isOpen, user]);

  const fetchCotisations = async (memberId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${url}cotisations/member/${memberId}`, { headers: getAuthHeaders() });
      if (response.data.success) {
        const data = response.data.data.map((c) => ({
          cotisation: { id: c.cotisation.id, nom: c.cotisation.nom, montant: c.cotisation.montant },
          statut: c.statut,
          montant_restant: c.montant_restant || 0,
        }));
        setCotisations(data);
        setOriginalCotisations(JSON.parse(JSON.stringify(data)));
        setHasChanges(false);
      } else {
        setError('Erreur lors du chargement des cotisations');
      }
    } catch (e) {
      setError('Erreur lors du chargement des cotisations');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (idx, field, value) => {
    setCotisations((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
    setHasChanges(true);
  };

  const handleUpdateAll = async () => {
    setUpdating(true);
    setError(null);
    try {
      const promises = cotisations.map(async (cotisation, idx) => {
        const original = originalCotisations[idx];
        if (original && (original.statut !== cotisation.statut || original.montant_restant !== cotisation.montant_restant)) {
          return axios.put(
            `${url}cotisations/${cotisation.cotisation.id}/member/${activeUser?.id}/status`,
            { statut: cotisation.statut, montant_restant: cotisation.statut === 'reste' ? cotisation.montant_restant : 0 },
            { headers: getAuthHeaders() }
          );
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      setHasChanges(false);
      if (onUpdate) onUpdate();
    } catch (e) {
      setError('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (cotisation) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette cotisation pour ce membre ?')) return;
    setUpdating(true);
    setError(null);
    try {
      await axios.delete(`${url}cotisations/${cotisation.cotisation.id}/member/${activeUser?.id}`, { headers: getAuthHeaders() });
      await fetchCotisations(activeUser.id);
      if (onUpdate) onUpdate();
    } catch (e) {
      setError('Erreur lors de la suppression');
    } finally {
      setUpdating(false);
    }
  };

  const handleClose = () => {
    if (updating || closing) return;
    setClosing(true);
    setNotifyCloseOnExit(true);
    setIsVisible(false);
  };

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'paye':     return { label: 'Payé',      bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
      case 'non_paye': return { label: 'Non payé',  bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     dot: 'bg-red-500' };
      case 'reste':    return { label: 'Reste dû',  bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-500' };
      default:         return { label: statut,       bg: 'bg-gray-50',    text: 'text-gray-700',    border: 'border-gray-200',    dot: 'bg-gray-400' };
    }
  };

  const totalMontant   = cotisations.reduce((s, c) => s + Number(c.cotisation.montant), 0);
  const totalPaye      = cotisations.filter(c => c.statut === 'paye').length;
  const totalNonPaye   = cotisations.filter(c => c.statut === 'non_paye').length;
  const totalReste     = cotisations.filter(c => c.statut === 'reste').length;

  if (!mounted) return null;
  if (!activeUser && !isVisible) return null;

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        if (notifyCloseOnExit) { onClose?.(); setActiveUser(null); setNotifyCloseOnExit(false); }
        if (!isOpen) setActiveUser(null);
        setClosing(false);
      }}
    >
      {isVisible && activeUser && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[680px] bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    {activeUser.avatar
                      ? <img src={activeUser.avatar} alt={activeUser.name} className="w-10 h-10 rounded-xl object-cover" />
                      : <span className="text-white font-bold text-lg">{activeUser.name?.charAt(0).toUpperCase()}</span>
                    }
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white leading-tight">Cotisations</h2>
                    <p className="text-blue-100 text-sm font-medium">{activeUser.name}</p>
                  </div>
                </div>
                <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* ── Stats rapides ── */}
              {!loading && cotisations.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/15 rounded-xl px-3 py-2 text-center">
                    <p className="text-white font-bold text-xl leading-none">{totalPaye}</p>
                    <p className="text-blue-100 text-xs mt-1">Payées</p>
                  </div>
                  <div className="bg-white/15 rounded-xl px-3 py-2 text-center">
                    <p className="text-white font-bold text-xl leading-none">{totalNonPaye}</p>
                    <p className="text-blue-100 text-xs mt-1">Non payées</p>
                  </div>
                  <div className="bg-white/15 rounded-xl px-3 py-2 text-center">
                    <p className="text-white font-bold text-xl leading-none">{totalReste}</p>
                    <p className="text-blue-100 text-xs mt-1">Reste dû</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Contenu ── */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-sm text-gray-500 font-medium">Chargement des cotisations...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              ) : cotisations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
                  <DollarSign className="w-10 h-10" />
                  <p className="text-sm font-medium">Aucune cotisation assignée</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cotisations.map((c, idx) => {
                    const badge = getStatutBadge(c.statut);
                    return (
                      <div key={c.cotisation.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        {/* Ligne 1 — nom + badge statut + delete */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{c.cotisation.nom}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Montant total : <span className="font-semibold text-gray-700">{Number(c.cotisation.montant).toLocaleString('fr-FR')} AR</span>
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(c)}
                            disabled={updating}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Ligne 2 — statut + montant restant */}
                        <div className="flex items-center gap-3">
                          {/* Select statut */}
                          <div className="flex-1">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Statut</label>
                            <select
                              value={c.statut}
                              onChange={(e) => handleChange(idx, 'statut', e.target.value)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                            >
                              <option value="paye">✅ Payé</option>
                              <option value="non_paye">❌ Non payé</option>
                              <option value="reste">⚠️ Reste dû</option>
                            </select>
                          </div>

                          {/* Montant restant — visible seulement si reste */}
                          {c.statut === 'reste' && (
                            <div className="flex-1">
                              <label className="text-xs font-medium text-gray-500 mb-1 block">Montant restant (AR)</label>
                              <input
                                type="number"
                                min={0}
                                max={c.cotisation.montant}
                                value={c.montant_restant}
                                onChange={(e) => handleChange(idx, 'montant_restant', parseFloat(e.target.value) || 0)}
                                className="w-full border border-amber-300 bg-amber-50 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                                placeholder="0"
                              />
                            </div>
                          )}

                          {/* Badge statut actuel */}
                          {c.statut !== 'reste' && (
                            <div className="flex-1 flex items-end pb-0.5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border} w-full justify-center`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                                {badge.label}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            {!loading && cotisations.length > 0 && (
              <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
                <div className="text-sm">
                  {hasChanges ? (
                    <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      Modifications non sauvegardées
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Tout est à jour
                    </span>
                  )}
                </div>
                <button
                  onClick={handleUpdateAll}
                  disabled={!hasChanges || updating}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  {updating
                    ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Sauvegarde...</span></>
                    : <><Save className="w-4 h-4" /><span>Sauvegarder</span></>
                  }
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}