'use client';

import { useEffect } from 'react';
import { initNotifications } from '../lib/notifications';

export default function NotificationProvider() {
  useEffect(() => {
    initNotifications();
  }, []);

  return null;
}