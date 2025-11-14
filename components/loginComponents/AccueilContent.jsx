'use client';

import { ImagesSlider } from './ImagesSlider';
import { motion } from 'framer-motion';

export function AccueilContent() {
  return (
    <div className="flex flex-col lg:h-full lg:justify-between">
      <div className="lg:flex-1 lg:flex lg:flex-col lg:justify-center">
        <ImagesSlider />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col justify-center items-center text-center p-4 lg:mt-0 mt-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Qui sommes-nous ?
        </h2>
        <p className="text-gray-600 px-4">
          Association des Étudiants Dynamiques de Diego AEDDI.
        </p>
      </motion.div>
    </div>
  );
}
