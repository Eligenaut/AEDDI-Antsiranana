"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  Trash2,
  RefreshCw,
  UserCheck,
  Clock,
  ShieldX,
  BadgeCheck,
  Inbox,
} from "lucide-react";
import Notiflix from "notiflix";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";

const ROLE_STYLES = {
  NOVICE: { label: "Novice", cls: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  MEMBER: { label: "Ancien", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  BUREAU: { label: "Bureau", cls: "bg-indigo-50 text-indigo-700 ring-indigo-200", dot: "bg-indigo-500" },
  ADMIN: { label: "Admin", cls: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-500" },
};

function RoleBadge({ role, subRole }) {
  const cfg = ROLE_STYLES[role] || ROLE_STYLES.NOVICE;
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${cfg.cls}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </span>
      {role === "BUREAU" && subRole?.length > 0 && (
        <span className="hidden md:inline-flex text-xs text-gray-400 font-medium">
          {subRole.join(", ").toLowerCase().replace(/_/g, " ")}
        </span>
      )}
    </div>
  );
}

function StatusBadge({ registered }) {
  if (registered) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 px-2.5 py-1 text-xs font-semibold">
        <UserCheck className="w-3.5 h-3.5" />
        Inscrit
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200 px-2.5 py-1 text-xs font-semibold">
      <Clock className="w-3.5 h-3.5" />
      En attente
    </span>
  );
}

function VerifiedBadge({ verified, registered }) {
  if (!registered) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
        <ShieldX className="w-3.5 h-3.5" />
        — 
      </span>
    );
  }
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 text-green-700 ring-1 ring-inset ring-green-200 px-2.5 py-1 text-xs font-semibold">
        <BadgeCheck className="w-3.5 h-3.5" />
        Vérifié
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-200 px-2.5 py-1 text-xs font-semibold">
      <ShieldX className="w-3.5 h-3.5" />
      Non vérifié
    </span>
  );
}

function Initial({ email }) {
  const letter = (email?.[0] || "?").toUpperCase();
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-bold shadow-sm">
      {letter}
    </span>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const row = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, x: -12, transition: { duration: 0.18 } },
};

export default function AuthorizedEmailsPage() {
  const router = useRouter();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${url}admin/authorized-emails`, {
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const response = await resp.json();
      if (response.success && response.data) {
        setEmails(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleDeleteEmail = (item) => {
    Notiflix.Confirm.show(
      "Supprimer l'email ?",
      `Êtes-vous sûr de vouloir supprimer « ${item.email} » de la liste ?`,
      "Supprimer",
      "Annuler",
      async () => {
        try {
          const resp = await fetch(
            `${url}admin/delete-authorized-email/${item.id}`,
            {
              method: "DELETE",
              credentials: "include",
              headers: getAuthHeaders(),
            },
          );
          const response = await resp.json();
          if (response.success) {
            Notiflix.Notify.success("Email supprimé !");
            setEmails((prev) => prev.filter((e) => e.id !== item.id));
          } else {
            Notiflix.Notify.failure(response.message);
          }
        } catch (err) {
          Notiflix.Notify.failure("Erreur réseau");
        }
      },
    );
  };

  const inscrits = emails.filter((e) => e.registered).length;
  const enAttente = emails.length - inscrits;

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 pb-20 lg:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.push("/dashboard/membres")}
              className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-slate-900 hover:border-violet-300 hover:bg-violet-50 transition-all active:scale-95"
              title="Retour aux membres"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Emails autorisés
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Liste des emails autorisés à s'inscrire
              </p>
            </div>
          </div>
          <button
            onClick={fetchEmails}
            disabled={loading}
            className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all active:scale-95 disabled:opacity-60"
            title="Actualiser"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-slate-200">
            <Inbox className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-semibold text-slate-900">
              {emails.length}
            </span>
            <span className="text-xs text-slate-500">total</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-slate-200">
            <UserCheck className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-slate-900">
              {inscrits}
            </span>
            <span className="text-xs text-slate-500">inscrits</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-slate-200">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-900">
              {enAttente}
            </span>
            <span className="text-xs text-slate-500">en attente</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Mail className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              Liste des emails
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent mb-3"></div>
            <span className="text-sm font-medium">Chargement...</span>
          </div>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Mail className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm font-medium text-slate-500">
              Aucun email autorisé
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/70 text-left text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="px-5 sm:px-6 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Rôle</th>
                  <th className="px-5 py-3 font-semibold">Statut</th>
                  <th className="px-5 py-3 font-semibold hidden md:table-cell">
                    Vérification email
                  </th>
                  <th className="px-5 py-3 font-semibold hidden sm:table-cell">
                    Ajouté le
                  </th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <AnimatePresence initial={false}>
                <motion.tbody
                  key="rows"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {emails.map((item) => (
                    <motion.tr
                      key={item.id}
                      variants={row}
                      layout
                      exit="exit"
                      className="group border-t border-slate-100 transition-colors hover:bg-violet-50/40"
                    >
                      <td className="px-5 sm:px-6 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Initial email={item.email} />
                          <div>
                            <div className="text-sm font-semibold text-slate-800 group-hover:text-violet-700 transition-colors">
                              {item.email}
                            </div>
                            <div className="text-xs text-slate-400 md:hidden">
                              {item.registered ? "Inscrit" : "En attente"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <RoleBadge role={item.role} subRole={item.sub_role} />
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <StatusBadge registered={item.registered} />
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap hidden md:table-cell">
                        <VerifiedBadge
                          verified={item.verified}
                          registered={item.registered}
                        />
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm text-slate-500 hidden sm:table-cell">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDeleteEmail(item)}
                          className="p-2 rounded-xl text-slate-300 hover:text-red-600 hover:bg-red-50 hover:scale-105 active:scale-95 transition-all"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </AnimatePresence>
            </table>
          </div>
        )}
      </motion.div>
    </main>
  );
}
