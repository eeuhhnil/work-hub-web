import { apiRequest, API_CONFIG } from '~/config/api';

// Get complete BOM dashboard data
export const fetchBOMDashboard = async () => {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.BOM.DASHBOARD, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching BOM dashboard:', error);
    throw error;
  }
};

// Get project status overview
export const fetchProjectOverview = async () => {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.BOM.OVERVIEW, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching project overview:', error);
    throw error;
  }
};

// Get system-wide progress
export const fetchSystemProgress = async () => {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.BOM.SYSTEM_PROGRESS, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching system progress:', error);
    throw error;
  }
};

// Get space performance metrics
export const fetchSpacePerformance = async () => {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.BOM.SPACE_PERFORMANCE, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching space performance:', error);
    throw error;
  }
};

// Get PM performance metrics
export const fetchPMPerformance = async () => {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.BOM.PM_PERFORMANCE, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching PM performance:', error);
    throw error;
  }
};

// Get risk projects
export const fetchRiskProjects = async () => {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.BOM.RISK_PROJECTS, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching risk projects:', error);
    throw error;
  }
};

// Get KPI metrics
export const fetchKPIMetrics = async () => {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.BOM.KPI_METRICS, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching KPI metrics:', error);
    throw error;
  }
};

// Get weekly progress
export const fetchWeeklyProgress = async () => {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.BOM.WEEKLY_PROGRESS, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly progress:', error);
    throw error;
  }
};
