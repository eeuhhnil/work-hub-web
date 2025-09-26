import { apiRequest } from "~/config/api";
import API_CONFIG from "~/config/api";

export const fetchDashboardAnalytics = async (spaceId, projectId) => {
    try {
        const params = new URLSearchParams();
        if (spaceId) params.append('spaceId', spaceId);
        if (projectId) params.append('projectId', projectId);

        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.ANALYTICS.DASHBOARD}?${params.toString()}`, {
            method: "GET",
        });
        return data.data || {};
    } catch (error) {
        console.error("Error fetching dashboard analytics:", error.message);
        throw error;
    }
};

export const fetchTaskAnalytics = async (spaceId, projectId) => {
    try {
        const params = new URLSearchParams();
        if (spaceId) params.append('spaceId', spaceId);
        if (projectId) params.append('projectId', projectId);

        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.ANALYTICS.TASKS}?${params.toString()}`, {
            method: "GET",
        });
        return data.data || {};
    } catch (error) {
        console.error("Error fetching task analytics:", error.message);
        throw error;
    }
};

export const fetchProjectAnalytics = async (spaceId) => {
    try {
        const params = new URLSearchParams();
        if (spaceId) params.append('spaceId', spaceId);

        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.ANALYTICS.PROJECTS}?${params.toString()}`, {
            method: "GET",
        });
        return data.data || {};
    } catch (error) {
        console.error("Error fetching project analytics:", error.message);
        throw error;
    }
};

export const fetchPerformanceMetrics = async (spaceId, period = '30d') => {
    try {
        const params = new URLSearchParams();
        if (spaceId) params.append('spaceId', spaceId);
        params.append('period', period);

        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.ANALYTICS.PERFORMANCE}?${params.toString()}`, {
            method: "GET",
        });
        return data.data || {};
    } catch (error) {
        console.error("Error fetching performance metrics:", error.message);
        throw error;
    }
};
