"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Avantages from "./Avantages";

// ─── Données du slider ───────────────────────────────────────────────────────
const sliderImages = [
  { id: 1, src: "/images/slider/image1.jpg", alt: "Image AEDDI 1", title: "Bienvenue sur AEDDI", subtitle: "Association des Étudiants Dynamiques de Diego" },
  { id: 2, src: "/images/slider/image2.jpg", alt: "Image AEDDI 2", title: "Formation de Qualité", subtitle: "Développez vos compétences avec nos experts" },
  { id: 3, src: "/images/slider/image3.jpg", alt: "Image AEDDI 3", title: "Réseau Professionnel", subtitle: "Connectez-vous à une communauté d'excellence" },
  { id: 4, src: "/images/slider/image4.jpg", alt: "Image AEDDI 4", title: "Innovation & Créativité", subtitle: "Portez vos idées vers de nouveaux horizons" },
  { id: 5, src: "/images/slider/image5.jpg", alt: "Image AEDDI 5", title: "Leadership & Développement", subtitle: "Grandissez ensemble, progressez plus vite" },
  { id: 6, src: "/images/slider/image6.jpg", alt: "Image AEDDI 6", title: "Opportunités Internationales", subtitle: "Ouvrez les portes du monde" },
];

// ─── Composant ImageSlider ────────────────────────────────────────────────────
function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const direction = useRef(1);
  const intervalRef = useRef(null);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      direction.current = 1;
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 6000);
  };

  useEffect(() => {
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const goTo = (index) => {
    if (index === currentSlide) return;
    direction.current = index > currentSlide ? 1 : -1;
    setCurrentSlide(index);
    resetInterval();
  };

  const goPrev = () => {
    direction.current = -1;
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
    resetInterval();
  };

  const goNext = () => {
    direction.current = 1;
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    resetInterval();
  };

  return (
    <div className="relative w-full h-[clamp(260px,52vw,640px)] rounded-3xl overflow-hidden shadow-2xl border border-purple-200/40">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction.current}>
        <motion.div
          key={sliderImages[currentSlide].id}
          custom={direction.current}
          initial={{ x: direction.current > 0 ? "100%" : "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction.current > 0 ? "-100%" : "100%", opacity: 0 }}
          transition={{ x: { type: "spring", stiffness: 260, damping: 30 }, opacity: { duration: 0.25 } }}
          className="absolute inset-0"
        >
          <Image
            src={sliderImages[currentSlide].src}
            alt={sliderImages[currentSlide].alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={sliderImages[currentSlide].id === 1}
          />
          {/* Dégradé overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          {/* Texte */}
          <div className="absolute bottom-14 md:bottom-16 left-0 right-0 px-6 md:px-10 z-10">
            <motion.p
              key={`sub-${currentSlide}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-purple-300 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1 drop-shadow"
            >
              {sliderImages[currentSlide].subtitle}
            </motion.p>
            <motion.h3
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="text-white text-xl sm:text-2xl md:text-3xl font-extrabold drop-shadow-lg leading-tight"
            >
              {sliderImages[currentSlide].title}
            </motion.h3>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Flèche gauche */}
      <button
        onClick={goPrev}
        aria-label="Image précédente"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-purple-600/80 text-white rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Flèche droite */}
      <button
        onClick={goNext}
        aria-label="Image suivante"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-purple-600/80 text-white rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            aria-label={`Aller à l'image ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-7"
                : "bg-white/45 w-2.5 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Compteur discret */}
      <div className="absolute top-4 right-4 z-20 bg-black/35 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
        {currentSlide + 1} / {sliderImages.length}
      </div>
    </div>
  );
}

// ─── Page Accueil ─────────────────────────────────────────────────────────────
export default function Accueil() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-pink-50/30">
      {/* ── Navbar ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100/60 shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow">
              <span className="text-white text-base font-black">A</span>
            </div>
            <span className="font-extrabold text-gray-800 text-lg tracking-tight">
              AEDDI
            </span>
          </div>

          {/* Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#accueil" className="hover:text-purple-600 transition-colors">Accueil</a>
            <a href="/bureau" className="hover:text-purple-600 transition-colors">Membres de Bureau</a>
            <a href="#evenements" className="hover:text-purple-600 transition-colors">Événements</a>
            <a href="#contact" className="hover:text-purple-600 transition-colors">Contact</a>
          </div>

          {/* Bouton connexion */}
          <a
            href="/login"
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition-all duration-200 active:scale-95"
          >
            Connexion
          </a>
        </div>
      </motion.nav>

      {/* ── Hero Section ── */}
      <section id="accueil" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Texte gauche */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 self-start bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full"
            >
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              Association active
            </motion.span>

            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
                Bienvenue sur{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                  AEDDI
                </span>
              </h1>
              <p className="mt-4 text-gray-500 text-base sm:text-lg leading-relaxed">
                Association des Étudiants Dynamiques de Diego — une communauté
                unie pour l'excellence, le partage et le développement
                professionnel.
              </p>
            </div>

            {/* Stats rapides */}
            <div className="flex gap-6 flex-wrap">
              {[
                { value: "400+", label: "Membres" },
                { value: "20+", label: "Années" },
                { value: "5+", label: "Événements" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-black text-purple-600">{stat.value}</span>
                  <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 mt-2">
              <a
                href="/devenir-membre"
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95 text-sm"
              >
                Devenir membre
              </a>
              <a
                href="#association"
                className="border-2 border-purple-200 hover:border-purple-400 text-purple-700 font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm bg-white/70"
              >
                En savoir plus
              </a>
            </div>
          </motion.div>

          {/* Slider droite */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ImageSlider />
          </motion.div>
        </div>
      </section>

      {/* ── Section Avantages ── */}
      <Avantages />
 
    </div>
  );
}