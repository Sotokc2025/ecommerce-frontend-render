// @ts-check
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificationStore } from '../store/useNotificationStore';

/**
 * @typedef {import('../store/useNotificationStore').NotificationState} NotificationState
 */

/**
 * NotificationContext (Proxy para Zustand - Fase 3).
 * Distribuye notificaciones asincrónicas a toda la aplicación.
 * 🛡️🔔✨
 * @type {import('react').Context<any>}
 */
const NotificationContext = createContext(/** @type {any} */ (null));

/** @param {{ children: import('react').ReactNode }} props */
export const NotificationProvider = ({ children }) => {
  const store = useNotificationStore();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      store.fetchNotifications();
      // Polling cada 60 segundos
      const interval = setInterval(() => store.fetchNotifications(), 60000);
      return () => clearInterval(interval);
    } else {
      // Limpiar al cerrar sesión
      useNotificationStore.setState({ notifications: [], unreadCount: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id, user?._id]);

  const value = useMemo(() => ({
    ...store,
  }), [store]);

  return (
    <NotificationContext.Provider value={/** @type {any} */ (value)}>
      {children}
    </NotificationContext.Provider>
  );
};
/**
 * @returns {any}
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications debe usarse dentro de un NotificationProvider");
  }
  return context;
};
