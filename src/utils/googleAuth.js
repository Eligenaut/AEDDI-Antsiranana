import { Capacitor } from '@capacitor/core';

export const signInWithGoogle = async () => {
  const platform = Capacitor.getPlatform();

  if (platform === 'web') {
    window.location.href =
      'https://aeddi-backend-production.up.railway.app/auth/google';
    return null;
  }

  // Android / iOS — import dynamique pour éviter erreur build Next.js
  const { FirebaseAuthentication } = await import(
    '@capacitor-firebase/authentication'
  );

  const result = await FirebaseAuthentication.signInWithGoogle({
    customParameters: [{ key: 'prompt', value: 'select_account' }],
  });

  if (!result.credential?.idToken) {
    throw new Error('Impossible de récupérer le token Google');
  }

  return {
    idToken:     result.credential.idToken,
    email:       result.user?.email,
    displayName: result.user?.displayName,
    imageUrl:    result.user?.photoUrl,
  };
};