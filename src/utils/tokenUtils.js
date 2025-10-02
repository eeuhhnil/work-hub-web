// JWT Token utilities
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Decode JWT token (simple base64 decode for payload)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired (with 30 second buffer)
    return payload.exp < (currentTime + 30);
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Basic JWT structure check
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Try to decode payload
    const payload = JSON.parse(atob(parts[1]));
    return payload && payload.exp && payload.sub;
  } catch (error) {
    console.error('Invalid token format:', error);
    return false;
  }
};

export const getTokenPayload = (token) => {
  // If no token provided, try to get from localStorage
  if (!token) {
    token = localStorage.getItem('access_token');
  }

  if (!token) return null;

  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error getting token payload:', error);
    return null;
  }
};
