// src/utils/googleAuth.js
import { Capacitor } from '@capacitor/core';

export const signInWithGoogle = async () => {
  const platform = Capacitor.getPlatform();

  if (platform === 'web') {
    // Redirige vers le backend OAuth
    window.location.href = 'https://aeddi-backend-production.up.railway.app/auth/google';
    return null;
  }

  // Android / iOS — charge le plugin dynamiquement
  // pour éviter l'erreur au build Next.js
  const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');

  await GoogleAuth.initialize({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    scopes: ['profile', 'email'],
    grantOfflineAccess: true,
  });

  const googleUser = await GoogleAuth.signIn();
  return googleUser;
};