"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

// ─── Données ──────────────────────────────────────────────────────────────────
const evenements = [
  {
    id: 1,
    titre: "Tournoi Inter-Associations",
    description:
      "Grand tournoi sportif réunissant les associations étudiantes de Diego. Football, basketball et athlétisme au programme pour une journée de cohésion et de compétition amicale.",
    image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=900&q=85",
    dateDebut: "2025-03-15",
    dateFin: "2025-03-16",
    lieu: "Stade Municipal de Diego-Suarez",
    statut: "terminé",
    categorie: "Sport",
    emoji: "⚽",
    couleur: "from-orange-500 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    id: 2,
    titre: "Soirée Culturelle AEDDI",
    description:
      "Une soirée mêlant danses traditionnelles malgaches et performances modernes. Showcase de talents, musique live et exposition artisanale.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&q=85",
    dateDebut: "2025-04-20",
    dateFin: "2025-04-20",
    lieu: "Salle des Fêtes de la Mairie, Diego",
    statut: "en cours",
    categorie: "Culture",
    emoji: "🎭",
    couleur: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    id: 3,
    titre: "Séminaire Leadership Étudiant",
    description:
      "Formation intensive de 2 jours sur le leadership, la gestion de projet et l'entrepreneuriat. Intervenants professionnels et ateliers pratiques.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=85",
    dateDebut: "2025-05-10",
    dateFin: "2025-05-11",
    lieu: "ESPA — Antsiranana, Ampasitra",
    statut: "en cours",
    categorie: "Formation",
    emoji: "🎓",
    couleur: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    badge: "bg-blue-100 text-blue-700",
  },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ─── Carte événement ──────────────────────────────────────────────────────────
function EventCard({ evt, index }) {
  const isTermine = evt.statut === "terminé";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`group rounded-2xl overflow-hidden border ${evt.border} shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col`}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={evt.image}
          alt={evt.titre}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isTermine ? "grayscale-[30%]" : ""}`}
        />

        {/* Overlay dégradé */}
        <div className={`absolute inset-0 bg-gradient-to-t ${evt.couleur} opacity-40 group-hover:opacity-50 transition-opacity duration-300`} />

        {/* Badge catégorie */}
        <div className="absolute top-3 left-3">
          <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${evt.badge} backdrop-blur-sm`}>
            {evt.emoji} {evt.categorie}
          </span>
        </div>

        {/* Statut */}
        <div className="absolute top-3 right-3">
          <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border ${
            isTermine
              ? "bg-gray-800/70 text-gray-300 border-gray-600/40"
              : "bg-emerald-900/60 text-emerald-300 border-emerald-500/40"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isTermine ? "bg-gray-400" : "bg-emerald-400 animate-pulse"}`} />
            {isTermine ? "Terminé" : "En cours"}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className={`flex-1 p-5 ${evt.bg}`}>
        <h3 className="text-lg font-extrabold text-gray-800 mb-2 leading-tight">
          {evt.titre}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {evt.description}
        </p>

        {/* Dates */}
        <div className="flex items-center gap-2 mb-2">
          <svg className="text-gray-400 shrink-0" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-gray-600 text-xs font-semibold">
            {evt.dateDebut === evt.dateFin
              ? formatDate(evt.dateDebut)
              : `${formatDate(evt.dateDebut)} → ${formatDate(evt.dateFin)}`}
          </span>
        </div>

        {/* Lieu */}
        <div className="flex items-center gap-2">
          <svg className="text-gray-400 shrink-0" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-gray-500 text-xs">{evt.lieu}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section Événements ───────────────────────────────────────────────────────
export default function Evenements() {
  return (
    <section id="evenements" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">

      {/* En-tête */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4"
        >
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          Agenda AEDDI
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight"
        >
          Nos{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            Activités
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 text-gray-500 text-base max-w-xl mx-auto"
        >
          Restez au courant de toutes les activités et rencontres organisées par l'AEDDI.
        </motion.p>
      </div>

      {/* Grille 3 cartes */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {evenements.map((evt, i) => (
          <EventCard key={evt.id} evt={evt} index={i} />
        ))}
      </div>

      {/* Légende + lien */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="max-w-6xl mx-auto mt-10 flex flex-col sm:flex-row items-center justify-between gap-4"
      >

        {/* Voir tous */}
        <a
          href="/evenements"
          className="flex items-center gap-2 text-purple-600 hover:text-pink-500 text-sm font-bold transition-colors"
        >
          Voir tous les activités
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 13 10 7 4 1" />
          </svg>
        </a>
      </motion.div>

    </section>
  );
}