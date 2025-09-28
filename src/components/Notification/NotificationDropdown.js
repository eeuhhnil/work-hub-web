import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faFolder,
  faTasks,
  faBell,
  faCheckDouble,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../../contexts/NotificationContext';
import { 
  formatNotificationMessage, 
  getNotificationIcon, 
  getNotificationColor,
  formatTimeAgo,
  isRecentNotification
} from '../../utils/notificationUtils';

const NotificationDropdown = ({ onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead,
    isConnected 
  } = useNotifications();

  const getIconComponent = (iconName) => {
    const iconMap = {
      building: faBuilding,
      folder: faFolder,
      tasks: faTasks,
      bell: faBell,
    };
    return iconMap[iconName] || faBell;
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount > 0) {
      await markAllAsRead();
    }
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {!isConnected && (
            <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
              Disconnected
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            title="Mark all as read"
          >
            <FontAwesomeIcon icon={faCheckDouble} className="w-3 h-3" />
            Mark all read
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center p-8">
            <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 text-gray-400 animate-spin" />
            <span className="ml-2 text-gray-500">Loading notifications...</span>
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-red-600">
            <p>Error loading notifications</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FontAwesomeIcon icon={faBell} className="w-8 h-8 mb-2 text-gray-300" />
            <p>No notifications yet</p>
            <p className="text-sm">You'll see notifications here when they arrive</p>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => {
              const message = formatNotificationMessage(notification);
              const icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);
              const timeAgo = formatTimeAgo(notification.createdAt);
              const isRecent = isRecentNotification(notification.createdAt);

              return (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    p-4 cursor-pointer transition-colors duration-200
                    ${!notification.isRead 
                      ? 'bg-blue-50 hover:bg-blue-100' 
                      : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                      ${!notification.isRead ? 'bg-blue-100' : 'bg-gray-100'}
                    `}>
                      <FontAwesomeIcon 
                        icon={getIconComponent(icon)} 
                        className={`w-4 h-4 ${!notification.isRead ? colorClass : 'text-gray-500'}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`
                        text-sm leading-5
                        ${!notification.isRead ? 'text-gray-900 font-medium' : 'text-gray-700'}
                      `}>
                        {message}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{timeAgo}</span>
                        {isRecent && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Read Status */}
                    {!notification.isRead && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
