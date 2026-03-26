// @ts-check
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../atoms/Icon/Icon';
import { useNotifications } from '../../../context/NotificationContext';
import './NotificationBell.css';

const NotificationBell = ({ isMobile = false }) => {
  const { unreadCount } = useNotifications();

  return (
    <Link 
      to="/profile/notifications" 
      className={`notification-bell ${isMobile ? 'mobile' : ''}`}
      aria-label="Ver notificaciones"
    >
      <Icon name="bell" size={isMobile ? 24 : 22} />
      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
