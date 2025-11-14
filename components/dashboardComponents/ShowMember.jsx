import { useEffect, useState } from 'react';
import { X, Loader2, Users, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';

export function ShowMember({ isOpen, onClose, memberId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (isOpen && memberId) {
      setLoading(true);
      setError(null);0
      axios.get(`${url}members/${memberId}`, { headers: getAuthHeaders() })
        .then(res => {
          if (res.data.success) {
            setMember(res.data.data);
          } else {
            setError('Erreur lors du chargement du membre');
          }
        })
        .catch(() => setError('Erreur lors du chargement du membre'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, memberId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 relative overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Détail du membre</h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des détails...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          ) : member ? (
            <div className="space-y-6">
              {/* Profil du membre */}
              <div className="text-center">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt="avatar" 
                    className="w-20 h-20 rounded-full border-4 border-blue-100 mx-auto mb-4 shadow-lg" 
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.email}</p>
              </div>

              {/* Informations du membre */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Date d'inscription</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {member.created_at ? new Date(member.created_at).toLocaleDateString('fr-FR') : 'Non disponible'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Type de compte</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.google_id ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-900 font-medium">Google</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-900 font-medium">Classique</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
