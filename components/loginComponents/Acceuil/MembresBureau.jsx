"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { url } from "../../context/url.js";

// ─── Mapping sub_role → styles & ordre ───────────────────────────────────────
const SUB_ROLE_CONFIG = {
  "president":            { label: "Président",             icon: "👑", badge: "bg-amber-100 text-amber-800",   couleur: "from-yellow-400 to-amber-500",  rang: 1 },
  "vice_president":       { label: "Vice-Président",        icon: "🥈", badge: "bg-slate-100 text-slate-700",   couleur: "from-slate-400 to-slate-600",   rang: 2 },
  "tresorier":            { label: "Trésorier(e)",          icon: "💰", badge: "bg-emerald-100 text-emerald-800",couleur: "from-emerald-400 to-teal-500",  rang: 3 },
  "vice_tresorier":       { label: "Vice-Trésorier(e)",     icon: "💼", badge: "bg-teal-100 text-teal-800",     couleur: "from-teal-400 to-cyan-500",     rang: 4 },
  "commissaire":          { label: "Commissaire aux Comptes",icon: "📋", badge: "bg-blue-100 text-blue-800",    couleur: "from-blue-400 to-indigo-500",   rang: 5 },
  "secretaire":           { label: "Secrétaire",            icon: "📝", badge: "bg-rose-100 text-rose-800",     couleur: "from-rose-400 to-pink-500",     rang: 6 },
  "vice_secretaire":      { label: "Vice-Secrétaire",       icon: "📄", badge: "bg-pink-100 text-pink-800",     couleur: "from-pink-400 to-rose-400",     rang: 7 },
  "conseiller":           { label: "Conseiller",            icon: "🎖️", badge: "bg-indigo-100 text-indigo-700", couleur: "from-indigo-400 to-purple-500", rang: 99 },
};

function getConfig(sub_role) {
  return SUB_ROLE_CONFIG[sub_role?.toLowerCase()] ?? {
    label: sub_role ?? "Membre Bureau",
    icon: "⭐",
    badge: "bg-purple-100 text-purple-700",
    couleur: "from-purple-400 to-pink-500",
    rang: 50,
  };
}

function getPhoto(membre) {
  return membre.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(membre.prenom + ' ' + membre.nom)}&background=7c3aed&color=fff&size=200`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonBureauCard() {
  return (
    <div className="rounded-3xl overflow-hidden border border-gray-100 shadow bg-white animate-pulse">
      <div className="h-32 bg-gray-200" />
      <div className="-mt-20 flex justify-center"><div className="w-40 h-40 rounded-full bg-gray-300 border-4 border-white" /></div>
      <div className="px-5 pb-5 pt-3 flex flex-col items-center gap-2">
        <div className="h-5 w-24 bg-gray-200 rounded-full" />
        <div className="h-4 w-36 bg-gray-200 rounded" />
        <div className="h-3 w-28 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ─── Carte bureau ─────────────────────────────────────────────────────────────
function BureauCard({ membre, index }) {
  const config      = getConfig(membre.sub_role);
  const isPresident = config.rang === 1;
  const fullName    = [membre.prenom, membre.nom].filter(Boolean).join(" ") || membre.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className={`relative flex flex-col items-center text-center rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border ${
        isPresident ? "border-amber-300 ring-2 ring-amber-200" : "border-gray-100"
      }`}
    >
      {/* Bandeau gradient */}
      <div className={`w-full h-32 bg-gradient-to-br ${config.couleur} relative`}>
        {isPresident && (
          <div className="absolute top-3 right-3 bg-white/90 text-amber-600 text-xs font-black px-2.5 py-1 rounded-full shadow">
            ★ Président
          </div>
        )}
      </div>

      {/* Photo */}
      <div className={`-mt-20 w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden ring-2 ${isPresident ? "ring-amber-300" : "ring-gray-100"}`}>
        <img src={getPhoto(membre)} alt={fullName} className="w-full h-full object-cover" />
      </div>

      {/* Infos */}
      <div className="px-5 pb-5 pt-3 flex flex-col items-center gap-2 w-full">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${config.badge}`}>
          {config.icon} {config.label}
        </span>
        <h3 className="text-base font-extrabold text-gray-900 leading-tight">{fullName}</h3>
        {membre.etablissement && (
          <p className="text-xs text-gray-400 leading-relaxed">{membre.etablissement}</p>
        )}
        {membre.telephone && (
          <a
            href={`tel:${membre.telephone}`}
            className="mt-2 flex items-center gap-1.5 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 hover:border-purple-200 transition-all duration-200"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6.22 6.22l1.96-1.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            {membre.telephone}
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ─── Carte conseiller ─────────────────────────────────────────────────────────
function ConseillerCard({ membre, index }) {
  const fullName = [membre.prenom, membre.nom].filter(Boolean).join(" ") || membre.name;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="flex flex-col items-center text-center bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-indigo-100 transition-all duration-200"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden mb-3 ring-2 ring-indigo-100 shadow">
        <img src={getPhoto(membre)} alt={fullName} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full mb-1">Conseiller</span>
      <p className="text-sm font-extrabold text-gray-800 leading-tight">{fullName}</p>
      {membre.etablissement && <p className="text-xs text-gray-400 mt-0.5 mb-2">{membre.etablissement}</p>}
      {membre.telephone && (
        <a href={`tel:${membre.telephone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 font-medium transition-colors">
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6.22 6.22l1.96-1.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          {membre.telephone}
        </a>
      )}
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function MembresBureau() {
  const [bureau, setBureau]         = useState([]);
  const [conseillers, setConseillers] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    fetch(`${url}accueil/bureau`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const tous = data.data;
          // Séparer conseillers et bureau exécutif, trier par rang
          const exec = tous
            .filter(m => m.sub_role?.toLowerCase() !== 'conseiller')
            .sort((a, b) => getConfig(a.sub_role).rang - getConfig(b.sub_role).rang);
          const cons = tous.filter(m => m.sub_role?.toLowerCase() === 'conseiller');
          setBureau(exec);
          setConseillers(cons);
        } else {
          setError("Impossible de charger les membres du bureau.");
        }
      })
      .catch(() => setError("Erreur de connexion au serveur."))
      .finally(() => setLoading(false));
  }, []);

  // Regroupement pour l'affichage (même layout que l'original)
  const president      = bureau.find(m => getConfig(m.sub_role).rang === 1);
  const vicePresident  = bureau.find(m => getConfig(m.sub_role).rang === 2);
  const tresoriers     = bureau.filter(m => [3, 4].includes(getConfig(m.sub_role).rang));
  const reste          = bureau.filter(m => getConfig(m.sub_role).rang >= 5 && getConfig(m.sub_role).rang < 99);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow">
              <span className="text-white text-base font-black">A</span>
            </div>
            <span className="font-extrabold text-gray-800 text-lg tracking-tight">AEDDI</span>
          </a>
          <a href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 font-medium transition-colors">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Retour à l'accueil
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-5 backdrop-blur-sm">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Mandature 2024 – 2025
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
              Membres du Bureau
            </h1>
            <p className="text-purple-200 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Découvrez l'équipe qui pilote l'AEDDI — Association des Étudiants Dynamiques de Diego.
            </p>
            {!loading && (
              <div className="flex justify-center gap-8 mt-8">
                {[
                  { v: bureau.length,      l: "Bureau exécutif" },
                  { v: conseillers.length, l: "Conseillers" },
                  { v: bureau.length + conseillers.length, l: "Total bureau" },
                ].map(s => (
                  <div key={s.l} className="flex flex-col items-center">
                    <span className="text-3xl font-black text-white">{s.v}</span>
                    <span className="text-purple-300 text-xs font-medium">{s.l}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* ── Erreur ── */}
        {error && (
          <div className="text-center py-16 text-gray-400">
            <span className="text-4xl mb-3 block">😕</span>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* ── Bureau exécutif ── */}
        {!error && (
          <section>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
              <div>
                <h2 className="text-2xl font-black text-gray-900">Bureau Exécutif</h2>
                <p className="text-sm text-gray-400">L'équipe dirigeante de l'AEDDI</p>
              </div>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5].map(i => <SkeletonBureauCard key={i} />)}
              </div>
            ) : (
              <>
                {/* Président */}
                {president && (
                  <div className="flex justify-center mb-6">
                    <div className="w-full max-w-xs">
                      <BureauCard membre={president} index={0} />
                    </div>
                  </div>
                )}

                {/* Vice-Président */}
                {vicePresident && (
                  <div className="flex justify-center mb-6">
                    <div className="w-full max-w-xs">
                      <BureauCard membre={vicePresident} index={1} />
                    </div>
                  </div>
                )}

                {/* Trésoriers (2 côte à côte) */}
                {tresoriers.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 max-w-2xl mx-auto">
                    {tresoriers.map((m, i) => <BureauCard key={m.id} membre={m} index={i + 2} />)}
                  </div>
                )}

                {/* Reste (commissaire, secrétaire...) */}
                {reste.length > 0 && (
                  <div className={`grid grid-cols-1 ${reste.length === 1 ? 'flex justify-center' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6 mb-6 max-w-4xl mx-auto`}>
                    {reste.map((m, i) => (
                      <div key={m.id} className={reste.length === 1 ? "w-full max-w-xs" : ""}>
                        <BureauCard membre={m} index={i + 4} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Conseillers */}
                {conseillers.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-sm font-black text-gray-700">🎖️ Conseillers</span>
                      <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                        {conseillers.length} membres
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {conseillers.map((m, i) => <ConseillerCard key={m.id} membre={m} index={i} />)}
                    </div>
                  </div>
                )}

                {bureau.length === 0 && !loading && (
                  <div className="text-center py-16 text-gray-400">
                    <span className="text-4xl mb-3 block">📭</span>
                    <p className="text-sm">Aucun membre du bureau pour le moment.</p>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* ── Footer contact ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 p-8 text-center text-white shadow-xl"
        >
          <h3 className="text-xl font-black mb-2">Vous souhaitez nous rejoindre ?</h3>
          <p className="text-purple-200 text-sm mb-5">
            Contactez notre président ou l'un de nos responsables de commission.
          </p>
          <a
            href="/devenir-membre"
            className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-6 py-3 rounded-xl shadow hover:bg-purple-50 transition-colors text-sm"
          >
            Devenir membre →
          </a>
        </motion.div>

      </div>
    </div>
  );
}