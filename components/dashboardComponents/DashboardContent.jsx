"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { AccesRefuse } from "../common/AccesRefuse";
import { usePermissions, SECTION_PERMISSIONS } from "../context/permissions";

const sectionToPath = {
  accueil: "/dashboard",
  membres: "/dashboard/membres",
  membres_email: "/dashboard/membres/email",
  cotisations: "/dashboard/cotisations",
  activites: "/dashboard/activites",
  taches: "/dashboard/taches",
  moncompte: "/dashboard/parametres/moncompte",
  permissions: "/dashboard/parametres/permissions",
  dataregister: "/dashboard/parametres/dataregister",
};

const pathToSection = {
  "/dashboard": "accueil",
  "/dashboard/membres": "membres",
  "/dashboard/membres/email": "membres_email",
  "/dashboard/cotisations": "cotisations",
  "/dashboard/activites": "activites",
  "/dashboard/taches": "taches",
  "/dashboard/parametres/moncompte": "moncompte",
  "/dashboard/parametres/permissions": "permissions",
  "/dashboard/parametres/dataregister": "dataregister",
};

export function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const np = useRef(null);
  const { ready, can } = usePermissions();

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

  const requiredPermission = SECTION_PERMISSIONS[currentSection];
  const allowed = ready && (requiredPermission ? can(requiredPermission) : true);

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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <NotificationsDrawer
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
      <DashboardSidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader
          onMenuClick={toggleSidebar}
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
          onOpenNotifications={() => setNotifOpen(true)}
        />

        <div className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {!ready ? null : allowed ? children : <AccesRefuse />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
