import { apiRequest } from "~/config/api";
import API_CONFIG from "~/config/api";

export const getUserProfile = async () => {
    try {
        const data = await apiRequest(API_CONFIG.ENDPOINTS.USERS.PROFILE, {
            method: "GET",
        });
        return data.data;
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
};

export const getUserIdByEmail = async (email) => {
    try {
        const data = await apiRequest(`${API_CONFIG.ENDPOINTS.USERS.FIND}?email=${email}`, {
            method: "GET",
        });

        if (!data.data || !data.data._id) {
            throw new Error("User not found.");
        }

        return data.data._id;
    } catch (error) {
        console.error("Error getting user by email:", error);
        throw error;
    }
};
