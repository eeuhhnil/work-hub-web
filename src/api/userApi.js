const API_BASE_URL = "http://localhost:3002";

export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to get user profile.");
        }

        return data.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ✅ Tìm userId theo email
export const getUserIdByEmail = async (email) => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_BASE_URL}/users/find?email=${email}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (!response.ok || !data.data || !data.data._id) {
            throw new Error("User not found.");
        }

        return data.data._id;
    } catch (error) {
        throw new Error(error.message);
    }
};
