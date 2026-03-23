import React, { createContext, useContext, useState } from "react";
import { url } from "../context/url.js";
import { baseHeaders } from "../context/headers.jsx";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { useRouter } from "next/navigation";

const LoginContext = createContext();

export function useLogin() {
  return useContext(LoginContext);
}

// ─── Helper envoi FCM token ───────────────────────────────
const sendFcmToken = async (authToken) => {
  try {
    const fcmToken = localStorage.getItem("fcm_token");
    if (!fcmToken) return;

    await fetch(`${url}fcm-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ fcm_token: fcmToken }),
    });

    console.log("FCM token envoyé au backend");
  } catch (error) {
    console.error("Erreur envoi FCM token:", error);
  }
};

export function LoginProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const connecter = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await fetch(`${url}auth/login`, {
        method: "POST",
        headers: baseHeaders,
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("Login response:", data);
      if (data.success) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);

        // ─── Envoie le FCM token après connexion ───────────
        await sendFcmToken(data.token);

        Notify.success("Connexion réussie !");
        router.push("/dashboard");
        return { success: true };
      } else {
        Notify.failure(
          "Erreur de connexion: " + (data.message || "Identifiants incorrects"),
        );
        return { success: false, error: data.message };
      }
    } catch (error) {
      Notify.failure(
        "Erreur de connexion. Vérifiez que le serveur backend est démarré.",
      );
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

const connecterGoogle = async () => {
  const baseUrl = 'https://aeddi-backend-production.up.railway.app';
  window.location.href = `${baseUrl}/auth/google`;
};

  const deconnecter = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("fcm_token");
    setUser(null);
    Notify.success("Déconnexion réussie !");
    router.push("/");
  };

  return (
    <LoginContext.Provider
      value={{ user, loading, connecter, connecterGoogle, deconnecter }}
    >
      {children}
    </LoginContext.Provider>
  );
}
