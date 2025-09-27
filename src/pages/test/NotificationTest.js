import React, { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatNotificationMessage, formatTimeAgo } from '../../utils/notificationUtils';

const NotificationTest = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    isConnected,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  } = useNotifications();

  const [testMessage, setTestMessage] = useState('');

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notification System Test</h1>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={isConnected ? 'text-green-700' : 'text-red-700'}>
            {isConnected ? 'Connected to WebSocket' : 'Disconnected from WebSocket'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Notifications</h3>
          <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="font-semibold text-red-800">Unread</h3>
          <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800">Read</h3>
          <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Notifications'}
        </button>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Notifications List */}
      <div className="border rounded-lg">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading notifications...</p>
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No notifications found</p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="divide-y">
            {notifications.map((notification) => {
              const message = formatNotificationMessage(notification);
              const timeAgo = formatTimeAgo(notification.createdAt);

              return (
                <div
                  key={notification._id}
                  className={`p-4 ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`${!notification.isRead ? 'font-semibold' : ''}`}>
                        {message}
                      </p>
                      <div className="mt-1 text-sm text-gray-500">
                        <span>{timeAgo}</span>
                        {!notification.isRead && (
                          <span className="ml-2 text-blue-600 font-medium">• Unread</span>
                        )}
                      </div>
                      
                      {/* Debug Info */}
                      <details className="mt-2">
                        <summary className="text-xs text-gray-400 cursor-pointer">Debug Info</summary>
                        <pre className="mt-1 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(notification, null, 2)}
                        </pre>
                      </details>
                    </div>
                    
                    <div className="ml-4 flex items-center gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Mark as Read
                        </button>
                      )}
                      <div className={`w-2 h-2 rounded-full ${!notification.isRead ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* WebSocket Debug */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">WebSocket Debug</h3>
        <div className="text-sm text-gray-600">
          <p>Check browser console for WebSocket connection logs</p>
          <p>Create a new project or task to test real-time notifications</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationTest;
