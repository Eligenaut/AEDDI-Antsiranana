"use client";

import { motion } from "framer-motion";

const avantages = [
  {
    id: 1,
    titre: "Cercle d'Étude",
    description:
      "Des sessions d'études collaboratives pour progresser ensemble, s'entraider et décrocher les meilleures notes.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    emoji: "📚",
    couleur: "from-purple-500 to-indigo-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    id: 2,
    titre: "Logement",
    description:
      "Un réseau de logements abordables et sécurisés pour les membres, facilité par l'association.",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
    emoji: "🏠",
    couleur: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    titre: "Vie Sociale",
    description:
      "Des événements, soirées et rencontres pour tisser des liens forts et construire un vrai réseau.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    emoji: "🤝",
    couleur: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    border: "border-pink-100",
    badge: "bg-pink-100 text-pink-700",
  },
  {
    id: 4,
    titre: "Sport",
    description:
      "Des activités sportives variées : football, basketball, athlétisme… pour le bien-être de tous.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80",
    emoji: "⚽",
    couleur: "from-green-500 to-emerald-500",
    bg: "bg-green-50",
    border: "border-green-100",
    badge: "bg-green-100 text-green-700",
  },
  {
    id: 5,
    titre: "Culture Traditionnelle",
    description:
      "Valorisation des traditions malgaches : danses, musiques, cérémonies et transmission du patrimoine.",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
    emoji: "🪘",
    couleur: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    id: 6,
    titre: "Culture Moderne",
    description:
      "Musique, art, cinéma et nouvelles tendances — l'AEDDI embrasse aussi la culture contemporaine.",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
    emoji: "🎨",
    couleur: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
    badge: "bg-violet-100 text-violet-700",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Avantages() {
  return (
    <section id="avantages" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
      {/* En-tête */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4"
        >
          <span className="w-2 h-2 bg-purple-500 rounded-full" />
          Ce que nous offrons
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight"
        >
          Les avantages de{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            l'AEDDI
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 text-gray-500 text-base max-w-xl mx-auto"
        >
          Rejoindre l'AEDDI, c'est accéder à un écosystème complet pour
          s'épanouir dans tous les aspects de la vie étudiante.
        </motion.p>
      </div>

      {/* Grille de cartes */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {avantages.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className={`group rounded-2xl overflow-hidden border ${item.border} shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col`}
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={item.image}
                alt={item.titre}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay dégradé */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${item.couleur} opacity-40 group-hover:opacity-50 transition-opacity duration-300`}
              />
              {/* Badge emoji */}
              <div className="absolute top-3 left-3">
                <span
                  className={`text-sm font-bold px-2.5 py-1 rounded-full ${item.badge} backdrop-blur-sm`}
                >
                  {item.emoji} {item.titre}
                </span>
              </div>
            </div>

            {/* Contenu */}
            <div className={`flex-1 p-5 ${item.bg}`}>
              <h3 className="text-base font-extrabold text-gray-800 mb-2">
                {item.titre}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}