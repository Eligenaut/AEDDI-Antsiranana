'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download } from 'lucide-react';
import { etablissements, getPromotionsOptions } from '../loginComponents/DataRegister';

export function FilterUser({ onFiltersChange, className = '', currentUser, onExportXLSX }) {
  const [filters, setFilters] = useState({
    etablissement: '',
    promotion: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleExportXLSX = async () => {
    if (!onExportXLSX ) {
      alert('Vous n\'avez pas les permissions pour exporter les données');
      return;
    }

    setExporting(true);
    try {
      await onExportXLSX();
    } catch (error) {
      console.error('Erreur lors de l\'exportation XLSX:', error);
      alert('Erreur lors de l\'exportation XLSX');
    } finally {
      setExporting(false);
    }
  };

  const etablissementOptions = Object.entries(etablissements).map(([key, value]) => ({
    value: key,
    label: value.nom
  }));

  const promotionOptions = getPromotionsOptions().map(year => ({
    value: year.toString(),
    label: year.toString()
  }));

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtres des membres</h3>
        </div>
        <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportXLSX}
              disabled={exporting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-1.5 text-sm rounded-lg flex items-center space-x-2 transition-colors"
              title="Exporter en XLSX"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Export...' : 'XLSX'}</span>
            </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Filtres - expandables */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="p-3 space-y-3">
          {/* Filtre par établissement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Établissement
            </label>
            <select
              value={filters.etablissement}
              onChange={(e) => handleFilterChange('etablissement', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Tous les établissements</option>
              {etablissementOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par promotion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promotion
            </label>
            <select
              value={filters.promotion}
              onChange={(e) => handleFilterChange('promotion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Toutes les promotions</option>
              {promotionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

        </div>
      </motion.div>

    </div>
  );
}
