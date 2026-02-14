"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const sliderImages = [
  { id: 1, src: "/images/slider/image1.jpg", alt: "Image AEDDI 1", title: "Bienvenue sur AEDDI" },
  { id: 2, src: "/images/slider/image2.jpg", alt: "Image AEDDI 2", title: "Formation de Qualité" },
  { id: 3, src: "/images/slider/image3.jpg", alt: "Image AEDDI 3", title: "Réseau Professionnel" },
  { id: 4, src: "/images/slider/image4.jpg", alt: "Image AEDDI 4", title: "Innovation & Créativité" },
  { id: 5, src: "/images/slider/image5.jpg", alt: "Image AEDDI 5", title: "Leadership & Développement" },
  { id: 6, src: "/images/slider/image6.jpg", alt: "Image AEDDI 6", title: "Opportunités Internationales" },
];

export function ImagesSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const direction = useRef(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      direction.current = 1;
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 8000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleDotClick = (index) => {
    if (index === currentSlide) return;
    direction.current = index > currentSlide ? 1 : -1;
    setCurrentSlide(index);
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="
          relative
          h-[clamp(220px,45vw,600px)]
          rounded-2xl
          overflow-hidden
          shadow-2xl
          border border-purple-100/30
        "
      >
        <AnimatePresence initial={false} custom={direction.current}>
          <motion.div
            key={sliderImages[currentSlide].id}
            custom={direction.current}
            initial={{ x: direction.current > 0 ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction.current > 0 ? "-100%" : "100%", opacity: 0 }}
            transition={{ x: { duration: 0.9 }, opacity: { duration: 0.3 } }}
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

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Titre */}
            <div className="absolute bottom-8 md:bottom-14 left-0 right-0 px-4 md:px-8 z-10">
              <motion.h3
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg text-center md:text-left"
              >
                {sliderImages[currentSlide].title}
              </motion.h3>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots navigation */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              aria-label={`Aller à l'image ${index + 1}`}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 w-3 hover:bg-white/80"
              }`}
              style={{ minWidth: 24, minHeight: 24 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
