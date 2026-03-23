import React, { createContext, useContext, useState } from "react";
import { url } from "../context/url.js";
import { baseHeaders } from "../context/headers.jsx";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

const LoginContext = createContext();

export function useLogin() {
  return useContext(LoginContext);
}

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
      if (data.success) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
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
    if (Capacitor.isNativePlatform()) {
      // Écoute le deep link de retour
      App.addListener("appUrlOpen", async (event) => {
        const urlObj = new URL(event.url);

        if (urlObj.pathname.includes("/auth/google/success")) {
          const token = urlObj.searchParams.get("token");
          const userParam = urlObj.searchParams.get("user");

          await Browser.close();

          if (token && userParam) {
            const userData = JSON.parse(decodeURIComponent(userParam));
            localStorage.setItem("auth_token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            await sendFcmToken(token);
            Notify.success("Connexion Google réussie !");
            router.push("/dashboard");
          }
        }
      });

      // Ouvre le navigateur in-app
      await Browser.open({
        url: "https://aeddi-backend-production.up.railway.app/auth/google",
        windowName: "_self",
      });
    } else {
      // Web
      window.location.href =
        "https://aeddi-backend-production.up.railway.app/auth/google";
    }
  };

  // ─── Appelé depuis la page /auth/google/callback ──────
  const connecterGoogleCallback = async (token, userData) => {
    try {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      await sendFcmToken(token);
      Notify.success("Connexion Google réussie !");
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      Notify.failure("Erreur lors de la connexion Google.");
      return { success: false, error };
    }
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
      value={{
        user,
        loading,
        connecter,
        connecterGoogle,
        connecterGoogleCallback,
        deconnecter,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
