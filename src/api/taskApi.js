// src/services/taskService.js

const API_URL = "http://localhost:3000";

const getToken = () => localStorage.getItem("access_token");

// Get tasks
export const fetchTasks = async (spaceId, projectId) => {
    const response = await fetch(`${API_URL}/tasks?space=${spaceId}&project=${projectId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
    });
    return await response.json();
};

// Get task detail
export const fetchTaskById = async (taskId) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
    });
    return await response.json();
};

// Create task
export const createTask = async (task) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });
    return await response.json();
};

// Update task
export const updateTask = async (taskId, task) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });
    return await response.json();
};

// Delete task
export const deleteTask = async (taskId) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
    });
    return await response.json();
};
