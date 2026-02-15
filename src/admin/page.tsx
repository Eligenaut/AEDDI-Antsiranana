'use client';

import React, { useState } from 'react';
import AddAuthorizedEmail from '../../components/loginComponents/AddAuthorizedEmail.jsx';

export default function AdminEmailsPage() {
  const [isOpen, setIsOpen] = useState(true); 
  // true si tu veux que le panel soit toujours visible
  // ou false si tu veux l'ouvrir avec un bouton

  const handleEmailAdded = () => {
    console.log('Email ajouté');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            
            {/* Si tu veux un bouton pour ouvrir */}
            <button
              onClick={() => setIsOpen(true)}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Ajouter un email
            </button>

            <AddAuthorizedEmail
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              onEmailAdded={handleEmailAdded}
            />
            
          </div>
        </div>
      </div>
    </div>
  );
}
