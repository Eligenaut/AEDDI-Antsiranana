// Types de rôles disponibles
export const ROLES = {
  ADMIN: 'admin',
  BUREAU: 'bureau',
  MEMBER: 'member'
};

export const SUB_ROLES = {
  PRESIDENT: 'president',
  VICE_PRESIDENT: 'vice_president',
  TRESORIER: 'tresorier',
  VICE_TRESORIER: 'vice_tresorier',
  COMMISSAIRE_COMPTE: 'commissaire_compte',
  COMMISSION_CERCLE_ETUDE: 'commission_cercle_etude',
  COMMISSION_INFORMATIQUE: 'commission_informatique',
  COMMISSION_LOGEMENT: 'commission_logement',
  COMMISSION_SOCIAL: 'commission_social',
  COMMISSION_FETE: 'commission_fete',
  COMMISSION_SPORT: 'commission_sport',
  COMMISSION_COMMUNICATION: 'commission_communication',
  COMMISSION_ENVIRONNEMENT: 'commission_environnement'
};

// Labels des sous-rôles
export const SUB_ROLE_LABELS = {
  [SUB_ROLES.PRESIDENT]: 'Président',
  [SUB_ROLES.VICE_PRESIDENT]: 'Vice Président',
  [SUB_ROLES.TRESORIER]: 'Trésorier(e)',
  [SUB_ROLES.VICE_TRESORIER]: 'Vice Trésorier',
  [SUB_ROLES.COMMISSAIRE_COMPTE]: 'Commissaire au compte',
  [SUB_ROLES.COMMISSION_CERCLE_ETUDE]: 'Commission (Cercle d\'étude)',
  [SUB_ROLES.COMMISSION_INFORMATIQUE]: 'Commission (Informatique)',
  [SUB_ROLES.COMMISSION_LOGEMENT]: 'Commission (Logement)',
  [SUB_ROLES.COMMISSION_SOCIAL]: 'Commission (Social)',
  [SUB_ROLES.COMMISSION_FETE]: 'Commission (Fête)',
  [SUB_ROLES.COMMISSION_SPORT]: 'Commission (Sport)',
  [SUB_ROLES.COMMISSION_COMMUNICATION]: 'Commission (Communication)',
  [SUB_ROLES.COMMISSION_ENVIRONNEMENT]: 'Commission (Environnement)'
};


export const getUserRole = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return ROLES.MEMBER;
  }

  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.role || ROLES.MEMBER;
    } catch (error) {
      console.error('Erreur lors de la lecture du rôle utilisateur:', error);
      return ROLES.MEMBER;
    }
  }
  return ROLES.MEMBER;
};

export const isAdmin = () => {
  return getUserRole() === ROLES.ADMIN;

};
export const isBureau = () => {
  return getUserRole() === ROLES.BUREAU;
}
export const isPresident = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.role === ROLES.BUREAU && userData.sub_role === SUB_ROLES.PRESIDENT;
    } catch (error) {
      console.error('Erreur lors de la lecture du rôle utilisateur:', error);
      return false;
    }
  }
  return false;
}

// Fonction pour vérifier si l'utilisateur est membre
export const isMember = () => {
  return getUserRole() === ROLES.MEMBER;
};

// Permissions par rôle
export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    canView: true,
    canEdit: true,
    canDelete: true,
    canCreate: true,
    canManageUsers: true,
    canManageCotisations: true,
    canManageActivities: true,
    canExportUsers: true
  },

  [ROLES.BUREAU]: {
    canView: true,
    canEdit: false,
    canDelete: false,
    canCreate: false,
    canManageUsers: false,
    canManageCotisations: false,
    canManageActivities: false,
    canExportUsers: false
  },
  [ROLES.MEMBER]: {
    canView: true,
    canEdit: false,
    canDelete: false,
    canCreate: false,
    canManageUsers: false,
    canManageCotisations: false,
    canManageActivities: false,
    canExportUsers: false
  }
};

// Permissions spécifiques pour les sous-rôles
export const SUB_ROLE_PERMISSIONS = {
  [SUB_ROLES.PRESIDENT]: {
    canEdit: true,
    canManageUsers: true,
    canManageCotisations: true,
    canManageActivities: true
  },
  [SUB_ROLES.VICE_PRESIDENT]: {
    canEdit: true,
    canManageUsers: false,
    canManageCotisations: false,
    canManageActivities: true
  },
  [SUB_ROLES.TRESORIER]: {
    canEdit: false,
    canManageUsers: false,
    canManageCotisations: true,
    canManageActivities: false
  }
};

export const canExportUsers = (user) => {
  if (!user) return false;

  // Admin peut toujours exporter
  if (user.role === ROLES.ADMIN) return true;

  // Membres de bureau avec rôles spécifiques
  if (user.role === ROLES.BUREAU) {
    const allowedSubRoles = [
      SUB_ROLES.PRESIDENT,
      SUB_ROLES.VICE_PRESIDENT,
      SUB_ROLES.TRESORIER,
      SUB_ROLES.VICE_TRESORIER,
      SUB_ROLES.COMMISSAIRE_COMPTE,
    ];

    return allowedSubRoles.includes(user.sub_role);
  }

  return false;
};
// export const PresidentRole =(user) =>{
//   if(user.role == ROLES.BUREAU && SUB_ROLES.PRESIDENT){
//     canEdit: true
//   };
// };
// Fonction pour vérifier une permission spécifique
export const hasPermission = (permission) => {
  const role_subrole = getUserRole();
  
  // Vérifier d'abord les permissions de base du rôle
  const basePermission = PERMISSIONS[role_subrole] && PERMISSIONS[role_subrole][permission];
  
  // Si l'utilisateur est admin, il a toutes les permissions
  if (role_subrole === ROLES.ADMIN) {
    return true;
  }
  
  // Si l'utilisateur est membre de bureau, vérifier les permissions du sous-rôle
  if (role_subrole === ROLES.BUREAU) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const subRole = user.sub_role;
    
    if (subRole && SUB_ROLE_PERMISSIONS[subRole]) {
      return SUB_ROLE_PERMISSIONS[subRole][permission] || basePermission;
    }
  }
  
  return basePermission;
};
