import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchDashboardAnalytics, fetchTaskAnalytics, fetchProjectAnalytics, fetchPerformanceMetrics } from "~/api/analyticsApi";

function Analytics() {
  const { spaceId, projectId } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        
        const [dashboard, tasks, projects, performance] = await Promise.all([
          fetchDashboardAnalytics(spaceId, projectId),
          fetchTaskAnalytics(spaceId, projectId),
          fetchProjectAnalytics(spaceId),
          fetchPerformanceMetrics(spaceId, '30d')
        ]);

        setDashboardData(dashboard);
        setTaskData(tasks);
        setProjectData(projects);
        setPerformanceData(performance);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [spaceId, projectId]);

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
          <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold text-blue-600">{dashboardData?.tasks?.total || 0}</p>
          <p className="text-sm text-gray-500">All tasks in scope</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
          <h3 className="text-lg font-semibold mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{dashboardData?.tasks?.completed || 0}</p>
          <p className="text-sm text-gray-500">{dashboardData?.tasks?.completionRate || 0}% completion rate</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
          <h3 className="text-lg font-semibold mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{dashboardData?.tasks?.pending || 0}</p>
          <p className="text-sm text-gray-500">In progress or todo</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
          <h3 className="text-lg font-semibold mb-2">Overdue</h3>
          <p className="text-3xl font-bold text-red-600">{dashboardData?.tasks?.overdue || 0}</p>
          <p className="text-sm text-gray-500">Past due date</p>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
          <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
          <p className="text-3xl font-bold text-purple-600">{dashboardData?.projects?.total || 0}</p>
          <p className="text-sm text-gray-500">All projects</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
          <h3 className="text-lg font-semibold mb-2">Active Projects</h3>
          <p className="text-3xl font-bold text-blue-600">{dashboardData?.projects?.active || 0}</p>
          <p className="text-sm text-gray-500">Currently active</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
          <h3 className="text-lg font-semibold mb-2">Completed Projects</h3>
          <p className="text-3xl font-bold text-green-600">{dashboardData?.projects?.completed || 0}</p>
          <p className="text-sm text-gray-500">{dashboardData?.projects?.completionRate || 0}% completion rate</p>
        </div>
      </div>
    </div>
  );

  const renderTaskAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Task Analytics</h2>
      
      {/* Status Breakdown */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
        <h3 className="text-lg font-semibold mb-4">Tasks by Status</h3>
        <div className="space-y-3">
          {taskData?.statusBreakdown?.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="capitalize">{item._id || 'Unknown'}</span>
              <span className="font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
        <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
        <div className="space-y-3">
          {taskData?.priorityBreakdown?.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="capitalize">{item._id || 'No Priority'}</span>
              <span className="font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Assignees */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
        <h3 className="text-lg font-semibold mb-4">Top Assignees</h3>
        <div className="space-y-3">
          {taskData?.assigneeBreakdown?.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{item.assigneeName || 'Unassigned'}</span>
              <span className="font-semibold">{item.count} tasks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjectAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Analytics</h2>
      
      {/* Project Status */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
        <h3 className="text-lg font-semibold mb-4">Projects by Status</h3>
        <div className="space-y-3">
          {projectData?.statusBreakdown?.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="capitalize">{item._id || 'Unknown'}</span>
              <span className="font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
        <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
        <div className="space-y-3">
          {projectData?.recentProjects?.map((project, index) => (
            <div key={index} className="flex justify-between items-center p-3 border border-color rounded">
              <div>
                <p className="font-medium">{project.name}</p>
                <p className="text-sm text-gray-500">{project.space?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm capitalize">{project.status}</p>
                <p className="text-xs text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Performance Metrics</h2>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
        <h3 className="text-lg font-semibold mb-4">Tasks Over Time (Last {performanceData?.period})</h3>
        <div className="space-y-3">
          {performanceData?.tasksOverTime?.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{item._id.day}/{item._id.month}/{item._id.year}</span>
              <div className="flex gap-4">
                <span className="text-blue-600">Created: {item.created}</span>
                <span className="text-green-600">Completed: {item.completed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-color">
        <h3 className="text-lg font-semibold mb-4">Completion Trend</h3>
        <div className="space-y-3">
          {performanceData?.completionTrend?.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{item._id.day}/{item._id.month}/{item._id.year}</span>
              <span className="font-semibold text-green-600">{item.count} completed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'tasks', label: 'Tasks' },
            { id: 'projects', label: 'Projects' },
            { id: 'performance', label: 'Performance' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'tasks' && renderTaskAnalytics()}
        {activeTab === 'projects' && renderProjectAnalytics()}
        {activeTab === 'performance' && renderPerformance()}
      </div>
    </div>
  );
}

export default Analytics;
