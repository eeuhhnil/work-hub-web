import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import websocketService from '../../services/websocket';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { unreadCount, isConnected } = useNotifications();

  // Debug connection status
  useEffect(() => {
    console.log('🔔 NotificationBell - isConnected:', isConnected);
    console.log('🔔 WebSocket service status:', websocketService.getConnectionStatus());
  }, [isConnected]);

  // Thêm button để force check connection (temporary debug)
  const handleDebugConnection = () => {
    const status = websocketService.getConnectionStatus();
    console.log('🔍 Debug connection status:', status);
    websocketService.forceUpdateConnectionStatus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      // Calculate position when opening dropdown
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8, // 8px gap
        right: window.innerWidth - rect.right
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        onDoubleClick={handleDebugConnection} // Double click để debug
        className={`
          relative p-2 rounded-lg transition-colors duration-200
          ${isConnected ? 'text-green-600' : 'text-red-600'}
        `}
        title={isConnected ? 'Notifications' : 'Disconnected from notifications'}
      >
        <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}></span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="fixed z-[99999] max-w-sm w-80"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
        >
          <NotificationDropdown onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
