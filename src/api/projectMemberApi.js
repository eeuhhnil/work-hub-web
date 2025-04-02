const BASE_URL = "http://localhost:3000";
const getToken = () => localStorage.getItem("access_token");


export const fetchProjectMembers = async (projectId) => {
    try {
        const response = await fetch(`${BASE_URL}/project?project=${projectId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch project members.");

        return data.data;
    } catch (error) {
        console.error("Error fetching project members:", error);
        throw error;
    }
};


// 🔥 API mời thành viên vào project
export const inviteMemberToProject = async (projectId, userId) => {
    try {
        const response = await fetch(`${BASE_URL}/project`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ project: projectId, user: userId }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to add member to project.");

        return data.message; // ✅ Trả về thông báo thành công
    } catch (error) {
        console.error("Error adding member to project:", error);
        throw error;
    }
};
