// @ts-check
import { create } from 'zustand';
import notificationService from '../services/notificationService';
import { useAuthStore } from './useAuthStore';
/**
 * @typedef {Object} AppNotification
 * @property {string} _id
 * @property {string} title
 * @property {string} message
 * @property {boolean} isRead
 * @property {string} createdAt
 */
/**
 * @typedef {Object} NotificationState
 * @property {AppNotification[]} notifications
 * @property {number} unreadCount
 * @property {boolean} loading
 * @property {() => Promise<void>} fetchNotifications
 * @property {(id: string) => Promise<void>} markAsRead
 * @property {() => Promise<void>} markAllAsRead
 */
/**
 * Store de Zustand para notificaciones de usuario.
 * Maneja el polling y el estado de lectura de alertas.
 * 🛡️🔔✨
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<NotificationState>>}
 */
// @ts-ignore
export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    const userId = useAuthStore.getState().getUserId();
    if (!useAuthStore.getState().isAuthenticated || !userId) {
      set({ notifications: [], unreadCount: 0 });
      return;
    }
    set({ loading: true });
    try {
      const data = await notificationService.getUserNotifications(userId);
      set({ 
        notifications: data, 
        unreadCount: data.filter((/** @type {any} */ n) => !n.isRead).length,
        loading: false 
      });
    }
    catch (error) {
      console.error('Failed to load notifications');
      set({ loading: false });
    }
  },
  markAsRead: async (id) => {
    try {
      await notificationService.markAsRead(id);
      /** @type {NotificationState} */
      const { notifications } = get();
      const updated = notifications.map(n => n._id === id ? { ...n, isRead: true } : n);
      set({ 
        notifications: updated, 
        unreadCount: Math.max(0, updated.filter(n => !n.isRead).length) 
      });
    } catch (error) {
      console.error('Error marking read');
    }
  },
  markAllAsRead: async () => {
    const userId = useAuthStore.getState().getUserId();
    if (!userId) return;
    try {
      await notificationService.markAllAsRead(userId);
      /** @type {NotificationState} */
      const { notifications } = get();
      set({ 
        notifications: notifications.map(n => ({ ...n, isRead: true })), 
        unreadCount: 0 
      });
    }
    catch (error) {
      console.error('Error marking all read');
    }
  }
}));