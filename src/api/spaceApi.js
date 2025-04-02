const API_BASE_URL = "http://localhost:3000";

export const fetchSpaceMembers = async (spaceId) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/space-members/space/${spaceId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch members.");
    return data.data;
};

export const inviteMemberToSpace = async (spaceId, userId) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/space-members`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ spaceId, userId }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add member.");
    }
    return data;
};
