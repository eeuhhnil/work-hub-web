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

    // Kiểm tra token có hợp lệ không (thêm validation)
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = tokenPayload.exp * 1000 < Date.now();
      
      if (isExpired) {
        console.warn('Token expired, waiting for refresh...');
        // Đợi token refresh và retry
        setTimeout(() => this.connect(), 1000);
        return;
      }
    } catch (e) {
      console.warn('Invalid token format');
      return;
    }

    // Don't create new connection if already connecting/connected
    if (this.socket && (this.socket.connected || this.socket.connecting)) {
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
        timeout: 10000, // Reduced timeout for faster connection
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
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Notify listeners ngay lập tức
      this.notifyListeners('connect', {
        socketId: this.socket.id,
        connected: true
      });

      // Join user room
      this.socket.emit('join', {});
    });

    // Server confirmed connection - đây là event quan trọng
    this.socket.on('connected', (data) => {
      // Đảm bảo connection status được set
      this.isConnected = true;
      this.notifyListeners('connect', {
        confirmed: true,
        data
      });
    });

    // User joined room successfully
    this.socket.on('joined', (data) => {
      // Final confirmation - connection hoàn toàn thành công
      this.isConnected = true;
      this.notifyListeners('connect', {
        joined: true,
        data
      });
    });

    // Handle notifications
    this.socket.on('notification', (notification) => {
      // Immediately notify listeners
      this.notifyListeners('notification', notification);
    });

    // Handle unauthorized
    this.socket.on('unauthorized', (error) => {
      console.error('❌ WebSocket unauthorized:', error);
      this.disconnect();
      this.notifyListeners('unauthorized', error);
      
      // Retry sau 2 giây với token mới (có thể đã được refresh)
      setTimeout(() => {
        const newToken = localStorage.getItem('access_token');
        if (newToken) {
          this.connect();
        }
      }, 2000);
    });

    // Handle disconnect
    this.socket.on('disconnect', (reason) => {
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
    return connected;
  }

  // Get connection status with more details
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      hasSocket: !!this.socket,
      socketConnected: this.socket ? this.socket.connected : false,
      socketId: this.socket ? this.socket.id : null,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  getSocketId() {
    return this.socket ? this.socket.id : null;
  }

  // Force connection status update
  forceUpdateConnectionStatus() {
    const connected = this.isSocketConnected();
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
