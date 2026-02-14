'use client';
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Users, Calendar, AlertCircle } from "lucide-react";
import axios from "axios";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";

export function ShowMember({ isOpen, onClose, memberId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (isOpen && memberId) {
      setLoading(true);
      setError(null);

      axios
        .get(`${url}members/${memberId}`, { headers: getAuthHeaders() })
        .then((res) => {
          if (res.data.success) {
            setMember(res.data.data);
          } else {
            setError("Erreur lors du chargement du membre");
          }
        })
        .catch(() => setError("Erreur lors du chargement du membre"))
        .finally(() => setLoading(false));
    }
  }, [isOpen, memberId]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-gradient-to-b from-black/30 to-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white flex items-center justify-between">
              <h2 className="text-xl font-bold">Détail du membre</h2>
              <button
                onClick={onClose}
                className="hover:bg-white/20 p-2 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              ) : member ? (
                <div className="space-y-6">
                  <div className="text-center">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt="avatar"
                        className="w-20 h-20 rounded-full border-4 border-blue-100 mx-auto mb-4 shadow-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Users className="w-10 h-10 text-blue-600" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-gray-600">{member.email}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Date d'inscription
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {member.created_at
                          ? new Date(member.created_at).toLocaleDateString(
                              "fr-FR"
                            )
                          : "Non disponible"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Type de compte
                      </div>
                      <div className="flex items-center space-x-2">
                        {member.google_id ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="font-medium">Google</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="font-medium">Classique</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
