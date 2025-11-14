'use client';

import React, { useState, useEffect } from 'react';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Notiflix from 'notiflix';

export default function AddAuthorizedEmail({ onEmailAdded }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authorizedEmails, setAuthorizedEmails] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  useEffect(() => {
    loadAuthorizedEmails();
  }, []);

  const loadAuthorizedEmails = async () => {
    try {
      const resp = await fetch(`${url}admin/authorized-emails`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const response = await resp.json();
      if (response.success && response.data) setAuthorizedEmails(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des emails:', error);
    }
  };
  const handleAddEmail = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Veuillez entrer un email');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const resp = await fetch(`${url}admin/add-authorized-email`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email: email.trim() })
      });
      const response = await resp.json();

      if (response.success) {
        setSuccess('Email ajouté avec succès !');
        Notify.success('Email ajouté avec succès !');
        setGeneratedCode(response.code || '');
        setShowCode(true);
        setEmail('');
        loadAuthorizedEmails();
        
        if (onEmailAdded) {
          onEmailAdded();
        }
      } else {
        setError(response.message || 'Erreur lors de l\'ajout');
        Notify.failure(response.message || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de l\'ajout');
      Notify.failure(error.message || 'Erreur lors de l\'ajout');
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteEmail = async (id) => {
    Notiflix.Confirm.show(
      'Supprimer l\'email ?',
      'Êtes-vous sûr de vouloir supprimer cet email autorisé ?',
      'Supprimer',
      'Annuler',
      async () => {
        try {
          const resp = await fetch(`${url}admin/delete-authorized-email/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          });
          const response = await resp.json();

          if (response.success) {
            setSuccess('Email supprimé avec succès !');
            Notiflix.Notify.success('Email supprimé avec succès !');
            loadAuthorizedEmails();
          } else {
            setError(response.message || 'Erreur lors de la suppression');
            Notiflix.Notify.failure(response.message || 'Erreur lors de la suppression');
          }
        } catch (error) {
          setError(error.message || 'Erreur lors de la suppression');
          Notiflix.Notify.failure(error.message || 'Erreur lors de la suppression');
        }
      },
      () => {}
    );
  };

  return (
    <div className="w-full mx-auto p-1">
      <div className="bg-white shadow rounded-lg p-1">
        <form onSubmit={handleAddEmail} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email de l'étudiant
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </form>
        {showCode && generatedCode && (
          <div className="mb-6 rounded-md bg-blue-50 p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Code généré pour {email}
            </h3>
            <div className="text-2xl font-mono text-blue-600 bg-white p-3 rounded border">
              {generatedCode}
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Ce code sera envoyé automatiquement par email lors de l'inscription.
            </p>
            <button
              onClick={() => setShowCode(false)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-500"
            >
              Fermer
            </button>
          </div>
        )}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Emails autorisés ({authorizedEmails.length})
          </h3>
          
          {authorizedEmails.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucun email autorisé pour le moment
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'ajout
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {authorizedEmails.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.used 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.used ? 'Utilisé' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteEmail(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))} 
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
