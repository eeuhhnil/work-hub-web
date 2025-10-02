import { apiRequest } from "~/config/api";
import API_CONFIG from "~/config/api";

export const fetchProjectMembers = async (projectId) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.PROJECTS.MEMBERS}?project=${projectId}`, {
            method: "GET",
        });

        // API có thể trả về pagination object với docs array
        return data.data.docs || data.data || [];
    } catch (error) {
        console.error("Error fetching project members:", error);
        throw error;
    }
};


// 🔥 API mời thành viên vào project
export const inviteMemberToProject = async (projectId, email) => {
    try {
        const data = await apiRequest(API_CONFIG.ENDPOINTS.PROJECTS.MEMBERS, {
            method: "POST",
            body: JSON.stringify({ projectId, email }),
        });

        return data.message; // ✅ Trả về thông báo thành công
    } catch (error) {
        console.error("Error adding member to project:", error);
        throw error;
    }
};

// ✅ Remove member from project
export const removeMemberFromProject = async (projectMemberId) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.PROJECTS.MEMBERS}/${projectMemberId}`, {
            method: "DELETE",
        });

        return data.message; // ✅ Trả về thông báo thành công
    } catch (error) {
        console.error("Error removing member from project:", error);
        throw error;
    }
};
