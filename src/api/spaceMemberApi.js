const API_BASE_URL = "http://localhost:3002";

export const getSpaceMembers = async (spaceId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/space-members/space/${spaceId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch space members");

        return data.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const addMemberToSpace = async (spaceId, userId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/space-members`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ spaceId, userId }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to add member.");

        return data.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};
