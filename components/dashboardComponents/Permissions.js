// ─── Catégories de permissions ─────────────────────────────────────────────
export const permissionCategories = [
  {
    id: "activite",
    name: "Activités",
    icon: "🎯",
    permissions: [
      { id: "show_activite", label: "Voir" },
      { id: "edit_activite", label: "Modifier" },
      { id: "delete_activite", label: "Supprimer" },
      { id: "create_activite", label: "Créer" },
    ],
  },
  {
    id: "cotisation",
    name: "Cotisations",
    icon: "💰",
    permissions: [
      { id: "show_cotisation", label: "Voir" },
      { id: "edit_cotisation", label: "Modifier" },
      { id: "delete_cotisation", label: "Supprimer" },
      { id: "create_cotisation", label: "Créer" },
    ],
  },
  {
    id: "membre",
    name: "Membres",
    icon: "👥",
    permissions: [
      { id: "show_membre", label: "Voir" },
      { id: "edit_membre", label: "Modifier" },
      { id: "delete_membre", label: "Supprimer" },
      { id: "create_membre", label: "Créer" },
    ],
  },
  {
    id: "parametre",
    name: "Paramètres",
    icon: "⚙️",
    permissions: [
      { id: "show_parametre", label: "Voir" },
      { id: "edit_parametre", label: "Modifier" },
      { id: "delete_parametre", label: "Supprimer" },
      { id: "create_parametre", label: "Créer" },
    ],
  },
  {
    id: "tache",
    name: "Tâches",
    icon: "📋",
    permissions: [
      { id: "show_tache", label: "Voir" },
      { id: "edit_tache", label: "Modifier" },
      { id: "delete_tache", label: "Supprimer" },
      { id: "create_tache", label: "Créer" },
    ],
  },
];

export const allPermissionIds = permissionCategories.flatMap((c) =>
  c.permissions.map((p) => p.id)
);