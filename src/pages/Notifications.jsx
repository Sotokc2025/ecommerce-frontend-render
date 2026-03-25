import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import Icon from '../components/atoms/Icon/Icon';
import './Notifications.css';

const Notifications = () => {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

  if (loading && notifications.length === 0) {
    return <div className="notifications-page container">Cargando notificaciones...</div>;
  }

  return (
    <div className="notifications-page container">
      <div className="notifications-header">
        <h1>Centro de Notificaciones</h1>
        {notifications.length > 0 && (
          <button className="mark-all-btn" onClick={markAllAsRead}>
            Marcar todas como leídas
          </button>
        )}
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <Icon name="info" size={48} />
            <p>No tienes notificaciones en este momento.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
              onClick={() => !notification.isRead && markAsRead(notification._id)}
            >
              <div className="notification-icon">
                <Icon name={notification.isRead ? "check" : "bell"} size={20} />
              </div>
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-date">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </span>
              </div>
              {!notification.isRead && <div className="unread-dot" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
