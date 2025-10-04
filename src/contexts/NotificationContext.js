import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import websocketService from '../services/websocket';
import { apiRequest, API_CONFIG } from '../config/api';
import { deduplicateNotifications, isDuplicateNotification, cleanOldNotifications } from '~/utils/notificationDeduplication';

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  isConnected: false,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  UPDATE_UNREAD_COUNT: 'UPDATE_UNREAD_COUNT',
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ActionTypes.SET_NOTIFICATIONS:
      // Deduplicate and clean notifications
      const cleanedNotifications = cleanOldNotifications(deduplicateNotifications(action.payload));
      const unreadCount = cleanedNotifications.filter(n => !n.isRead).length;
      return {
        ...state,
        notifications: cleanedNotifications,
        unreadCount,
        loading: false,
        error: null,
      };

    case ActionTypes.ADD_NOTIFICATION:
      // Use utility function to check for duplicates
      if (isDuplicateNotification(action.payload, state.notifications)) {
        return state;
      }

      const newNotifications = cleanOldNotifications([action.payload, ...state.notifications]);
      const newUnreadCount = newNotifications.filter(n => !n.isRead).length;
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newUnreadCount,
      };

    case ActionTypes.MARK_AS_READ:
      const updatedNotifications = state.notifications.map(n =>
        n._id === action.payload ? { ...n, isRead: true } : n
      );
      const updatedUnreadCount = updatedNotifications.filter(n => !n.isRead).length;
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedUnreadCount,
      };

    case ActionTypes.MARK_ALL_AS_READ:
      const allReadNotifications = state.notifications.map(n => ({ ...n, isRead: true }));
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0,
      };

    case ActionTypes.SET_CONNECTION_STATUS:
      console.log('🔌 Setting connection status to:', action.payload);
      return { ...state, isConnected: action.payload };

    case ActionTypes.UPDATE_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };

    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (spaceId = null) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      const token = localStorage.getItem('access_token');
      const params = {};
      if (spaceId) {
        params.spaceId = spaceId;
      }

      const response = await apiRequest(API_CONFIG.ENDPOINTS.NOTIFICATIONS.BASE, {
        method: 'GET',
        params,
      });

      dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: response.data || [] });
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ}/${notificationId}/read`, {
        method: 'PATCH',
      });
      dispatch({ type: ActionTypes.MARK_AS_READ, payload: notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await apiRequest(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {
        method: 'PATCH',
      });
      dispatch({ type: ActionTypes.MARK_ALL_AS_READ });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  // WebSocket event handlers
  const handleNewNotification = useCallback((notification) => {

    // Check if this is a real-time notification (has actorName) or pending notification
    const isRealTimeNotification = notification.actorName && notification.actorName !== 'Someone';

    dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification });

    // Show browser notification if permission granted and it's a real-time notification
    if (Notification.permission === 'granted' && isRealTimeNotification) {
      // Import formatNotificationMessage here to avoid circular dependency
      const { formatNotificationMessage } = require('../utils/notificationUtils');
      const message = formatNotificationMessage(notification);

      new Notification('WorkHub Notification', {
        body: message,
        icon: '/favicon.ico',
      });
    }

    // Force UI update by triggering a small delay
    setTimeout(() => {
      console.log('🔄 Forcing notification UI update');
    }, 100);
  }, []);

  const handleConnectionChange = useCallback((data) => {
    const isConnected = data?.connected !== false;
    dispatch({ type: ActionTypes.SET_CONNECTION_STATUS, payload: isConnected });
  }, []);

  const handleUnauthorized = useCallback(() => {
    dispatch({ type: ActionTypes.SET_CONNECTION_STATUS, payload: false });
  }, []);

  // Initialize WebSocket and fetch notifications
  useEffect(() => {
    const initializeWebSocket = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Setup listeners
      websocketService.on('connect', handleConnectionChange);
      websocketService.on('disconnect', (data) => handleConnectionChange({ connected: false, ...data }));
      websocketService.on('notification', handleNewNotification);
      websocketService.on('unauthorized', handleUnauthorized);

      // Connect và fetch
      websocketService.connect();
      await fetchNotifications();
    };

    initializeWebSocket();

    return () => {
      websocketService.off('connect', handleConnectionChange);
      websocketService.off('disconnect', handleConnectionChange);
      websocketService.off('notification', handleNewNotification);
      websocketService.off('unauthorized', handleUnauthorized);
    };
  }, [handleConnectionChange, handleNewNotification, handleUnauthorized, fetchNotifications]);

  // Force refresh notifications (useful after actions)
  const refreshNotifications = useCallback(async (spaceId = null) => {
    console.log('🔄 Force refreshing notifications...', spaceId ? `for space: ${spaceId}` : 'all spaces');
    await fetchNotifications(spaceId);
  }, [fetchNotifications]);

  // Wait for socket connection before proceeding with actions
  const waitForSocketConnection = useCallback((timeout = 3000) => {
    return new Promise((resolve) => {
      if (websocketService.isSocketConnected()) {
        console.log('✅ Socket already connected');
        resolve(true);
        return;
      }

      console.log('⏳ Waiting for socket connection...');
      let attempts = 0;
      const maxAttempts = timeout / 100;

      const checkConnection = () => {
        attempts++;
        if (websocketService.isSocketConnected()) {
          console.log('✅ Socket connected after waiting');
          resolve(true);
        } else if (attempts >= maxAttempts) {
          console.log('⚠️ Socket connection timeout, proceeding anyway');
          resolve(false);
        } else {
          setTimeout(checkConnection, 100);
        }
      };

      checkConnection();
    });
  }, []);

  // Enhanced refresh that ensures socket connection
  const refreshNotificationsWithSocket = useCallback(async (spaceId = null) => {
    console.log('🔄 Enhanced refresh with socket check...');

    // Wait for socket connection first
    await waitForSocketConnection(1000);

    // Only refresh if socket is not connected (to avoid duplicates)
    if (!websocketService.isSocketConnected()) {
      console.log('🔄 Socket not connected, refreshing notifications from API...');
      await refreshNotifications(spaceId);
    } else {
      console.log('✅ Socket connected, relying on real-time notifications');
    }
  }, [refreshNotifications, waitForSocketConnection]);

  // Context value
  const value = {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    refreshNotificationsWithSocket,
    waitForSocketConnection,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
