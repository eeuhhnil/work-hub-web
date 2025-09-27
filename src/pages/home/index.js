import { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import TaskStatistic from "~/layout/Sidebar/Home/TaskStatistic";
import { fetchDashboardAnalytics } from "~/api/analyticsApi";
import { fetchUserTaskStats, fetchUserTaskStatsBySpace } from "~/api/taskApi";
import { getProjectsBySpace } from "~/api/projectApi";
import { fetchProjectMembers } from "~/api/projectMemberApi";
import { useNotifications } from "~/contexts/NotificationContext";
import { formatNotificationMessage, formatTimeAgo } from "~/utils/notificationUtils";

function Home() {
  const { spaceId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskStatsLoading, setTaskStatsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Get notifications from context
  const { notifications, fetchNotifications } = useNotifications();


  // Fetch analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!spaceId) return;

      try {
        setLoading(true);
        const data = await fetchDashboardAnalytics(spaceId);
        setAnalytics(data);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [spaceId]);

  // Fetch task statistics
  useEffect(() => {
    const loadTaskStats = async () => {
      if (!spaceId) return;

      try {
        setTaskStatsLoading(true);
        const data = await fetchUserTaskStatsBySpace(spaceId);
        setTaskStats(data);
      } catch (error) {
        console.error("Error loading task stats:", error);
      } finally {
        setTaskStatsLoading(false);
      }
    };

    loadTaskStats();
  }, [spaceId]); // Phụ thuộc vào spaceId để cập nhật khi chuyển space

  // Fetch projects data
  useEffect(() => {
    const loadProjects = async () => {
      if (!spaceId) return;

      try {
        setProjectsLoading(true);

        // Chỉ fetch tất cả project trong space
        const projectsData = await getProjectsBySpace(spaceId);

        setProjects(projectsData); // lưu trực tiếp vào state
      } catch (error) {
        console.error("Error loading projects:", error);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, [spaceId]);

  // Fetch notifications for current space
  useEffect(() => {
    const loadNotifications = async () => {
      if (!spaceId) {
        console.log('❌ No spaceId provided, skipping notification fetch');
        return;
      }

      try {
        console.log('🔄 Loading notifications for space:', spaceId);
        console.log('🔄 Current URL:', window.location.pathname);
        await fetchNotifications(spaceId);
        console.log('✅ Notifications loaded for space:', spaceId);
      } catch (error) {
        console.error("❌ Error loading notifications for space:", error);
      }
    };

    loadNotifications();
  }, [spaceId, fetchNotifications]); // Phụ thuộc vào spaceId để cập nhật khi chuyển space


  const clockIcon = (
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
      className="lucide lucide-clock w-4 h-4"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  const processingIcon = (
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
    >
      <path d="M12 2v4"></path>
      <path d="m16.2 7.8 2.9-2.9"></path>
      <path d="M18 12h4"></path>
      <path d="m16.2 16.2 2.9 2.9"></path>
      <path d="M12 18v4"></path>
      <path d="m4.9 19.1 2.9-2.9"></path>
      <path d="M2 12h4"></path>
      <path d="m4.9 4.9 2.9 2.9"></path>
    </svg>
  );

  const activityIcon = (
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
      className="lucide lucide-activity w-4 h-4"
    >
      <path d="m22 12-4-4v3a8 8 0 0 0-16 0v3l-4-4"></path>
    </svg>
  );

  const projectIcon = (
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
      className="lucide lucide-folder w-4 h-4"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
    </svg>
  );

  // Get 4 most recent notifications for recent activities
  const recentActivities = notifications
    .slice(0, 4) // Get first 4 notifications (already sorted by createdAt desc)
    .map((notification) => ({
      id: notification._id,
      message: formatNotificationMessage(notification),
      time: formatTimeAgo(notification.createdAt),
      isRead: notification.isRead,
      type: notification.type,
      actorName: notification.actorName || 'Someone'
    }));

  const quickActions = [
    // { title: "Create Task", icon: "plus", color: "bg-blue-500" },
    { title: "New Project", icon: "folder-plus", color: "bg-green-500", link: `/space/${spaceId}/project` },
    { title: "Invite Member", icon: "user-plus", color: "bg-purple-500", link: `/space/${spaceId}/member` },
    { title: "View Reports", icon: "bar-chart", color: "bg-orange-500" },
  ];

  return (
    <div className="w-full">
      <div className="pt-4 mt-6 px-2 space-y-6">
        {/* Task Statistics */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Task Statistics</h2>
          {taskStatsLoading ? (
            <div className="text-center text-gray-400 py-8">Loading task statistics...</div>
          ) : (
            <div className="grid max-[830px]:grid-cols-2 max-[660px]:grid-cols-1 grid-cols-4 gap-4 max-[830px]:gap-3 max-[660px]:gap-2 overflow-x-auto">
              <TaskStatistic
                title="Pending Tasks"
                count={taskStats?.pending || 0}
                icon={clockIcon}
              />
              <TaskStatistic
                title="Processing Tasks"
                count={taskStats?.processing || 0}
                icon={processingIcon}
              />
              <TaskStatistic
                title="Completed Tasks"
                count={taskStats?.completed || 0}
                icon={clockIcon}
              />
              <TaskStatistic
                title="Overdue Tasks"
                count={taskStats?.overdue || 0}
                icon={clockIcon}
              />
            </div>
          )}
        </div>

        <div className="px-2">
          <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full"></div>
        </div>

        <div className="px-2">
          <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full"></div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
                <Link
                    key={index}
                    to={action.link} // dùng link tương ứng
                    className="p-4 rounded-lg border border-color hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors block"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                      {action.icon === "plus" && <><path d="M5 12h14"></path><path d="M12 5v14"></path></>}
                      {action.icon === "folder-plus" && <><path d="M12 10v6"></path><path d="m15 13-3-3-3 3"></path><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path></>}
                      {action.icon === "user-plus" && <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line></>}
                      {action.icon === "bar-chart" && <><line x1="12" x2="12" y1="20" y2="10"></line><line x1="18" x2="18" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="16"></line></>}
                    </svg>
                  </div>
                  <h3 className="font-medium text-sm">{action.title}</h3>
                </Link>
            ))}
          </div>
        </div>

        <div className="px-2">
          <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full"></div>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className={`flex items-center space-x-3 p-3 rounded-lg border border-color ${!activity.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    {activityIcon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${!activity.isRead ? 'font-medium' : ''}`}>
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  {!activity.isRead && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                No recent activities
              </div>
            )}
          </div>
        </div>

        <div className="px-2">
          <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
