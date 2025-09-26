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
        const response = await fetch(`${BASE_URL}/project`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ projectId, email }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to add member to project.");

        return data.message; // ✅ Trả về thông báo thành công
    } catch (error) {
        console.error("Error adding member to project:", error);
        throw error;
    }
};

// ✅ Remove member from project
export const removeMemberFromProject = async (projectMemberId) => {
    try {
        const response = await fetch(`${BASE_URL}/project/${projectMemberId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to remove member from project.");

        return data.message; // ✅ Trả về thông báo thành công
    } catch (error) {
        console.error("Error removing member from project:", error);
        throw error;
    }
};
