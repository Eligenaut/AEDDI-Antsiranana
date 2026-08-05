import { useState, useEffect } from "react";

// Gating des permissions côté client.
// Les permissions de l'utilisateur sont fournies par le backend (login / me)
// dans user.permissions. Un utilisateur ne voit que ce que son rôle autorise.

export const SECTION_PERMISSIONS = {
  activites: "show_activite",
  membres: "show_membre",
  membres_email: "show_membre",
  cotisations: "show_cotisation",
  taches: "show_tache",
  permissions: "show_parametre",
  dataregister: "show_parametre",
};

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

// Hook sécurité pour le rendu (pas de localStorage pendant le SSR) :
// renvoie l'utilisateur après montage pour éviter les mismatch d'hydratation.
export function usePermissions() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const ready = user !== null;

  const can = (permission) => {
    if (!permission) return true;
    return Array.isArray(user?.permissions) && user.permissions.includes(permission);
  };

  return { user, ready, can };
}

// Vérifie si l'utilisateur peut voir une section du dashboard.
export function canSeeSection(section) {
  return can(SECTION_PERMISSIONS[section]);
}

// Vérifie si l'utilisateur courant possède une permission (post-montage).
export function can(permission) {
  if (!permission) return true;
  const user = getUser();
  const perms = user?.permissions;
  return Array.isArray(perms) && perms.includes(permission);
}
