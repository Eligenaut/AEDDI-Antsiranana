import { PushNotifications } from '@capacitor/push-notifications';
// import { Capacitor } from '@capacitor/core';

export const initNotifications = async () => {
  // Vérifie si on est sur Android/iOS
  if (Capacitor.getPlatform() === 'web') return;

  try {
    // Demander permission
    const permission = await PushNotifications.requestPermissions();
    console.log('Permission notifications:', permission);
    
    if (permission.receive === 'granted') {
      await PushNotifications.register();
      console.log('FCM enregistré');
    }

    // Récupérer le token FCM
    PushNotifications.addListener('registration', async (token) => {
      console.log('FCM Token:', token.value);
      await saveFcmToken(token.value);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('FCM registration error:', error);
    });

    // Notification reçue en foreground
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notification reçue:', notification);
    });

    // Clic sur une notification
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Notification cliquée:', action);
    });

  } catch (error) {
    console.error('Erreur initNotifications:', error);
  }
};

const saveFcmToken = async (token: string) => {
  try {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      console.log('Pas de token auth — FCM token non sauvegardé');
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fcm-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ fcm_token: token }),
    });

    console.log('FCM token sauvegardé:', response.status);
  } catch (error) {
    console.error('Erreur sauvegarde FCM token:', error);
  }
};