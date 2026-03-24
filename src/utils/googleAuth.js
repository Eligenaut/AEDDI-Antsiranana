import { Capacitor } from '@capacitor/core';

export const signInWithGoogle = async () => {
  const isNative = Capacitor.isNativePlatform();
  console.log('=== Google Auth ===');
  console.log('isNative:', isNative);

  if (!isNative) {
    window.location.href =
      'https://aeddi-backend-production.up.railway.app/auth/google';
    return null;
  }

  try {
    const { FirebaseAuthentication } = await import(
      '@capacitor-firebase/authentication'
    );
    console.log('FirebaseAuthentication importé ✅');

    const result = await FirebaseAuthentication.signInWithGoogle({
      customParameters: [{ key: 'prompt', value: 'select_account' }],
    });

    console.log('result complet:', JSON.stringify(result));
    console.log('idToken:', result.credential?.idToken ? '✅ présent' : '❌ absent');
    console.log('user email:', result.user?.email);

    if (!result.credential?.idToken) {
      throw new Error('Impossible de récupérer le token Google');
    }

    return {
      idToken:     result.credential.idToken,
      email:       result.user?.email,
      displayName: result.user?.displayName,
      imageUrl:    result.user?.photoUrl,
    };

  } catch (error) {
    console.error('=== ERREUR googleAuth ===');
    console.error('message:', error.message);
    console.error('code:', error.code);
    console.error('complet:', JSON.stringify(error));
    throw error;
  }
};