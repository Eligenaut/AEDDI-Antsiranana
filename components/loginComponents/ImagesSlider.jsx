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
  const [prevSlide, setPrevSlide] = useState(0);
  const direction = useRef(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevSlide(currentSlide);
      direction.current = 1;
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleDotClick = (index) => {
    if (index === currentSlide) return;
    setPrevSlide(currentSlide);
    direction.current = index > currentSlide ? 1 : -1;
    setCurrentSlide(index);
  };

  return (
    <div className="-mx-0 md:-mx-4 lg:-mx-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg"
      >
        <div className="relative w-full h-full">
          <AnimatePresence initial={false} custom={direction.current}>
            <motion.div
              key={sliderImages[currentSlide].id}
              custom={direction.current}
              initial={{ x: direction.current > 0 ? "100%" : "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction.current > 0 ? "-100%" : "100%", opacity: 0 }}
              transition={{ x: { duration: 1 }, opacity: { duration: 0.3 } }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={sliderImages[currentSlide].src}
                alt={sliderImages[currentSlide].alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={sliderImages[currentSlide].id === 1}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-white scale-125" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
