import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Setting() {
  const { projectId } = useParams();
  const [project, setProject] = useState({
    name: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:3002/projects/${projectId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch project");

        setProject({
          name: data.data.name,
          description: data.data.description || "",
        });
      } catch (error) {
        setMessage(error.message);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleUpdateProject = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:3002/projects/${projectId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: project.name,
          description: project.description,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update project");

      setMessage("Project updated successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
      <div className="p-4">
        <div className="h-[70px] flex flex-col border-b">
          <div className="font-bold text-xl">Settings</div>
          <div className="text-sm text-muted-foreground">Settings and options for your project.</div>
        </div>
        <div className="border border-color flex flex-row px-1.5 gap-1">
          <div className="py-2.5 px-2 flex flex-row items-center gap-2 border-b-primary cursor-pointer box-border hover:border-b-2 hover:-mb-[2px] border-b-2 -mb-[2px] text-primary">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-settings w-4 h-4"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="text-sm font-semibold">General</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              <div className="w-[300px]">
                <p className="text-sm font-bold">Project name</p>
                <p className="text-sm text-muted-foreground">Can view and edit project information.</p>
              </div>
              <div className="flex items-center w-full">
                <input
                    name="name"
                    value={project.name}
                    onChange={handleChange}
                    className="flex h-9 w-full rounded-md border border-color px-3 py-2 text-sm background-primary uppercase"
                />
              </div>
              <div className="w-[300px]">
                <p className="text-sm font-bold">Project description</p>
                <p className="text-sm text-muted-foreground">Can view and edit project information.</p>
              </div>
              <div className="flex items-center w-full">
                <input
                    name="description"
                    value={project.description}
                    onChange={handleChange}
                    className="flex h-9 w-full rounded-md border border-color px-3 py-2 text-sm background-primary uppercase"
                />
              </div>
            </div>
          </div>
          <button
              onClick={handleUpdateProject}
              className="border border-color bg-white text-primary-foreground px-4 py-2 rounded-md w-[150px]"
          >
            Update Project
          </button>
          {message && <p className="text-sm text-green-500">{message}</p>}
        </div>
      </div>
  );
}

export default Setting;
