// ─── Rôles ─────────────────────────────────────────────────────────────────
export const ROLES = {
  BUREAU: "BUREAU",
  MEMBER: "MEMBER",
  NOVICE: "NOVICE",
};

// ─── Sous-rôles ────────────────────────────────────────────────────────────
export const SUB_ROLES = {
  PRESIDENT: "PRESIDENT",
  VICE_PRESIDENT: "VICE_PRESIDENT",
  TRESORIER: "TRESORIER",
  VICE_TRESORIER: "VICE_TRESORIER",
  COMMISSAIRE_COMPTE: "COMMISSAIRE_COMPTE",
  COMMISSION_CERCLE_ETUDE: "COMMISSION_CERCLE_ETUDE",
  COMMISSION_INFORMATIQUE: "COMMISSION_INFORMATIQUE",
  COMMISSION_LOGEMENT: "COMMISSION_LOGEMENT",
  COMMISSION_SOCIAL: "COMMISSION_SOCIAL",
  COMMISSION_FETE: "COMMISSION_FETE",
  COMMISSION_SPORT: "COMMISSION_SPORT",
  COMMISSION_COMMUNICATION: "COMMISSION_COMMUNICATION",
  COMMISSION_ENVIRONNEMENT: "COMMISSION_ENVIRONNEMENT",
};

// ─── Labels des sous-rôles ─────────────────────────────────────────────────
export const SUB_ROLE_LABELS = {
  PRESIDENT: "Président",
  VICE_PRESIDENT: "Vice-Président",
  TRESORIER: "Trésorier",
  VICE_TRESORIER: "Vice-Trésorier",
  COMMISSAIRE_COMPTE: "Commissaire aux comptes",
  COMMISSION_CERCLE_ETUDE: "Cercle d'étude",
  COMMISSION_INFORMATIQUE: "Commission Informatique",
  COMMISSION_LOGEMENT: "Commission Logement",
  COMMISSION_SOCIAL: "Commission Social",
  COMMISSION_FETE: "Commission Fête",
  COMMISSION_SPORT: "Commission Sport",
  COMMISSION_COMMUNICATION: "Commission Communication",
  COMMISSION_ENVIRONNEMENT: "Commission Environnement",
};

// ─── Catégories de sous-rôles ──────────────────────────────────────────────
export const subRoleCategories = [
  {
    label: "Direction",
    color: "#6366f1",
    bg: "#eef2ff",
    roles: [
      SUB_ROLES.PRESIDENT,
      SUB_ROLES.VICE_PRESIDENT,
      SUB_ROLES.TRESORIER,
      SUB_ROLES.VICE_TRESORIER,
      SUB_ROLES.COMMISSAIRE_COMPTE,
    ],
  },
  {
    label: "Commissions",
    color: "#0891b2",
    bg: "#ecfeff",
    roles: [
      SUB_ROLES.COMMISSION_CERCLE_ETUDE,
      SUB_ROLES.COMMISSION_INFORMATIQUE,
      SUB_ROLES.COMMISSION_LOGEMENT,
      SUB_ROLES.COMMISSION_SOCIAL,
      SUB_ROLES.COMMISSION_FETE,
      SUB_ROLES.COMMISSION_SPORT,
      SUB_ROLES.COMMISSION_COMMUNICATION,
      SUB_ROLES.COMMISSION_ENVIRONNEMENT,
    ],
  },
];

// ─── Icônes de rôles ───────────────────────────────────────────────────────
export const roleIcons = {
  [ROLES.BUREAU]: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="20" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="22" cy="20" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M14 12v4M10 20h8M6 17v-1a4 4 0 014-4h8a4 4 0 014 4v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  [ROLES.MEMBER]: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 24c0-4.97 4.03-9 9-9s9 4.03 9 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  [ROLES.NOVICE]: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 24c0-4.97 4.03-9 9-9s9 4.03 9 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// ─── Configuration des rôles ───────────────────────────────────────────────
export const roleConfigs = [
  {
    key: ROLES.BUREAU,
    label: "Membre du Bureau",
    desc: "Président, Trésorier, Commissions, etc.",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    accent: "#eef2ff",
    accentBorder: "#c7d2fe",
    accentText: "#4f46e5",
  },
  {
    key: ROLES.MEMBER,
    label: "Membre",
    desc: "Simple membre sans rôle spécifique",
    gradient: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
    accent: "#ecfeff",
    accentBorder: "#a5f3fc",
    accentText: "#0e7490",
  },
  {
    key: ROLES.NOVICE,
    label: "Novice",
    desc: "Nouveau membre sans rôle spécifique",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    accent: "#fffbeb",
    accentBorder: "#fde68a",
    accentText: "#b45309",
  },
];
