"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// ─── Données ──────────────────────────────────────────────────────────────────

const bureau = [
  {
    id: 1,
    nom: "VITAMANANA Achad",
    fonction: "Président",
    ecole: "ESAED — École Supérieure d'Agronomie de Diego",
    phone: "+261 34 00 111 01",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    rang: 1,
    couleur: "from-yellow-400 to-amber-500",
    badge: "bg-amber-100 text-amber-800",
    icon: "👑",
  },
  {
    id: 2,
    nom: "RAKOTOSON Fidy",
    fonction: "Vice-Président",
    ecole: "ISPM — Institut Supérieur Polytechnique de Madagascar",
    phone: "+261 34 00 111 02",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    rang: 2,
    couleur: "from-slate-400 to-slate-600",
    badge: "bg-slate-100 text-slate-700",
    icon: "🥈",
  },
  {
    id: 3,
    nom: "RANDRIA Miora",
    fonction: "Trésorière",
    ecole: "ISCAM — Institut Supérieur de la Communication",
    phone: "+261 34 00 111 03",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    rang: 3,
    couleur: "from-emerald-400 to-teal-500",
    badge: "bg-emerald-100 text-emerald-800",
    icon: "💰",
  },
  {
    id: 4,
    nom: "ANDRIANTSOA Voahary",
    fonction: "Vice-Trésorière",
    ecole: "ISCAM — Institut Supérieur de la Communication",
    phone: "+261 34 00 111 04",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    rang: 4,
    couleur: "from-teal-400 to-cyan-500",
    badge: "bg-teal-100 text-teal-800",
    icon: "💼",
  },
  {
    id: 5,
    nom: "RAHARISOA Jean-Paul",
    fonction: "Commissaire aux Comptes",
    ecole: "ESPA — École Supérieure Polytechnique d'Antsiranana",
    phone: "+261 34 00 111 05",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    rang: 5,
    couleur: "from-blue-400 to-indigo-500",
    badge: "bg-blue-100 text-blue-800",
    icon: "📋",
  },
];

const conseillers = [
  { id: 1, nom: "RAKOTOMALALA Soa", ecole: "ESAED", phone: "+261 34 00 111 10", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80" },
  { id: 2, nom: "ANDRIANTSOA Fidy", ecole: "ISPM", phone: "+261 34 00 111 11", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id: 3, nom: "RASOLOFO Hery", ecole: "ESPA", phone: "+261 34 00 111 12", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  { id: 4, nom: "RANDRIAMAHEFA Voha", ecole: "ISCAM", phone: "+261 34 00 111 13", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
  { id: 5, nom: "RAKOTONDRAIBE Ny", ecole: "ESAED", phone: "+261 34 00 111 14", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80" },
  { id: 6, nom: "ANDRIANA Mialisoa", ecole: "ISPM", phone: "+261 34 00 111 15", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
  { id: 7, nom: "RAZANADRAKOTO Fy", ecole: "ESPA", phone: "+261 34 00 111 16", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" },
  { id: 8, nom: "RAHARISON Toky", ecole: "ISCAM", phone: "+261 34 00 111 17", photo: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&q=80" },
];


const commissions = [
  {
    id: "logement",
    nom: "Commission Logement",
    description: "Gère l'hébergement des membres et facilite l'accès à des logements abordables et sécurisés à Diego.",
    emoji: "🏠",
    couleur: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    membres: [
      { nom: "RASOLO Hery", ecole: "ESAED", phone: "+261 34 00 222 01", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" },
      { nom: "RAKOTONDRABE Lova", ecole: "ISPM", phone: "+261 34 00 222 02", photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&q=80" },
      { nom: "ANDRIANA Soa", ecole: "ISCAM", phone: "+261 34 00 222 03", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
      { nom: "RAKOTO Mamy", ecole: "ESPA", phone: "+261 34 00 222 04", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&q=80" },
    ],
  },
  {
    id: "social",
    nom: "Commission Sociale",
    description: "Organise les événements sociaux, les activités de cohésion et assure le soutien moral des membres.",
    emoji: "🤝",
    couleur: "from-pink-500 to-rose-500",
    bgLight: "bg-pink-50",
    border: "border-pink-200",
    badge: "bg-pink-100 text-pink-700",
    membres: [
      { nom: "RANDRIAMAHARO Tiana", ecole: "ISCAM", phone: "+261 34 00 333 01", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80" },
      { nom: "RASOLOFONIAINA Ny", ecole: "ESAED", phone: "+261 34 00 333 02", photo: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=300&q=80" },
      { nom: "ANDRIAMANANJARA Fy", ecole: "ISPM", phone: "+261 34 00 333 03", photo: "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=300&q=80" },
      { nom: "RAKOTOARISOA Haja", ecole: "ESPA", phone: "+261 34 00 333 04", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80" },
      { nom: "RABENASOLO Vatsy", ecole: "ISCAM", phone: "+261 34 00 333 05", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80" },
    ],
  },
  {
    id: "informatique",
    nom: "Commission Informatique",
    description: "Assure la gestion numérique des dossiers membres, du site web et des outils digitaux de l'association.",
    emoji: "💻",
    couleur: "from-purple-500 to-violet-500",
    bgLight: "bg-purple-50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    membres: [
      { nom: "RANARIVO Tsiry", ecole: "ESPA — Génie Informatique", phone: "+261 34 00 444 01", photo: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=300&q=80" },
      { nom: "RAKOTONDRAVONY Ando", ecole: "ISPM — Informatique", phone: "+261 34 00 444 02", photo: "https://images.unsplash.com/photo-1548544149-4835e62ee5b3?w=300&q=80" },
    ],
  },
  {
    id: "environnement",
    nom: "Commission Environnement",
    description: "Mène des actions de sensibilisation, de reboisement et de protection de l'environnement à Diego.",
    emoji: "🌿",
    couleur: "from-green-500 to-emerald-500",
    bgLight: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
    membres: [
      { nom: "RAZANADRAKOTO Vola", ecole: "ESAED", phone: "+261 34 00 555 01", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80" },
      { nom: "RAKOTOMALALA Toky", ecole: "ISPM", phone: "+261 34 00 555 02", photo: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300&q=80" },
      { nom: "ANDRIAMIRADO Fetra", ecole: "ISCAM", phone: "+261 34 00 555 03", photo: "https://images.unsplash.com/photo-1546961342-ea5f62d5a27b?w=300&q=80" },
      { nom: "RAHARISON Ny Aina", ecole: "ESPA", phone: "+261 34 00 555 04", photo: "https://images.unsplash.com/photo-1531727991582-cfd25ce79613?w=300&q=80" },
      { nom: "RAKOTONDRAMANANA Solo", ecole: "ESAED", phone: "+261 34 00 555 05", photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&q=80" },
      { nom: "ANDRIANTSALAMA Rova", ecole: "ISPM", phone: "+261 34 00 555 06", photo: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=300&q=80" },
    ],
  },
  {
    id: "sport",
    nom: "Commission Sport",
    description: "Organise les compétitions sportives, entraînements et représente l'AEDDI dans les tournois inter-associations.",
    emoji: "⚽",
    couleur: "from-orange-500 to-red-500",
    bgLight: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    membres: [
      { nom: "RAKOTO Tiavina", ecole: "ESPA", phone: "+261 34 00 666 01", photo: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300&q=80" },
      { nom: "ANDRIAMAMPIONONA Zo", ecole: "ESAED", phone: "+261 34 00 666 02", photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80" },
      { nom: "RASOLOFOSON Ny Haja", ecole: "ISCAM", phone: "+261 34 00 666 03", photo: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=300&q=80" },
      { nom: "RAKOTONDRAIBE Mika", ecole: "ISPM", phone: "+261 34 00 666 04", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80" },
      { nom: "ANDRIANA Fanja", ecole: "ESAED", phone: "+261 34 00 666 05", photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&q=80" },
      { nom: "RAMANANTOANINA Fy", ecole: "ESPA", phone: "+261 34 00 666 06", photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&q=80" },
    ],
  },
  {
    id: "cercle",
    nom: "Cercle d'Étude",
    description: "Anime les sessions d'études, tutorats et préparations aux examens pour tous les membres de l'AEDDI.",
    emoji: "📚",
    couleur: "from-indigo-500 to-purple-600",
    bgLight: "bg-indigo-50",
    border: "border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    membres: [
      { nom: "RAKOTONDRABE Fara", ecole: "ESAED", phone: "+261 34 00 777 01", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&q=80" },
      { nom: "ANDRIANASOLO Tovo", ecole: "ISPM", phone: "+261 34 00 777 02", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80" },
      { nom: "RAZAFINDRAKOTO Ny", ecole: "ESPA", phone: "+261 34 00 777 03", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80" },
      { nom: "RAKOTO Hanitra", ecole: "ISCAM", phone: "+261 34 00 777 04", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&q=80" },
      { nom: "ANDRIANARISON Mavo", ecole: "ESAED", phone: "+261 34 00 777 05", photo: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=300&q=80" },
      { nom: "RASOLONJATOVO Lanto", ecole: "ISPM", phone: "+261 34 00 777 06", photo: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=300&q=80" },
      { nom: "RANDRIAMBOLOLONA Fy", ecole: "ESPA", phone: "+261 34 00 777 07", photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&q=80" },
      { nom: "ANDRIANTAHIRY Zo", ecole: "ISCAM", phone: "+261 34 00 777 08", photo: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=300&q=80" },
    ],
  },
];

// ─── Composants ──────────────────────────────────────────────────────────────

function BureauCard({ membre, index }) {
  const isPresident = membre.rang === 1;

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
      {/* Bandeau gradient top */}
      <div className={`w-full h-32 bg-gradient-to-br ${membre.couleur} relative`}>
        {isPresident && (
          <div className="absolute top-3 right-3 bg-white/90 text-amber-600 text-xs font-black px-2.5 py-1 rounded-full shadow">
            ★ Président
          </div>
        )}
      </div>

      {/* Photo */}
      <div className={`-mt-20 w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden ring-2 ${isPresident ? "ring-amber-300" : "ring-gray-100"}`}>
        <img src={membre.photo} alt={membre.nom} className="w-full h-full object-cover" />
      </div>

      {/* Infos */}
      <div className="px-5 pb-5 pt-3 flex flex-col items-center gap-2 w-full">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${membre.badge}`}>
          {membre.icon} {membre.fonction}
        </span>
        <h3 className="text-base font-extrabold text-gray-900 leading-tight">{membre.nom}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{membre.ecole}</p>

        {/* Téléphone */}
        <a
          href={`tel:${membre.phone}`}
          className="mt-2 flex items-center gap-1.5 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 hover:border-purple-200 transition-all duration-200"
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6.22 6.22l1.96-1.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          {membre.phone}
        </a>
      </div>
    </motion.div>
  );
}

function MembreCard({ membre, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="flex flex-col items-center text-center bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden mb-3 ring-2 ring-gray-100 shadow">
        <img src={membre.photo} alt={membre.nom} className="w-full h-full object-cover" />
      </div>
      <p className="text-sm font-extrabold text-gray-800 leading-tight">{membre.nom}</p>
      <p className="text-xs text-gray-400 mt-0.5 mb-2">{membre.ecole}</p>
      <a
        href={`tel:${membre.phone}`}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 font-medium transition-colors"
      >
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6.22 6.22l1.96-1.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        {membre.phone}
      </a>
    </motion.div>
  );
}

function CommissionSection({ commission, index }) {
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`rounded-3xl border ${commission.border} overflow-hidden shadow-sm`}
    >
      {/* Header commission */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-6 py-5 ${commission.bgLight} hover:brightness-95 transition-all`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${commission.couleur} flex items-center justify-center text-xl shadow`}>
            {commission.emoji}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-extrabold text-gray-900">{commission.nom}</h3>
            <p className="text-sm text-gray-500 max-w-md">{commission.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4 shrink-0">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${commission.badge}`}>
            {commission.membres.length} membres
          </span>
          <svg
            width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            className={`text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Membres */}
      {open && (
        <div className="p-5 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {commission.membres.map((m, i) => (
              <MembreCard key={i} membre={m} index={i} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function MembresBureau() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow">
                <span className="text-white text-base font-black">A</span>
              </div>
              <span className="font-extrabold text-gray-800 text-lg tracking-tight">AEDDI</span>
            </a>
          </div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-5 backdrop-blur-sm">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Mandature 2024 – 2025
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
              Membres du Bureau
            </h1>
            <p className="text-purple-200 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Découvrez l'équipe qui pilote l'AEDDI — Association des Étudiants Dynamiques de Diego — et ses commissions actives.
            </p>
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              {[
                { v: "13", l: "Bureau exécutif" },
                { v: "6", l: "Commissions" },
                { v: "39", l: "Membres de burreau" },
              ].map((s) => (
                <div key={s.l} className="flex flex-col items-center">
                  <span className="text-3xl font-black text-white">{s.v}</span>
                  <span className="text-purple-300 text-xs font-medium">{s.l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* ── Bureau exécutif ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            <div>
              <h2 className="text-2xl font-black text-gray-900">Bureau Exécutif</h2>
              <p className="text-sm text-gray-400">L'équipe dirigeante de l'AEDDI</p>
            </div>
          </motion.div>

          {/* Président en haut centré */}
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-xs">
              <BureauCard membre={bureau[0]} index={0} />
            </div>
          </div>

          {/* Vice-président seul */}
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-xs">
              <BureauCard membre={bureau[1]} index={1} />
            </div>
          </div>

          {/* Trésorière + Vice-trésorière */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 max-w-2xl mx-auto">
            {bureau.slice(2, 4).map((m, i) => (
              <BureauCard key={m.id} membre={m} index={i + 2} />
            ))}
          </div>

          {/* Commissaire */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <BureauCard membre={bureau[4]} index={4} />
            </div>
          </div>

          {/* Conseillers */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-sm font-black text-gray-700">🎖️ Conseillers</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">8 membres</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {conseillers.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center text-center bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-indigo-100 transition-all duration-200"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-3 ring-2 ring-indigo-100 shadow">
                    <img src={m.photo} alt={m.nom} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full mb-1">Conseiller</span>
                  <p className="text-sm font-extrabold text-gray-800 leading-tight">{m.nom}</p>
                  <p className="text-xs text-gray-400 mt-0.5 mb-2">{m.ecole}</p>
                  <a href={`tel:${m.phone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 font-medium transition-colors">
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6.22 6.22l1.96-1.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {m.phone}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Séparateur ── */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3">Commissions</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
        </div>

        {/* ── Commissions ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-orange-400 rounded-full" />
            <div>
              <h2 className="text-2xl font-black text-gray-900">Les Commissions</h2>
              <p className="text-sm text-gray-400">Cliquez sur une commission pour voir ses membres</p>
            </div>
          </motion.div>

          <div className="space-y-5">
            {commissions.map((c, i) => (
              <CommissionSection key={c.id} commission={c} index={i} />
            ))}
          </div>
        </section>

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