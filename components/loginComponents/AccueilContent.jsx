'use client';

import { ImagesSlider } from './ImagesSlider';
import { motion } from 'framer-motion';

export function AccueilContent() {
  return (
    <div className="relative flex flex-col lg:h-full lg:justify-between bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden">
      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col lg:h-full lg:justify-between">
        {/* Slider d'images - prend toute la partie haute */}
        <div className="lg:flex-1 lg:flex lg:flex-col lg:justify-start p-4 md:p-6 lg:p-8 pb-6 lg:pb-8">
          <ImagesSlider />
        </div>

        {/* Section "Qui sommes-nous" améliorée */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-purple-100/50 mx-4 md:mx-6 lg:mx-8 mb-4 md:mb-6 lg:mb-8"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Qui sommes-nous ?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                L'Association des Étudiants Dynamiques de Diego (AEDDI) est une organisation 
                dédiée à l'épanouissement académique, professionnel et personnel des étudiants. 
                Nous créons des opportunités de développement, de networking et d'innovation.
              </p>
              
              {/* Points clés */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-purple-500">✓</span>
                  <span>Formation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-purple-500">✓</span>
                  <span>Réseau</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-purple-500">✓</span>
                  <span>Innovation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-purple-500">✓</span>
                  <span>Leadership</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
