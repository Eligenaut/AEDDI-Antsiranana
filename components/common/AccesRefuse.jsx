"use client";

import { motion } from "framer-motion";
import { ShieldX } from "lucide-react";

export function AccesRefuse() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600">
          Vous n'avez pas les permissions nécessaires pour consulter cette
          page.
        </p>
      </motion.div>
    </div>
  );
}
