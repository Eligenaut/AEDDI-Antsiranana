"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { url } from "../context/url.js";
import { getAuthHeaders } from "../context/headers.jsx";
import { User, MessageCircle, Bell, LogOut } from "lucide-react";
import { UserAvatar } from "../uiComponents/UserAvatar.jsx";

export function DashboardHeader({
  onMenuClick,
  currentSection,
  onSectionChange,
}) {
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    setIsClient(true);
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

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
  return (
    <>
      <header className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 shadow-lg border-b border-purple-500">
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 px-2 py-2 h-16 flex items-center justify-between">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-white hover:bg-purple-500 hover:text-white transition-colors"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div
            className="flex-1 text-center cursor-pointer"
            onClick={() => onSectionChange("accueil")}
            title="Aller au tableau de bord"
          >
            <h2 className="text-xl font-extrabold tracking-wide text-white">
              AEDDI
            </h2>
          </div>
          <UserAvatar user={user} size="lg" />
        </div>
        <div className="lg:hidden h-16"></div>
        <div className="lg:hidden px-4 py-2 border-t border-purple-500/30">
          <div className="flex items-center justify-between">
            <button
              className="p-3 text-white hover:bg-purple-500 rounded-lg transition-colors"
              onClick={() => onSectionChange("accueil")}
              title="Accueil"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>
            <div className="flex-1 mx-3 flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all bg-white/90 backdrop-blur-sm"
                />
              </div>
              <button className="p-2 bg-white/80 hover:bg-purple-100 rounded-lg shadow text-purple-700 transition-colors flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="hidden lg:block px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Tableau de bord AEDDI
                </h2>
              </div>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher formations, événements, membres..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all bg-white/90 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4 ml-4">
              <button
                className="relative p-2 text-white hover:text-purple-200 rounded-lg transition-colors flex items-center"
                title="Notifications"
              >
                <Bell className="w-6 h-6" />
                <span className="ml-2 hidden xl:inline">Notification</span>
                <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
              <button
                className="relative p-2 text-white hover:text-purple-200 rounded-lg transition-colors flex items-center"
                title="Messages"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="ml-2 hidden xl:inline">Message</span>
                <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-blue-400 ring-2 ring-white"></span>
              </button>
              <button
                className="p-2 text-white hover:text-purple-200 rounded-lg transition-colors flex items-center"
                title="Mon compte"
              >
                <UserAvatar user={user} size="lg" />
                <span className="ml-2 hidden xl:inline">Mon compte</span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-white hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-colors flex items-center"
                title="Se déconnecter"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 shadow-t rounded-t-lg border-t border-purple-500/30 flex justify-around items-center py-2 lg:hidden">
        <button
          className={`flex flex-col items-center transition-colors ${
            currentSection === "accueil"
              ? "text-white font-bold"
              : "text-white/80 hover:text-white focus:text-white"
          }`}
          onClick={() => onSectionChange("accueil")}
        >
          <svg
            className="w-7 h-7 mb-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-xs font-medium">Accueil</span>
        </button>
        <button
          className={`flex flex-col items-center transition-colors ${
            currentSection === "membres"
              ? "text-white font-bold"
              : "text-white/80 hover:text-white focus:text-white"
          }`}
          onClick={() => onSectionChange("membres")}
        >
          <svg
            className="w-7 h-7 mb-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V6a4 4 0 00-8 0v4m12 0a4 4 0 01-8 0m8 0v4a4 4 0 01-8 0v-4"
            />
          </svg>
          <span className="text-xs font-medium">Membres</span>
        </button>
        <button
          className={`flex flex-col items-center transition-colors ${
            currentSection === "activites"
              ? "text-white font-bold"
              : "text-white/80 hover:text-white focus:text-white"
          }`}
          onClick={() => onSectionChange("activites")}
        >
          <svg
            className="w-7 h-7 mb-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 21h8M12 17v4m-6-8h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs font-medium">Activités</span>
        </button>
        <button
          className={`flex flex-col items-center transition-colors ${
            currentSection === "cotisations"
              ? "text-white font-bold"
              : "text-white/80 hover:text-white focus:text-white"
          }`}
          onClick={() => onSectionChange("cotisations")}
        >
          <svg
            className="w-7 h-7 mb-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
            />
          </svg>
          <span className="text-xs font-medium">Cotisations</span>
        </button>
      </nav>
    </>
  );
}
