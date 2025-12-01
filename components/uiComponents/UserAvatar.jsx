'use client';

import { User } from 'lucide-react';
import { url } from '../context/url.js';

export function UserAvatar({ user, size = 'md', className = '', showFallback = true }) {
  // Fonction utilitaire pour les initiales
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Tailles
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-16 h-16 text-base', // augmenté
    xl: 'w-24 h-24 text-lg'    // très grand
  };

  const imageSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-16 h-16', // augmenté
    xl: 'w-24 h-24'  // très grand
  };

  const hasImage = user && (user.avatar || user.profile_image);
  const imageSrc = user?.avatar || (user?.profile_image ? `${url}/storage/${user.profile_image}` : null);
  const initials = user ? getInitials(user.nom || user.name || '') : 'U';

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-white/20 to-white/30 rounded-full flex items-center justify-center overflow-hidden border border-white/30 ${className}`}>
      {hasImage && imageSrc ? (
        <>
          <img
            src={imageSrc}
            alt={user?.nom || user?.name || 'Photo de profil'}
            className={`${imageSizeClasses[size]} object-cover rounded-full`}
            onError={(e) => {
              // En cas d'erreur de chargement, afficher les initiales
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {showFallback && (
            <span className="text-white font-semibold hidden">
              {initials}
            </span>
          )}
        </>
      ) : (
        showFallback && (
          <span className="text-white font-semibold">
            {initials}
          </span>
        )
      )}
      {!showFallback && !hasImage && (
        <User className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
      )}
    </div>
  );
}
