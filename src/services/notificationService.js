import http from './http';

/**
 * Servicio para la gestión de notificaciones.
 */
const notificationService = {
  /**
   * Obtiene todas las notificaciones del usuario actual.
   * @param {string} userId ID del usuario.
   */
  getUserNotifications: async (userId) => {
    try {
      const response = await http.get(`/notifications/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  /**
   * Obtiene solo las notificaciones no leídas.
   * @param {string} userId ID del usuario.
   */
  getUnreadNotifications: async (userId) => {
    try {
      const response = await http.get(`/notifications/unread/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  },

  /**
   * Marca una notificación específica como leída.
   * @param {string} notificationId ID de la notificación.
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await http.patch(`/notifications/${notificationId}/mark-read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Marca todas las notificaciones del usuario como leídas.
   * @param {string} userId ID del usuario.
   */
  markAllAsRead: async (userId) => {
    try {
      const response = await http.patch(`/notifications/user/${userId}/mark-all-read`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
};

export default notificationService;
