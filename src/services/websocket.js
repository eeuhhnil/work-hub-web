import { io } from 'socket.io-client';
import { API_CONFIG } from '~/config/api';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
  }

  connect() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('No access token found, cannot connect to WebSocket');
      return;
    }

    try {
      this.socket = io(API_CONFIG.BASE_URL, {
        transports: ['websocket', 'polling'],
        auth: {
          token: token
        },
        extraHeaders: {
          Authorization: `Bearer ${token}`
        },
        query: {
          token: token
        },
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        timeout: 20000,
      });

      this.setupEventListeners();
      
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  setupEventListeners() {
    if (!this.socket) return;

    // Connection successful
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Notify listeners about connection
      this.notifyListeners('connect', { socketId: this.socket.id });

      // Join user room for notifications
      this.socket.emit('join', {});
    });

    // Connection confirmed by server
    this.socket.on('connected', (data) => {
      console.log('✅ Server confirmed connection:', data);
    });

    // User joined room
    this.socket.on('joined', (data) => {
      console.log('✅ Joined notification room:', data);
    });

    // Handle notifications
    this.socket.on('notification', (notification) => {
      console.log('🔔 New notification received via WebSocket:', {
        id: notification._id,
        type: notification.type,
        actorName: notification.actorName,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        timestamp: new Date().toISOString()
      });

      // Immediately notify listeners
      this.notifyListeners('notification', notification);

      // Log successful notification delivery
      console.log('✅ Notification delivered to listeners');
    });

    // Handle unauthorized
    this.socket.on('unauthorized', (error) => {
      console.error('❌ WebSocket unauthorized:', error);
      this.disconnect();
      this.notifyListeners('unauthorized', error);
    });

    // Handle disconnect
    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.isConnected = false;
      this.notifyListeners('disconnect', { reason });

      // Auto-reconnect if not intentional disconnect
      if (reason !== 'io client disconnect') {
        this.handleReconnect();
      }
    });

    // Handle connection error
    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      this.notifyListeners('connect_error', error);
      this.handleReconnect();
    });

    // Handle reconnection
    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 WebSocket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyListeners('connect', { reconnected: true, attempts: attemptNumber });
      this.notifyListeners('reconnect', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ WebSocket reconnection error:', error);
      this.notifyListeners('reconnect_error', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ WebSocket reconnection failed');
      this.notifyListeners('reconnect_failed');
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      const token = localStorage.getItem('access_token');
      if (token && this.socket) {
        this.socket.auth = { token };
        this.socket.connect();
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Utility methods
  isSocketConnected() {
    const connected = this.isConnected && this.socket && this.socket.connected;
    console.log('🔍 Connection check:', {
      isConnected: this.isConnected,
      hasSocket: !!this.socket,
      socketConnected: this.socket ? this.socket.connected : false,
      result: connected
    });
    return connected;
  }

  getSocketId() {
    return this.socket ? this.socket.id : null;
  }

  // Force connection status update
  updateConnectionStatus() {
    const connected = this.isSocketConnected();
    console.log('🔄 Forcing connection status update:', connected);
    if (connected) {
      this.notifyListeners('connect', { connected, forced: true });
    } else {
      this.notifyListeners('disconnect', { connected, forced: true });
    }
    return connected;
  }

  // Send test notification to check connection
  sendTestNotification() {
    if (this.socket && this.isConnected) {
      console.log('📤 Sending test notification...');
      this.socket.emit('test-notification', {
        message: 'Test notification from frontend',
        timestamp: new Date().toISOString()
      });
    } else {
      console.warn('⚠️ Cannot send test notification - socket not connected');
    }
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
