"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const advantages = [
  { id: 1, icon: "🎓", title: "Formation", description: "Accès à des formations de qualité et des ressources éducatives", image: "/images/avantages/image1.jpg", color: "blue" },
  { id: 2, icon: "🤝", title: "Réseau", description: "Développez votre réseau professionnel et personnel", image: "/images/avantages/image2.jpg", color: "green" },
  { id: 3, icon: "💡", title: "Innovation", description: "Participez à des projets innovants et créatifs", image: "/images/avantages/image3.jpg", color: "purple" },
  { id: 4, icon: "🌟", title: "Leadership", description: "Développez vos compétences en leadership et gestion", image: "/images/avantages/image4.jpg", color: "orange" },
  { id: 5, icon: "🚀", title: "Opportunités", description: "Découvrez de nouvelles opportunités de carrière", image: "/images/avantages/image5.jpg", color: "red" },
  { id: 6, icon: "🌍", title: "International", description: "Participez à des échanges internationaux", image: "/images/avantages/image6.jpg", color: "teal" },
];

export function AvantagesSlider() {
  const [currentAdvantage, setCurrentAdvantage] = useState(0);
  const [prevAdvantage, setPrevAdvantage] = useState(0);
  const advantageDirection = useRef(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevAdvantage(currentAdvantage);
      advantageDirection.current = 1;
      setCurrentAdvantage((prev) => (prev + 1) % advantages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [currentAdvantage]);

  const handleDotClick = (index) => {
    if (index === currentAdvantage) return;
    setPrevAdvantage(currentAdvantage);
    advantageDirection.current = index > currentAdvantage ? 1 : -1;
    setCurrentAdvantage(index);
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Nos Avantages
      </h3>
      <div className="overflow-x-hidden pb-4 relative w-full max-w-[400px] mx-auto">
        <AnimatePresence initial={false} custom={advantageDirection.current}>
          <motion.div
            key={advantages[currentAdvantage].id}
            custom={advantageDirection.current}
            initial={{ x: advantageDirection.current > 0 ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: advantageDirection.current > 0 ? "-100%" : "100%", opacity: 0 }}
            transition={{ x: { duration: 1 }, opacity: { duration: 0.3 } }}
            className="flex justify-center"
          >
            <motion.div
              key={advantages[currentAdvantage].id}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full max-w-[350px] mx-auto cursor-pointer"
            >
              <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                <Image
                  src={advantages[currentAdvantage].image}
                  alt={advantages[currentAdvantage].title}
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className="text-2xl">{advantages[currentAdvantage].icon}</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{advantages[currentAdvantage].title}</h3>
              <p className="text-gray-600 text-sm">{advantages[currentAdvantage].description}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center mt-2 space-x-2">
          {advantages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentAdvantage ? "bg-blue-500 scale-125" : "bg-blue-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
