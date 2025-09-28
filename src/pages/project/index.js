import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, useCallback } from "react";
import ProjectCard from "~/components/ProjectCard";
import "./project.css";
import {useParams} from "react-router-dom";
import { getProjects, createProjectInSpace } from "~/api/projectApi";
import { useNotifications } from "~/contexts/NotificationContext";

function Project() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { spaceId } = useParams();
  const { refreshNotificationsWithSocket } = useNotifications();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      // Sử dụng API getProjects để chỉ lấy projects mà user có quyền truy cập
      const projectsData = await getProjects();
      console.log("User projects data:", projectsData);

      // Filter projects theo spaceId nếu có
      const filteredProjects = spaceId
        ? projectsData.filter(project => project.space === spaceId)
        : projectsData;

      setProjects(filteredProjects || []);
      setMessage("");
    } catch (error) {
      console.error("Error fetching user projects:", error);
      setMessage("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [spaceId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setMessage("Project name is required");
      return;
    }

    if (!spaceId) {
      setMessage("Space ID is required");
      return;
    }

    setLoading(true);
    try {
      // Sử dụng API createProjectInSpace
      await createProjectInSpace(spaceId, projectName, description);

      setMessage("Project created successfully!");
      setProjectName("");
      setDescription("");
      setOpen(false);
      fetchProjects();

      // Refresh notifications after project creation
      console.log('🔄 Refreshing notifications after project creation...');
      refreshNotificationsWithSocket();
    } catch (error) {
      console.error("Error creating project:", error);
      setMessage(error.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 animate-gradient"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-32 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-blue-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg animate-pulse-glow">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                      Projects
                    </h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
                  </div>
                </div>

                <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl leading-relaxed">
                  Collaborate, create, and manage your projects with powerful tools designed for modern teams.
                  <span className="text-blue-300 font-semibold"> Build something amazing together.</span>
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    <span className="text-gray-300 font-medium">{projects.length} Active Projects</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                    <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                    <span className="text-gray-300 font-medium">Team Collaboration</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                    <div className="w-3 h-3 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                    <span className="text-gray-300 font-medium">Real-time Updates</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Dialog.Root open={open} onOpenChange={setOpen}>
                  <Dialog.Trigger asChild>
                    <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105 overflow-hidden">
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"></div>

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></div>

                      <div className="relative flex items-center gap-3">
                        <div className="p-1 bg-white/20 rounded-lg">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <span>Create New Project</span>
                        <div className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 9998 }} />
                    <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg rounded-xl shadow-2xl p-0 max-h-[90vh] overflow-hidden" style={{ transform: 'translate(-50%, -50%)', zIndex: 9999, backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                      {/* Modal Header */}
                      <div className="px-6 py-4 border-b" style={{ borderColor: '#333' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <Dialog.Title className="text-xl font-semibold text-white">Create New Project</Dialog.Title>
                            <Dialog.Description className="text-sm text-gray-400 mt-1">
                              Start a new project and invite your team to collaborate
                            </Dialog.Description>
                          </div>
                          <Dialog.Close asChild>
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </Dialog.Close>
                        </div>
                      </div>

                      {/* Modal Content */}
                      <div className="px-6 py-4">
                        {message && (
                          <div className={`mb-4 p-3 rounded-lg ${message.includes('successfully') || message.includes('Created') ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-red-900/20 text-red-400 border border-red-800'}`}>
                            <p className="text-sm">{message}</p>
                          </div>
                        )}

                        <form id="create-project-form" className="space-y-5" onSubmit={handleSubmit}>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Project Name *</label>
                            <input
                                name="projectName"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                type="text"
                                placeholder="Enter project name..."
                                required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                placeholder="Describe your project goals and objectives..."
                                rows="4"
                            />
                          </div>
                        </form>
                      </div>

                      {/* Modal Footer */}
                      <div className="px-6 py-4 border-t" style={{ borderColor: '#333' }}>
                        <div className="flex items-center justify-end gap-3">
                          <Dialog.Close asChild>
                            <button type="button" className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
                              Cancel
                            </button>
                          </Dialog.Close>
                          <button
                              type="submit"
                              form="create-project-form"
                              disabled={loading}
                              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? "Creating..." : "Create Project"}
                          </button>
                        </div>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {projects.length === 0 ? (
            <div className="text-center py-24">
              {/* Animated illustration */}
              <div className="relative mx-auto w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center animate-float">
                  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                {/* Floating particles */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 -right-4 w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
              </div>
              
              <div className="space-y-4 mb-10">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Ready to start building?
                </h3>
                <p className="text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
                  Create your first project and bring your ideas to life. Collaborate with your team, track progress, and achieve your goals together.
                </p>
              </div>

              <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Your First Project
                      <div className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </button>
                </Dialog.Trigger>
              </Dialog.Root>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div key={index} className="group">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Project;
