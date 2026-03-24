"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardMain } from "./DashboardMain";
import { DashboardUser } from "./DashboardUser";
import { DashboardCotisations } from "./DashboardCotisations";
import { DashboardActivites } from "./DashboardActivites";
import UserDetail from "./UserDetail";
import ManagePermission from "./ManagePermission";

const sectionToPath = {
  accueil: "/dashboard",
  membres: "/dashboard/membres",
  cotisations: "/dashboard/cotisations",
  activites: "/dashboard/activites",
  moncompte: "/dashboard/parametres/moncompte",
  permissions: "/dashboard/parametres/permissions",
};

const pathToSection = {
  "/dashboard": "accueil",
  "/dashboard/membres": "membres",
  "/dashboard/cotisations": "cotisations",
  "/dashboard/activites": "activites",
  "/dashboard/parametres/moncompte": "moncompte",
  "/dashboard/parametres/permissions": "permissions",
};

export function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const np = useRef(null);

  useEffect(() => {
    import("nprogress").then((mod) => {
      np.current = mod.default;
      np.current.configure({
        showSpinner: false,
        trickleSpeed: 100,
        minimum: 0.2,
        easing: "ease",
        speed: 500,
      });
    });
  }, []);

  const getSectionFromPath = (path) => pathToSection[path] || "accueil";
  const currentSection = getSectionFromPath(pathname);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    if (!pathname || !np.current) return;

    np.current.start();

    const interval = setInterval(() => {
      np.current?.inc(0.15);
    }, 80);

    const timer = setTimeout(() => {
      clearInterval(interval);
      np.current?.done();
    }, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      np.current?.done();
    };
  }, [pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSectionChange = (section) => {
    const path = sectionToPath[section] || "/dashboard";

    if (pathname !== path) {
      np.current?.start();

      const progressInterval = setInterval(() => {
        np.current?.inc();
      }, 100);

      router.push(path);

      setTimeout(() => {
        clearInterval(progressInterval);
        np.current?.done();
      }, 600);
    }

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "accueil":
        return <DashboardMain />;
      case "membres":
        return <DashboardUser />;
      case "cotisations":
        return <DashboardCotisations />;
      case "activites":
        return <DashboardActivites />;
      case "moncompte":
        return <UserDetail />;
      case "permissions":
        return (
          <ManagePermission
            onSave={(permissions) => {
              console.log("Permissions sauvegardées:", permissions);
            }}
            onBack={() => handleSectionChange("accueil")}
          />
        );
      default:
        return <DashboardMain />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          onMenuClick={toggleSidebar}
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
        />

        <div className="flex-1 overflow-y-auto pb-16 lg:pb-0 lg:pt-0">
          {renderCurrentSection()}
        </div>
      </div>
    </div>
  );
}
