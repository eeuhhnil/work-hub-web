import { apiRequest } from "~/config/api";
import API_CONFIG from "~/config/api";

export const createProject = async (spaceId, name, description = "") => {
    try {
        const data = await apiRequest(API_CONFIG.ENDPOINTS.PROJECTS.BASE, {
            method: "POST",
            body: JSON.stringify({
                space: spaceId,
                name: name,
                description: description,
            }),
        });

        return data;
    } catch (error) {
        console.error("Error creating project:", error.message);
        throw error;
    }
};

// Create project in specific space (no need to pass space in body)
export const createProjectInSpace = async (spaceId, name, description = "") => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.PROJECTS.BASE}/space/${spaceId}`, {
            method: "POST",
            body: JSON.stringify({
                name: name,
                description: description,
            }),
        });

        return data;
    } catch (error) {
        console.error("Error creating project in space:", error.message);
        throw error;
    }
};

export const getProjects = async () => {
    try {
        // Sử dụng endpoint user-projects để chỉ lấy projects mà user có quyền truy cập
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.PROJECTS.BASE}/user-projects`, {
            method: "GET",
        });

        return data.data; // ✅ Trả về danh sách project của user
    } catch (error) {
        console.error("Error fetching user projects:", error.message);
        throw error;
    }
};

// ✅ Lấy tất cả projects (với pagination) - chỉ projects mà user có quyền truy cập
export const getAllProjects = async (page = 1, limit = 10, search = "") => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search) {
            params.append('search', search);
        }

        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.PROJECTS.BASE}?${params}`, {
            method: "GET",
        });

        return data; // ✅ Trả về object với data và meta
    } catch (error) {
        console.error("Error fetching all projects:", error.message);
        throw error;
    }
};

// ✅ Lấy projects theo spaceId - chỉ projects mà user có quyền truy cập
export const getProjectsBySpace = async (spaceId) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.SPACES.LIST}/${spaceId}/projects`, {
            method: "GET",
        });

        return data.data || []; // ✅ Trả về danh sách project trong space mà user có quyền truy cập
    } catch (error) {
        console.error("Error fetching projects by space:", error.message);
        throw error;
    }
};

// ✅ Lấy projects theo spaceId với member count - chỉ projects mà user có quyền truy cập
export const getProjectsBySpaceWithMemberCount = async (spaceId) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.SPACES.LIST}/${spaceId}/projects-with-member-count`, {
            method: "GET",
        });

        return data.data || []; // ✅ Trả về danh sách project với member count
    } catch (error) {
        console.error("Error fetching projects by space with member count:", error.message);
        throw error;
    }
};

// ✅ Lấy phần trăm hoàn thành của một project cụ thể
export const getProjectProgress = async (projectId) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.PROJECTS.BASE}/${projectId}/progress`, {
            method: "GET",
        });

        return data; // Trả về { projectName, progress }
    } catch (error) {
        console.error("Error fetching project progress:", error.message);
        throw error;
    }
};

// ✅ Lấy phần trăm hoàn thành của tất cả project user thuộc về
export const getUserProjectsProgress = async () => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.PROJECTS.BASE}/with-progress`, {
            method: "GET",
        });

        return data.data || []; // Trả về array của projects với progress thực
    } catch (error) {
        console.error("Error fetching user projects progress:", error.message);
        throw error;
    }
};
