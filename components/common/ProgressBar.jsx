'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';

// Configurer nprogress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
});

export function ProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    // Démarrer la barre de progression lors du changement de route
    NProgress.start();
    
    // Terminer la barre de progression après un court délai
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  return null;
}

