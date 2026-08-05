import React, { createContext, useContext, useState } from "react";
import { url } from "../context/url.js";
import { baseHeaders } from "../context/headers.jsx";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "../../src/utils/googleAuth";

const LoginContext = createContext();

export function useLogin() {
  return useContext(LoginContext);
}

const sendFcmToken = async () => {
  try {
    const fcmToken = localStorage.getItem("fcm_token");
    if (!fcmToken) return;
    await fetch(`${url}fcm-token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const router = useRouter();

  const connecter = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await fetch(`${url}auth/login`, {
        method: "POST",
        credentials: "include",
        headers: baseHeaders,
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        await sendFcmToken();
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
    try {
      setLoadingGoogle(true);

      const googleUser = await signInWithGoogle();
      if (!googleUser) return;

      const response = await fetch(`${url}auth/google/mobile`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_token: googleUser.idToken,
          email: googleUser.email,
          name: googleUser.displayName,
          avatar: googleUser.imageUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        await sendFcmToken();
        Notify.success("Connexion Google réussie !");
        router.push("/dashboard");
      } else {
        Notify.failure("Backend: " + (data.message || "Erreur inconnue"));
      }
    } catch (error) {
      // ✅ Affiche l'erreur exacte sur l'écran
      Notify.failure("ERREUR: " + (error.message || JSON.stringify(error)));
    } finally {
      setLoadingGoogle(false);
    }
  };

  // ─── Appelé depuis la page /auth/google/success ──────
  const connecterGoogleCallback = async (userData) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      await sendFcmToken();
      Notify.success("Connexion Google réussie !");
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      Notify.failure("Erreur lors de la connexion Google.");
      return { success: false, error };
    }
  };

  const deconnecter = async () => {
    try {
      await fetch(`${url}auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: baseHeaders,
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
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
        loadingGoogle,
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
