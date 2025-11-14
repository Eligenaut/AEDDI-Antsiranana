'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardMain } from './DashboardMain';
import { DashboardUser } from './DashboardUser';
import { DashboardCotisations } from './DashboardCotisations';
import { DashboardActivites } from './DashboardActivites';
import DashboardSetting from './DashboardSetting';

// Configurer nprogress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
  minimum: 0.2,
  easing: 'ease',
  speed: 500,
});

// Mapping entre les sections et les chemins URL
const sectionToPath = {
  'accueil': '/dashboard',
  'membres': '/dashboard/membres',
  'cotisations': '/dashboard/cotisations',
  'activites': '/dashboard/activites',
  'parametres': '/dashboard/parametres',
};

// Mapping inverse entre les chemins URL et les sections
const pathToSection = {
  '/dashboard': 'accueil',
  '/dashboard/membres': 'membres',
  '/dashboard/cotisations': 'cotisations',
  '/dashboard/activites': 'activites',
  '/dashboard/parametres': 'parametres',
};

export function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Initialiser currentSection directement depuis l'URL de manière synchrone
  const getSectionFromPath = (path) => pathToSection[path] || 'accueil';
  
  // Utiliser directement pathname pour éviter les états intermédiaires
  const currentSection = getSectionFromPath(pathname);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); 
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Gérer la barre de progression lors des changements de route
  useEffect(() => {
    // Ne rien faire au premier chargement
    if (!pathname) return;
    
    // Démarrer la barre de progression
    NProgress.start();
    
    // Simuler une progression fluide
    const interval = setInterval(() => {
      NProgress.inc(0.15);
    }, 80);
    
    // Terminer après un délai
    const timer = setTimeout(() => {
      clearInterval(interval);
      NProgress.done();
    }, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSectionChange = (section) => {
    // Mettre à jour l'URL - le state sera mis à jour automatiquement via pathname
    const path = sectionToPath[section] || '/dashboard';
    
    // Vérifier si on est déjà sur la bonne route pour éviter les navigations inutiles
    if (pathname !== path) {
      // Démarrer la barre de progression avant la navigation
      NProgress.start();
      // Simuler une progression pendant la navigation
      const progressInterval = setInterval(() => {
        NProgress.inc();
      }, 100);
      
      router.push(path);
      
      // Arrêter après un délai
      setTimeout(() => {
        clearInterval(progressInterval);
        NProgress.done();
      }, 600);
    }
    
    // Fermer la sidebar sur mobile après sélection
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Fonction pour rendre le composant approprié
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'accueil':
        return <DashboardMain />;
      case 'membres':
        return <DashboardUser />;
      case 'cotisations':
        return <DashboardCotisations />;
      case 'activites':
        return <DashboardActivites />;
      case 'parametres':
        return <DashboardSetting />;
      default:
        return <DashboardMain />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader 
          onMenuClick={toggleSidebar}
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
        />

        {/* Contenu principal - change selon la section sélectionnée */}
        {renderCurrentSection()}
      </div>
    </div>
  );
}