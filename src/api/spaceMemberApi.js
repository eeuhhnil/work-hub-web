import { apiRequest } from "~/config/api";
import API_CONFIG from "~/config/api";

export const getSpaceMembers = async (spaceId, token) => {
    try {
        // Note: This function accepts token as parameter for backward compatibility
        // but apiRequest will use token from localStorage
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.SPACES.MEMBERS}/space/${spaceId}`, {
            method: "GET",
        });

        return data.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const addMemberToSpace = async (spaceId, userId, token) => {
    try {
        // Note: This function accepts token as parameter for backward compatibility
        // but apiRequest will use token from localStorage
        const data = await apiRequest(API_CONFIG.ENDPOINTS.SPACES.MEMBERS, {
            method: "POST",
            body: JSON.stringify({ spaceId, userId }),
        });

        return data.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};
