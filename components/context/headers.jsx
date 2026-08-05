import axios from "axios";

// Authentification par cookie httpOnly : toutes les requêtes axios
// envoient automatiquement les cookies (SameSite Lax / même domaine).
axios.defaults.withCredentials = true;

// L'authentification est portée par le cookie "auth_token" défini par le
// backend. On n'envoie donc plus de token depuis le localStorage.
export const getAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
};

export const baseHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

// Options par défaut pour les appels fetch authentifiés (cookies).
export const credentialsOption = { credentials: "include" };
