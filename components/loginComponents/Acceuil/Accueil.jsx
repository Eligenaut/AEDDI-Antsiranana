"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Avantages from "./Avantages";
import Evenements from "./Evenements";

// ─── Données slider ───────────────────────────────────────────────────────────
const sliderImages = [
  { id: 1, src: "/images/slider/image1.jpg", alt: "AEDDI 1", title: "Bienvenue sur AEDDI", subtitle: "Association des Étudiants Dynamiques de Diego" },
  { id: 2, src: "/images/slider/image2.jpg", alt: "AEDDI 2", title: "Formation de Qualité", subtitle: "Développez vos compétences avec nos experts" },
  { id: 3, src: "/images/slider/image3.jpg", alt: "AEDDI 3", title: "Réseau Professionnel", subtitle: "Connectez-vous à une communauté d'excellence" },
  { id: 4, src: "/images/slider/image4.jpg", alt: "AEDDI 4", title: "Innovation & Créativité", subtitle: "Portez vos idées vers de nouveaux horizons" },
  { id: 5, src: "/images/slider/image5.jpg", alt: "AEDDI 5", title: "Leadership & Développement", subtitle: "Grandissez ensemble, progressez plus vite" },
  { id: 6, src: "/images/slider/image6.jpg", alt: "AEDDI 6", title: "Opportunités Internationales", subtitle: "Ouvrez les portes du monde" },
];

const stats = [
  { value: "400+", label: "Membres" },
  { value: "20+",  label: "Années" },
  { value: "5+",   label: "Événements" },
];

const navLinks = [
  { href: "#accueil", label: "Accueil" },
  { href: "/bureau",  label: "Membres de Bureau" },
  { href: "#evenements", label: "Événements" },
  { href: "#contact", label: "Contact" },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Fermer au clic sur un lien
  const handleLink = () => setMenuOpen(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-purple-100/60 shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Hamburger — mobile gauche */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] group"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-5 h-[2px] bg-gray-700 rounded-full origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-[2px] bg-gray-700 rounded-full"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-5 h-[2px] bg-gray-700 rounded-full origin-center"
            />
          </button>

          {/* Logo — centré mobile, gauche desktop */}
          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow">
              <span className="text-white text-sm font-black">A</span>
            </div>
            <span className="font-extrabold text-gray-800 text-base tracking-tight">AEDDI</span>
          </div>

          {/* Nav links desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-purple-600 transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          {/* Connexion */}
          <a
            href="/login"
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg shadow transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            Connexion
          </a>
        </div>
      </motion.nav>

      {/* ── Menu mobile — s'ouvre depuis le haut ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            />

            {/* Panel qui descend depuis le haut */}
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-16 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-b border-purple-100 shadow-xl"
            >
              <nav className="flex flex-col py-2">
                {navLinks.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={handleLink}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 px-6 py-4 text-gray-700 font-semibold hover:bg-purple-50 hover:text-purple-700 transition-colors border-b border-gray-50 last:border-0 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {l.label}
                  </motion.a>
                ))}

                {/* CTA dans le menu */}
                <div className="px-6 py-4">
                  <a
                    href="/devenir-membre"
                    onClick={handleLink}
                    className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl shadow text-sm"
                  >
                    Devenir membre
                  </a>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero Slider ──────────────────────────────────────────────────────────────
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [loaded, setLoaded] = useState({});
  const intervalRef = useRef(null);

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDir(1);
      setCurrent((c) => (c + 1) % sliderImages.length);
    }, 7000);
  };

  useEffect(() => {
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const goPrev = () => {
    setDir(-1);
    setCurrent((c) => (c - 1 + sliderImages.length) % sliderImages.length);
    resetInterval();
  };

  const goNext = () => {
    setDir(1);
    setCurrent((c) => (c + 1) % sliderImages.length);
    resetInterval();
  };

  const goToIndex = (i) => {
    if (i === current) return;
    setDir(i > current ? 1 : -1);
    setCurrent(i);
    resetInterval();
  };

  return (
    <section id="accueil" className="relative w-full h-[clamp(320px,62vw,700px)] overflow-hidden bg-gray-900">

      {/* ── Slides ── */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={current}
          custom={dir}
          variants={{
            enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (d) => ({ x: d > 0 ? "-18%" : "18%", opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: 0.85, ease: [0.76, 0, 0.24, 1] },
            opacity: { duration: 0.6, ease: "easeInOut" },
          }}
          className="absolute inset-0"
        >
          {/* Image — sans skeleton visible */}
          <div className="absolute inset-0 bg-gray-900">
            <Image
              src={sliderImages[current].src}
              alt={sliderImages[current].alt}
              fill
              sizes="100vw"
              className={`object-cover transition-opacity duration-700 ${loaded[current] ? "opacity-100" : "opacity-0"}`}
              priority={current === 0}
              onLoad={() => setLoaded((p) => ({ ...p, [current]: true }))}
            />
          </div>

          {/* Overlays cinématiques */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── Barre de progression ── */}
      <motion.div
        key={`bar-${current}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 7, ease: "linear" }}
        style={{ originX: 0 }}
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500 z-30"
      />

      {/* ── Texte bas gauche ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 sm:px-10 lg:px-14 pb-6 sm:pb-10">
        <div className="max-w-3xl mb-6 sm:mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-purple-300 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] mb-1.5 drop-shadow">
                {sliderImages[current].subtitle}
              </p>
              <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-xl">
                {sliderImages[current].title}
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stats + navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center gap-4 sm:gap-7"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-4 sm:gap-7">
                <div className="flex flex-col">
                  <span className="text-lg sm:text-2xl font-black text-white leading-none">{s.value}</span>
                  <span className="text-[9px] sm:text-xs text-purple-300 font-semibold uppercase tracking-widest mt-0.5">{s.label}</span>
                </div>
                {i < stats.length - 1 && <div className="w-px h-7 bg-white/20" />}
              </div>
            ))}
          </motion.div>

          {/* Dots + flèches + compteur */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {sliderImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`rounded-full transition-all duration-400 ${
                    i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/35 hover:bg-white/65"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={goPrev}
                aria-label="Précédent"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/25 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="10 13 4 7 10 1" />
                </svg>
              </button>
              <button
                onClick={goNext}
                aria-label="Suivant"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/25 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 13 9 7 3 1" />
                </svg>
              </button>
            </div>
            <span className="text-white/40 text-xs font-bold tabular-nums hidden sm:block">
              {String(current + 1).padStart(2, "0")} / {String(sliderImages.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* ── CTA droite (desktop seulement) ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-8 sm:right-10 z-20 flex-col gap-3"
      >
        <a
          href="/devenir-membre"
          className="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xl transition-all duration-200 active:scale-95 whitespace-nowrap"
        >
          Devenir membre
        </a>
        <a
          href="#avantages"
          className="bg-white/10 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold px-5 py-3 rounded-xl backdrop-blur-sm transition-all duration-200 whitespace-nowrap text-center"
        >
          En savoir plus
        </a>
      </motion.div>

    </section>
  );
}

// ─── Page Accueil ─────────────────────────────────────────────────────────────
export default function Accueil() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-pink-50/30">
      <Navbar />
      <HeroSlider />
      <Avantages />

      {/* ── Section Événements ── */}
      <Evenements />
    </div>
  );
}