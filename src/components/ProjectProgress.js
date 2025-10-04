import React, { useState, useEffect } from 'react';
import { getUserProjectsProgress } from '~/api/projectApi';

function ProjectProgress() {
  const [projectsProgress, setProjectsProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectsProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getUserProjectsProgress();
        setProjectsProgress(data || []);
      } catch (error) {
        console.error("Error fetching projects progress:", error);
        setError(error.message || "Failed to load projects progress");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsProgress();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Project Progress
      </h2>
      
      {projectsProgress.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No projects found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projectsProgress.map((project, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {project.name}
                </h3>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {project.progress}
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    parseInt(project.progress) >= 80
                      ? 'bg-green-500'
                      : parseInt(project.progress) >= 50
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${project.progress}` }}
                ></div>
              </div>

              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {parseInt(project.progress) === 100
                  ? 'Completed'
                  : parseInt(project.progress) === 0
                  ? 'Not started'
                  : 'In progress'
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectProgress;
