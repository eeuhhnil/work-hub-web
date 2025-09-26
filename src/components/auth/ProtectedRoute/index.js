import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isTokenExpired, isTokenValid } from '~/utils/tokenUtils';
import { API_CONFIG, buildApiUrl } from '~/config/api';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      // Nếu không có token nào, redirect đến login
      if (!accessToken && !refreshToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Nếu access token hợp lệ và chưa hết hạn
      if (accessToken && isTokenValid(accessToken) && !isTokenExpired(accessToken)) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Nếu access token hết hạn nhưng có refresh token, thử refresh
      if (refreshToken && isTokenValid(refreshToken) && !isTokenExpired(refreshToken)) {
        try {
          const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          const data = await response.json();

          if (response.ok && data.data?.access_token) {
            localStorage.setItem('access_token', data.data.access_token);
            setIsAuthenticated(true);
          } else {
            // Refresh failed, clear tokens
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('selectedSpace');
            localStorage.removeItem('user_avatar');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Clear tokens on error
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('selectedSpace');
          localStorage.removeItem('user_avatar');
          setIsAuthenticated(false);
        }
      } else {
        // Cả hai token đều không hợp lệ, clear và redirect
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('selectedSpace');
        localStorage.removeItem('user_avatar');
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  // Hiển thị loading spinner khi đang kiểm tra authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
