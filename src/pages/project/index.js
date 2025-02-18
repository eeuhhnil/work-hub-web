import * as Dialog from "@radix-ui/react-dialog";
import React, { useState } from "react";
import ProjectCard from "~/components/ProjectCard";

function Project() {
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState(() => {
    const storageProjects = JSON.parse(localStorage.getItem("projects")) || [];
    console.log(storageProjects);
    return storageProjects;
  });
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  console.log(projects);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim() === "") {
      setMessage("Space name cannot be empty");
      return;
    }

    const newProject = { id: Date.now(), name: projectName, description: description, initial: projectName.trim().charAt(0).toUpperCase() };

    setProjects((prev) => {
      const newProjects = [...prev, newProject];
      const jsonProjects = JSON.stringify(newProjects);
      localStorage.setItem("projects", jsonProjects);
      return newProjects;
    });
    console.log("New Project:", newProject);
  };
  const handleInputProjectName = (e) => {
    setProjectName(e.target.value);
  };
  const handleInputDescription = (e) => {
    setDescription(e.target.value);
  };
  return (
    <div>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-row justify-between px-4 pt-4">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
            <p className="text-muted-foreground">Join projects on the system or create your own group</p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <div className="relative border border-color rounded-md flex items-center w-full">
              <span className="absolute left-2 opacity-80">
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
                  className="lucide lucide-search w-4 h-4 text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </span>
              <input className="flex rounded-md background-primary background-primary px-7 py-2 text-sm" placeholder="Search project" />
            </div>

            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="inline-flex items-center bg-primary text-primary-foreground justify-center rounded-md text-sm px-4 py-2">
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
                    className="lucide lucide-plus w-4 h-4 mr-1"
                  >
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                  Create
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="w-full max-w-lg dialog-content fixed border border-color rounded-md shadow-lg p-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Dialog.Title className="mb-2 text-lg font-semibold">Create New Project</Dialog.Title>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                      <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium">Name</label>
                        <input
                          type="text"
                          className="background-primary w-full mt-1 px-3 py-2 border border-color rounded-md focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
                          placeholder="Enter project name"
                          value={projectName}
                          onChange={handleInputProjectName}
                        />
                        {message && <div className=" text-red-500">{message}</div>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium">Description</label>
                        <input
                          type="text"
                          className="background-primary w-full mt-1 px-3 py-2 border border-color rounded-md focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
                          placeholder="Enter a description"
                          value={description}
                          onChange={handleInputDescription}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <Dialog.Close asChild>
                        <button type="button" className="border border-color bg-white text-primary-foreground  px-4 py-2 rounded-md">
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button type="submit" className="border border-color bg-white text-primary-foreground  px-4 py-2 rounded-md">
                        Create
                      </button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
        <div>
          {projects.length === 0 ? (
            <p className="text-white text-[32px]">No project created</p>
          ) : (
            projects.map((project, index) => (
              <div key={index} className="border border-color rounded-md">
                <ProjectCard project={project} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Project;
