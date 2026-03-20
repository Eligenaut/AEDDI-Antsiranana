import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export const initNotifications = async () => {
  if (!Capacitor.isNativePlatform()) return;

  // Demander permission
  const permission = await PushNotifications.requestPermissions();
  
  if (permission.receive === 'granted') {
    await PushNotifications.register();
  }

  // Récupérer le token FCM
  PushNotifications.addListener('registration', async (token) => {
    console.log('FCM Token:', token.value);
    
    // Envoyer le token au backend Laravel
    await saveFcmToken(token.value);
  });

  // Notification reçue en foreground
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Notification reçue:', notification);
  });

  // Clic sur une notification
  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Notification cliquée:', action);
  });
};

const saveFcmToken = async (token: string) => {
  try {
    const authToken = localStorage.getItem('token');
    if (!authToken) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fcm-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ fcm_token: token }),
    });
  } catch (error) {
    console.error('Erreur sauvegarde FCM token:', error);
  }
};