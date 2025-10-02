// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      GOOGLE: '/auth/google',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    // User endpoints
    USERS: {
      PROFILE: '/users/profile',
      FIND: '/users/find',
      UPDATE: '/users',
    },
    // Space endpoints
    SPACES: {
      BASE: '/spaces',
      LIST: '/spaces',
      CREATE: '/spaces',
      MEMBERS: '/space-members',
    },
    // Project endpoints
    PROJECTS: {
      BASE: '/projects',
      USER_PROJECTS: '/projects/user-projects',
      MEMBERS: '/project',
    },
    // Task endpoints
    TASKS: {
      BASE: '/tasks',
      UPLOAD_FILES: '/tasks/upload-files',
      CALENDAR: '/tasks/calendar',
      STATS: '/tasks/stats',
      PENDING_APPROVAL: '/tasks/pending-approval',
      APPROVE: '/tasks/:taskId/approve',
      REJECT: '/tasks/:taskId/reject',
    },

    // Analytics endpoints
    ANALYTICS: {
      DASHBOARD: '/analytics/dashboard',
      TASKS: '/analytics/tasks',
      PROJECTS: '/analytics/projects',
      PERFORMANCE: '/analytics/performance',
    },

    // Notification endpoints
    NOTIFICATIONS: {
      BASE: '/notification',
      UNREAD: '/notification/unread',
      MARK_READ: '/notification',
      MARK_ALL_READ: '/notification/mark-all-read',
    },

    // BOM (Board of Management) endpoints
    BOM: {
      DASHBOARD: '/bom/dashboard',
      OVERVIEW: '/bom/overview',
      SYSTEM_PROGRESS: '/bom/system-progress',
      SPACE_PERFORMANCE: '/bom/space-performance',
      PM_PERFORMANCE: '/bom/pm-performance',
      RISK_PROJECTS: '/bom/risk-projects',
      KPI_METRICS: '/bom/kpi-metrics',
      WEEKLY_PROGRESS: '/bom/weekly-progress',
    },

  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API request wrapper with error handling and token refresh
export const apiRequest = async (endpoint, options = {}) => {
  let url = buildApiUrl(endpoint);

  // Handle query parameters
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.keys(options.params).forEach(key => {
      if (options.params[key] !== null && options.params[key] !== undefined) {
        searchParams.append(key, options.params[key]);
      }
    });
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
  }

  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  // Remove params from config to avoid sending it in the request body
  delete config.params;

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // If token expired, try to refresh and retry
    if (response.status === 401 && data.message?.includes('expired')) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry with new token
        const newConfig = {
          ...config,
          headers: getAuthHeaders(),
        };
        const retryResponse = await fetch(url, newConfig);
        const retryData = await retryResponse.json();

        if (!retryResponse.ok) {
          throw new Error(retryData.message || `HTTP error! status: ${retryResponse.status}`);
        }

        return retryData;
      } else {
        // Refresh failed, throw 401 error instead of redirecting
        throw new Error(`401 Unauthorized: ${data.message || 'Session expired'}`);
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Helper function to refresh access token
const refreshAccessToken = async () => {
  try {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      return false;
    }

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token }),
    });

    const data = await response.json();

    if (response.ok && data.data?.access_token) {
      localStorage.setItem('access_token', data.data.access_token);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

export { API_CONFIG };
export default API_CONFIG;
