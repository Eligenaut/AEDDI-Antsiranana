'use client';

import { useState, useEffect } from 'react';
import { url } from '../context/url.js';
import { getAuthHeaders } from '../context/headers.jsx';
import { Home, Calendar, Users, CreditCard, User, MessageCircle, Bell, LogOut, Settings } from 'lucide-react';

const menuItems = [
  { id: 'accueil', label: 'Accueil', icon: Home, active: true, badge: null },
  { id: 'activites', label: 'Activités', icon: Calendar, active: false, badge: null },
  { id: 'membres', label: 'Membres', icon: Users, active: false, badge: null },
  { id: 'cotisations', label: 'Cotisations', icon: CreditCard, active: false, badge: null },
  { id: 'parametres', label: 'Paramètres', icon: Settings, active: false, badge: null },
];

const userMenuItems = [
  { id: 'moncompte', label: 'Mon compte', icon: User, badge: null },
  { id: 'messages', label: 'Messages', icon: MessageCircle, badge: '3' },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: '5' },
];
export function DashboardSidebar({ isOpen, onToggle, currentSection, onSectionChange }) {
  const [activeItem, setActiveItem] = useState(currentSection);
  useEffect(() => {
    setActiveItem(currentSection);
  }, [currentSection]);

  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
    onSectionChange(itemId);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch(`${url}auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
          onClick={onToggle}
        />
      )}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-center h-34 md:h-21 px-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center space-x-4 py-4">
            <img src="/images/aeddi.png" alt="AEDDI" className="h-30 sm:h-24 md:h-16 w-auto rounded-md shadow bg-white" />
            <h1 className="text-2xl sm:text-3xl md:text-2xl font-bold text-gray-900">AEDDI</h1>
          </div>
        </div>
        <nav className="mt-6 px-4 flex-1">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              Navigation
            </h3>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeItem === item.id
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-l-4 border-purple-500'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6 lg:hidden">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              Mon espace
            </h3>
            <ul className="space-y-1">
              {userMenuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeItem === item.id
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-l-4 border-purple-500'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 lg:hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Se déconnecter</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="px-4 pb-4 hidden lg:block">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Se déconnecter</span>
          </button>
        </div>
      </div>
    </>
  );
}
