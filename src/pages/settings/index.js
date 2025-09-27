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
        const response = await fetch(`http://localhost:3000/projects/${projectId}`, {
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
      const response = await fetch(`http://localhost:3000/projects/${projectId}`, {
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
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-background border-b border-color">
          <div className="px-6 py-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold">Project Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your project configuration and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-background border-b border-color">
          <div className="px-6">
            <div className="max-w-4xl mx-auto">
              <nav className="flex space-x-8">
                <div className="flex items-center gap-2 py-4 border-b-2 border-primary text-primary">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span className="font-medium">General</span>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Success/Error Message */}
            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm font-medium text-green-800">{message}</p>
                </div>
              </div>
            )}

            {/* Project Information Card */}
            <div className="bg-background rounded-xl shadow-sm border border-color">
              <div className="p-6 border-b border-color">
                <h2 className="text-lg font-semibold">Project Information</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your project's basic information and settings
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Project Name */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Project Name
                    </label>
                    <p className="text-sm text-muted-foreground">
                      The name of your project as it appears throughout the application.
                    </p>
                  </div>
                  <input
                      name="name"
                      value={project.name}
                      onChange={handleChange}
                      className="background-primary w-full mt-1 px-3 py-2 border border-color rounded-md focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
                      placeholder="Enter project name..."
                  />
                </div>

                {/* Project Description */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Project Description
                    </label>
                    <p className="text-sm text-muted-foreground">
                      A brief description of what this project is about and its objectives.
                    </p>
                  </div>
                  <textarea
                      name="description"
                      value={project.description}
                      onChange={handleChange}
                      rows="4"
                      className="background-primary w-full mt-1 px-3 py-2 border border-color rounded-md focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
                      placeholder="Describe your project..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-color">
                  <div className="text-sm text-muted-foreground">
                    Changes will be saved immediately after clicking update.
                  </div>
                  <div className="flex gap-3">
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium border border-color bg-background rounded-lg hover:bg-accent transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                        onClick={handleUpdateProject}
                        className="px-6 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-all duration-200"
                    >
                      Update Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Setting;
