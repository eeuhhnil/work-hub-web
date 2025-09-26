import { apiRequest } from "~/config/api";
import API_CONFIG from "~/config/api";

export const fetchSpaceMembers = async (spaceId) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.SPACES.MEMBERS}/space/${spaceId}`, {
            method: "GET",
        });
        // API trả về pagination object với docs array
        return data.data.docs || [];
    } catch (error) {
        console.error("Error fetching space members:", error.message);
        throw error;
    }
};

export const inviteMemberToSpace = async (spaceId, email) => {
    try {
        const data = await apiRequest(API_CONFIG.ENDPOINTS.SPACES.MEMBERS, {
            method: "POST",
            body: JSON.stringify({ spaceId, email }),
        });
        return data;
    } catch (error) {
        console.error("Error inviting member to space:", error.message);
        throw error;
    }
};

// ✅ Remove member from space
export const removeMemberFromSpace = async (spaceMemberId) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.SPACES.MEMBERS}/${spaceMemberId}`, {
            method: "DELETE",
        });
        return data;
    } catch (error) {
        console.error("Error removing member from space:", error.message);
        throw error;
    }
};

// ✅ Fetch projects with member count for a space
export const fetchSpaceProjectsWithMemberCount = async (spaceId) => {
    try {
        console.log("API: Fetching projects for spaceId:", spaceId);
        const endpoint = `${API_CONFIG.ENDPOINTS.SPACES.BASE}/${spaceId}/projects-with-member-count`;
        console.log("API: Full endpoint:", endpoint);

        const data = await apiRequest(endpoint, {
            method: "GET",
        });

        console.log("API: Raw response:", data);
        console.log("API: Response data field:", data.data);
        console.log("API: Response statusCode:", data.statusCode);
        console.log("API: Response message:", data.message);

        const result = data.data || [];
        console.log("API: Returning result:", result);
        console.log("API: Result is array:", Array.isArray(result));
        console.log("API: Result length:", result.length);

        return result;
    } catch (error) {
        console.error("Error fetching space projects with member count:", error.message);
        console.error("Error details:", error);
        throw error;
    }
};
