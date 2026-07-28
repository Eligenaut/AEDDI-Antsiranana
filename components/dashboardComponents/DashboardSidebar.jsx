"use client";

import { useState, useEffect, useRef } from "react";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";
import {
  Home,
  Calendar,
  Users,
  CreditCard,
  User,
  MessageCircle,
  Bell,
  LogOut,
  X,
  Settings,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ClipboardList,
  Database,
} from "lucide-react";

const menuItems = [
  { id: "accueil", label: "Accueil", icon: Home, active: true, badge: null },
  {
    id: "activites",
    label: "Activités",
    icon: Calendar,
    active: false,
    badge: null,
  },
  { id: "membres", label: "Membres", icon: Users, active: false, badge: null },
  {
    id: "cotisations",
    label: "Cotisations",
    icon: CreditCard,
    active: false,
    badge: null,
  },
  {
    id: "taches",
    label: "Tâches",
    icon: ClipboardList,
    active: false,
    badge: null,
  },
];

const parametresSubItems = [
  { id: "moncompte", label: "Mon compte", icon: User },
  { id: "permissions", label: "Permissions", icon: Settings },
  { id: "dataregister", label: "Données inscription", icon: Database },
];

const userMenuItems = [
  { id: "moncompte", label: "Mon compte", icon: User, badge: null },
  { id: "messages", label: "Messages", icon: MessageCircle, badge: "3" },
  { id: "notifications", label: "Notifications", icon: Bell, badge: "5" },
];

export function DashboardSidebar({
  isOpen,
  onToggle,
  currentSection,
  onSectionChange,
}) {
  const [activeItem, setActiveItem] = useState(currentSection);
  const [parametresExpanded, setParametresExpanded] = useState(false);

  const getInitialExpanded = () => {
    if (typeof window === "undefined") return false;
    const desktop = window.innerWidth >= 1024;
    if (desktop) {
      const savedExpanded = localStorage.getItem("sidebarExpanded");
      return savedExpanded === "true";
    }
    return false;
  };

  const [isExpanded, setIsExpanded] = useState(getInitialExpanded);
  const [isDesktop, setIsDesktop] = useState(false);
  const wasDesktopRef = useRef(false);

  useEffect(() => {
    setActiveItem(currentSection);
    if (parametresSubItems.some((item) => item.id === currentSection)) {
      setParametresExpanded(true);
    }
  }, [currentSection]);

  useEffect(() => {
    const checkIsDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      const wasDesktop = wasDesktopRef.current;

      if (desktop && !wasDesktop) {
        const savedExpanded = localStorage.getItem("sidebarExpanded");
        if (savedExpanded !== null) {
          setIsExpanded(savedExpanded === "true");
        } else {
          setIsExpanded(false);
        }
      } else if (!desktop && wasDesktop) {
        setIsExpanded(true);
      }

      setIsDesktop(desktop);
      wasDesktopRef.current = desktop;
    };

    checkIsDesktop();

    const desktop = window.innerWidth >= 1024;
    if (!desktop) {
      setIsExpanded(true);
    }

    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
    onSectionChange(itemId);
  };

  const toggleParametres = () => {
    setParametresExpanded(!parametresExpanded);
  };

  const toggleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (isDesktop) {
      localStorage.setItem("sidebarExpanded", newExpanded.toString());
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await fetch(`${url}auth/logout`, {
          method: "POST",
          headers: getAuthHeaders(),
        });
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  const sidebarExpanded = isDesktop ? isExpanded : isOpen;
  const sidebarWidth = isDesktop
    ? sidebarExpanded
      ? "w-64"
      : "w-20"
    : "w-full";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
          onClick={onToggle}
        />
      )}
      <div
        className={`
    fixed lg:static top-[140px] lg:top-0 bottom-16 lg:bottom-0 left-0 z-50 bg-white shadow-xl border-r border-gray-200
    flex flex-col transition-all duration-300 ease-in-out
    ${sidebarWidth}
    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
      >
        {isDesktop && (
          <button
            onClick={toggleExpand}
            className="absolute top-20 -right-3 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 group"
            aria-label={
              isExpanded ? "Réduire la sidebar" : "Agrandir la sidebar"
            }
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
            )}
          </button>
        )}

        <nav className="mt-0 lg:mt-6 px-4 flex-1 overflow-y-auto lg:pb-0">
          <div className="mb-6">
            <div
              className={`flex items-center justify-between mb-2 px-3 transition-all duration-300 ${
                sidebarExpanded
                  ? "opacity-100"
                  : "opacity-0 h-0 overflow-hidden"
              }`}
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Navigation
              </h3>
              {!isDesktop && (
                <button
                  onClick={onToggle}
                  className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center transition-all duration-200 rounded-lg ${
                      sidebarExpanded
                        ? "justify-between px-4 py-3"
                        : "justify-center px-2 py-3"
                    } ${
                      activeItem === item.id
                        ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-l-4 border-purple-500"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    title={!sidebarExpanded ? item.label : ""}
                  >
                    <div
                      className={`flex items-center transition-all duration-300 ${
                        sidebarExpanded ? "space-x-3" : "justify-center"
                      }`}
                    >
                      <item.icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <span
                        className={`font-medium transition-all duration-300 whitespace-nowrap ${
                          sidebarExpanded
                            ? "opacity-100 max-w-full"
                            : "opacity-0 max-w-0 overflow-hidden"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    {item.badge && sidebarExpanded && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}

              {/* Paramètres - juste un toggle, pas un lien */}
              <li key="parametres">
                <button
                  onClick={toggleParametres}
                  className={`w-full flex items-center transition-all duration-200 rounded-lg ${
                    sidebarExpanded
                      ? "justify-between px-4 py-3"
                      : "justify-center px-2 py-3"
                  } text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                  title={!sidebarExpanded ? "Paramètres" : ""}
                >
                  <div
                    className={`flex items-center transition-all duration-300 ${
                      sidebarExpanded ? "space-x-3" : "justify-center"
                    }`}
                  >
                    <Settings className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span
                      className={`font-medium transition-all duration-300 whitespace-nowrap ${
                        sidebarExpanded
                          ? "opacity-100 max-w-full"
                          : "opacity-0 max-w-0 overflow-hidden"
                      }`}
                    >
                      Paramètres
                    </span>
                  </div>
                  {sidebarExpanded && (
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform duration-300 flex-shrink-0 ${
                        parametresExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Sous-menu Paramètres */}
                {parametresExpanded && sidebarExpanded && (
                  <ul className="mt-1 space-y-1 pl-4 border-l-2 border-purple-200">
                    {parametresSubItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleMenuClick(item.id)}
                          className={`w-full flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                            activeItem === item.id
                              ? "bg-purple-100 text-purple-700 font-medium"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Version condensée - afficher les sous-items en icônes quand sidebar réduite */}
                {parametresExpanded && !sidebarExpanded && (
                  <ul className="mt-1 space-y-1">
                    {parametresSubItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleMenuClick(item.id)}
                          className={`w-full flex justify-center p-2 rounded-lg transition-all duration-200 ${
                            activeItem === item.id
                              ? "bg-purple-100 text-purple-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                          title={item.label}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
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
                        ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-l-4 border-purple-500"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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

        {/* Bouton déconnexion - Desktop */}
        <div className="px-4 pb-4 hidden lg:block">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center transition-all duration-300 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 ${
              sidebarExpanded
                ? "justify-start space-x-3 px-4 py-3"
                : "justify-center px-2 py-3"
            }`}
            title={!sidebarExpanded ? "Se déconnecter" : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={`font-medium transition-all duration-300 whitespace-nowrap ${
                sidebarExpanded
                  ? "opacity-100 max-w-full"
                  : "opacity-0 max-w-0 overflow-hidden"
              }`}
            >
              Se déconnecter
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
