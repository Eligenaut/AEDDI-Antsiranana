import React, { createContext, useContext, useState } from 'react';
import { url } from '../context/url.js';
import { baseHeaders } from '../context/headers.jsx';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useRouter } from 'next/navigation';

const LoginContext = createContext();

export function useLogin() {
  return useContext(LoginContext);
}

export function LoginProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const connecter = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await fetch(`${url}auth/login`, {
        method: 'POST',
        headers: baseHeaders,
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        Notify.success('Connexion réussie !');
        router.push('/dashboard');
        return { success: true };
      } else {
        Notify.failure('Erreur de connexion: ' + (data.message || 'Identifiants incorrects'));
        return { success: false, error: data.message };
      }
    } catch (error) {
      Notify.failure('Erreur de connexion. Vérifiez que le serveur backend est démarré.');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const connecterGoogle = async () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  const deconnecter = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    Notify.success('Déconnexion réussie !');
    router.push('/');
  };

  return (
    <LoginContext.Provider value={{ user, loading, connecter, connecterGoogle, deconnecter }}>
      {children}
    </LoginContext.Provider>
  );
}
