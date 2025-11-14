'use client';

import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <h1 className="text-xl font-bold text-gray-900">Associations des Etudiants Dynamique de DIego</h1>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
