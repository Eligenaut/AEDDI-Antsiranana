'use client';

import { ImagesSlider } from './ImagesSlider';
import { motion } from 'framer-motion';

export function AccueilContent() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-60 h-60 md:w-96 md:h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-60 h-60 md:w-96 md:h-96 bg-pink-200 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute hidden md:block top-1/2 left-1/2 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 flex flex-col flex-1">

        {/* Slider */}
        <div className="w-full max-h-[55vh] md:max-h-[65vh] lg:max-h-none p-4 md:p-6 lg:p-8">
          <ImagesSlider />
        </div>

        {/* Section Qui sommes-nous */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/80 backdrop-blur rounded-2xl p-5 md:p-8 shadow-xl border border-purple-100 mx-4 md:mx-6 lg:mx-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">

            {/* Icône */}
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M12 12a5 5 0 015 5M12 12a5 5 0 00-5 5M12 7a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
            </div>

            {/* Texte */}
            <div className="flex-1">
              <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-3">
                Qui sommes-nous ?
              </h2>

              <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
                L'Association des Étudiants Dynamiques de Diego (AEDDI) accompagne
                les étudiants dans leur développement académique, professionnel et personnel
                à travers des actions concrètes et innovantes.
              </p>

              {/* Points clés */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Formation', 'Réseau', 'Innovation', 'Leadership'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-purple-500 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
