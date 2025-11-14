import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import React from 'react';

export const ModalConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir continuer ?',
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
}) => {
  return (
    <>
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 text-gray-700 text-sm">
                {message}
              </div>
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
