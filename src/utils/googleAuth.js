import { Capacitor } from '@capacitor/core';

export const signInWithGoogle = async () => {
  // isNativePlatform() est plus fiable que getPlatform() === 'web'
  // quand server.url est configuré
  const isNative = Capacitor.isNativePlatform();

  if (!isNative) {
    // Web → redirige vers backend OAuth
    window.location.href =
      'https://aeddi-backend-production.up.railway.app/auth/google';
    return null;
  }

  // Android / iOS
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