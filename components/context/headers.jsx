// Fonction pour obtenir les headers d'authentification
export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

export const baseHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
