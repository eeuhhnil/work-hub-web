export const createProject = async (spaceId, name, description = "") => {
    try {
        const token = localStorage.getItem("access_token");

        const response = await fetch("http://localhost:3000/projects", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                space: spaceId, // ✅ Lấy spaceId từ useParams()
                name: name,
                description: description,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to create project");
        }

        return data;
    } catch (error) {
        console.error("Error creating project:", error.message);
        throw error;
    }
};

export const getProjects = async () => {
    try {
        const token = localStorage.getItem("access_token");

        const response = await fetch("http://localhost:3000/projects", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch projects");
        }

        return data.data; // ✅ Trả về danh sách project
    } catch (error) {
        console.error("Error fetching projects:", error.message);
        throw error;
    }
};
