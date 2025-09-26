// src/services/taskService.js
import { apiRequest } from "~/config/api";
import API_CONFIG from "~/config/api";

// Get tasks
export const fetchTasks = async (spaceId, projectId) => {
    try {
        const params = new URLSearchParams();
        if (spaceId) params.append('space', spaceId);
        if (projectId) params.append('project', projectId);

        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.TASKS.BASE}?${params.toString()}`, {
            method: "GET",
        });
        // API trả về pagination object với docs array
        return data.data.docs || data.data || [];
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

// Get task detail
export const fetchTaskById = async (taskId) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.TASKS.BASE}/${taskId}`, {
            method: "GET",
        });
        return data;
    } catch (error) {
        console.error("Error fetching task by ID:", error);
        throw error;
    }
};

// Create task
export const createTask = async (task) => {
    try {
        // Ensure priority has a default value
        const taskData = {
            ...task,
            priority: task.priority || 'medium',
        };

        const data = await apiRequest(API_CONFIG.ENDPOINTS.TASKS.BASE, {
            method: "POST",
            body: JSON.stringify(taskData),
        });
        return data;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};

// Create task in specific space and project (no need to pass space/project in body)
export const createTaskInProject = async (spaceId, projectId, task) => {
    try {
        // Ensure priority has a default value
        const taskData = {
            ...task,
            priority: task.priority || 'medium',
        };

        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.TASKS.BASE}/space/${spaceId}/project/${projectId}`, {
            method: "POST",
            body: JSON.stringify(taskData),
        });
        return data;
    } catch (error) {
        console.error("Error creating task in project:", error);
        throw error;
    }
};

// Create task with file upload in specific space and project
export const createTaskWithFiles = async (spaceId, projectId, taskData, files) => {
    try {
        const formData = new FormData();

        // Add task data to form
        Object.keys(taskData).forEach(key => {
            if (taskData[key] !== null && taskData[key] !== undefined && taskData[key] !== '') {
                formData.append(key, taskData[key]);
            }
        });

        // Add files to form
        if (files && files.length > 0) {
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });
        }

        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_CONFIG.BASE_URL}/tasks/space/${spaceId}/project/${projectId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                // Don't set Content-Type for FormData, browser will set it automatically with boundary
            },
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to create task with files");
        }

        return data;
    } catch (error) {
        console.error("Error creating task with files:", error);
        throw error;
    }
};

// Upload files separately
export const uploadTaskFiles = async (files) => {
    try {
        const formData = new FormData();

        if (files && files.length > 0) {
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });
        }

        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_CONFIG.BASE_URL}/tasks/upload-files`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to upload files");
        }

        return data;
    } catch (error) {
        console.error("Error uploading files:", error);
        throw error;
    }
};

// Update task
export const updateTask = async (taskId, task) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.TASKS.BASE}/${taskId}`, {
            method: "PUT",
            body: JSON.stringify(task),
        });
        return data;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

// Delete task
export const deleteTask = async (taskId) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.TASKS.BASE}/${taskId}`, {
            method: "DELETE",
        });
        return data;
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
};

// Get tasks for calendar view with permissions
export const fetchTasksForCalendar = async (projectId) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.TASKS.BASE}/calendar/${projectId}`, {
            method: "GET",
        });
        return data.data || [];
    } catch (error) {
        console.error("Error fetching tasks for calendar:", error);
        throw error;
    }
};

// Get user task statistics
export const fetchUserTaskStats = async () => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.TASKS.BASE}/stats`, {
            method: "GET",
        });
        return data.data || data;
    } catch (error) {
        console.error("Error fetching user task stats:", error);
        throw error;
    }
};

// Get user task statistics by space
export const fetchUserTaskStatsBySpace = async (spaceId) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.TASKS.BASE}/stats/space/${spaceId}`, {
            method: "GET",
        });
        return data.data || data;
    } catch (error) {
        console.error("Error fetching user task stats by space:", error);
        throw error;
    }
};
