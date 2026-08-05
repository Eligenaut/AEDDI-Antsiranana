'use client';

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";

const ROLE_LABELS = {
  NOVICE: 'Novice',
  MEMBER: 'Ancien',
  BUREAU: 'Membre du bureau',
};

const SUB_ROLE_LABELS = {
  PRESIDENT: 'Président',
  VICE_PRESIDENT: 'Vice-Président',
  TRESORIER: 'Trésorier',
  VICE_TRESORIER: 'Vice-Trésorier',
  COMMISSAIRE_COMPTE: 'Commissaire aux comptes',
  COMMISSION_CERCLE_ETUDE: "Commission Cercle d'étude",
  COMMISSION_INFORMATIQUE: 'Commission Informatique',
  COMMISSION_LOGEMENT: 'Commission Logement',
  COMMISSION_SOCIAL: 'Commission Social',
  COMMISSION_FETE: 'Commission Fête',
  COMMISSION_SPORT: 'Commission Sport',
  COMMISSION_COMMUNICATION: 'Commission Communication',
  COMMISSION_ENVIRONNEMENT: 'Commission Environnement',
};

const Label = ({ children }) => (
  <label className="block text-sm font-semibold text-gray-800 mb-1">
    {children}
  </label>
);

const Field = ({ value }) => (
  <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium bg-gray-50 text-sm min-h-[38px]">
    {value || <span className="text-gray-400">—</span>}
  </div>
);

export function ShowMember({ isOpen, onClose, memberId }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [member, setMember] = useState(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen && memberId) {
      setLoading(true);
      setError(null);
      axios
        .get(`${url}members/${memberId}`, { headers: getAuthHeaders() })
        .then((res) => {
          if (res.data.success) setMember(res.data.data);
          else setError("Erreur lors du chargement du membre");
        })
        .catch(() => setError("Erreur lors du chargement du membre"))
        .finally(() => setLoading(false));
    }
  }, [isOpen, memberId]);

  if (!mounted) return null;

  const getAdresse = (m) => {
    if (!m) return null;
    if (m.logement === 'ville' && m.quartier)     return m.quartier;
    if (m.logement === 'campus' && m.bloc_campus) return m.bloc_campus;
    return null;
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[620px] bg-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Détail du membre</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200">
                <X className="w-6 h-6" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-700 font-medium">Chargement...</span>
              </div>
            ) : error ? (
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            ) : member ? (
              <div className="p-6 space-y-6">

                {/* ── Photo de profil ── */}
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">Photo de profil</h3>
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt="avatar"
                      className="h-24 w-24 rounded-full object-cover border-2 border-gray-300"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center border-2 border-gray-300">
                      <span className="text-3xl font-bold text-blue-600">
                        {member.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Identité ── */}
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">Identité</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nom</Label>
                      <Field value={member.nom} />
                    </div>
                    <div>
                      <Label>Prénom</Label>
                      <Field value={member.prenom} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Field value={member.email} />
                    </div>
                    <div>
                      <Label>Téléphone</Label>
                      <Field value={member.telephone} />
                    </div>
                  </div>
                </div>

                {/* ── Rôle ── */}
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">Rôle</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Rôle</Label>
                      <Field value={ROLE_LABELS[member.role] || member.role} />
                    </div>
                    {member.sub_role?.length > 0 && (
                      <div>
                        <Label>Sous-rôle</Label>
                        <Field value={SUB_ROLE_LABELS[member.sub_role[0]] || member.sub_role[0]} />
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Académique ── */}
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">Académique</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Établissement</Label>
                      <Field value={member.etablissement} />
                    </div>
                    <div>
                      <Label>Parcours</Label>
                      <Field value={member.parcours} />
                    </div>
                    <div>
                      <Label>Niveau</Label>
                      <Field value={member.niveau} />
                    </div>
                    <div>
                      <Label>Promotion</Label>
                      <Field value={member.promotion} />
                    </div>
                  </div>
                </div>

                {/* ── Logement ── */}
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">Logement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Type de logement</Label>
                      <Field value={member.logement === 'campus' ? 'Campus' : member.logement === 'ville' ? 'Ville' : member.logement} />
                    </div>
                    <div>
                      <Label>{member.logement === 'campus' ? 'Bloc campus' : 'Quartier'}</Label>
                      <Field value={getAdresse(member)} />
                    </div>
                  </div>
                </div>

              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}