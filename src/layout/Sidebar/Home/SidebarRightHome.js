import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSpaceMembers } from "~/api/spaceApi";
import { getUserProjectsProgress } from "~/api/projectApi";

function SidebarRightHome() {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!spaceId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check authentication
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error("No access token found. Please login again.");
        }

        // Fetch space members
        const membersData = await fetchSpaceMembers(spaceId);
        setTeamMembers(Array.isArray(membersData) ? membersData : []);

        // Fetch user projects with progress - lấy dữ liệu thực từ API
        const projectsData = await getUserProjectsProgress();


        // Filter projects theo spaceId nếu có
        const filteredProjects = spaceId
          ? projectsData.filter(project => project.space === spaceId)
          : projectsData;

        const formattedProjects = Array.isArray(filteredProjects) ? filteredProjects.map((project, index) => {
          // Lấy progress từ API (đã có dạng "33%") và chuyển thành số
          const progressValue = parseInt(project.progress) || 0;
          return {
            id: project._id,
            name: project.name,
            progress: progressValue, // Sử dụng progress thực từ API
            color: index % 2 === 0 ? "bg-blue-500" : "bg-green-500", // Alternate colors
            members: project.members || 0
          };
        }) : [];

        setOngoingProjects(formattedProjects);

      } catch (error) {
        console.error("Error loading sidebar data:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        setError(error.message || "Failed to load data");
        setTeamMembers([]);
        setOngoingProjects([]);
      } finally {
        setLoading(false);
        console.log("Loading completed");
      }
    };

    loadData();
  }, [spaceId]);

  // Hàm xử lý click vào project để navigate đến trang chi tiết
  const handleProjectClick = (projectId) => {
    navigate(`/space/${spaceId}/project/${projectId}`);
  };


  return (
    <div className="max-w-[280px] w-full border-l border-color">
      {/* Ongoing Projects */}
      <div className="flex p-4 border-b border-color flex-col h-fit">
        <div className="font-semibold flex flex-row gap-3 items-center mb-4">
          Ongoing Projects
          <div className="px-2 py-0.5 text-[14px] rounded-lg border items-center flex flex-row gap-1.5">
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
              className="lucide lucide-rocket w-4 h-4"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
            </svg>
            {ongoingProjects.length}
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-gray-400 py-4">Loading projects...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-4">
              <div>Error loading projects</div>
              <div className="text-xs mt-1">{error}</div>
            </div>
          ) : ongoingProjects.length > 0 ? (
            ongoingProjects.map((project) => (
              <div
                key={project.id}
                className="p-3 rounded-lg border border-color hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{project.name}</h4>
                  <span className="text-xs text-gray-500">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className={`${project.color} h-2 rounded-full`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="m22 21-3-3m0 0a2 2 0 0 0-3-3 2 2 0 0 0-3 3 2 2 0 0 0 3 3 2 2 0 0 0 3-3Z"></path>
                  </svg>
                  {project.members} members
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">No ongoing projects</div>
          )}
        </div>
      </div>

      {/* Team Members */}
      <div className="p-4">
        <div className="font-semibold flex flex-row gap-3 items-center mb-4">
          Team Members
          <div className="px-2 py-0.5 text-[14px] rounded-lg border items-center flex flex-row gap-1.5">
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
              className="lucide lucide-users w-4 h-4"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="m22 21-3-3m0 0a2 2 0 0 0-3-3 2 2 0 0 0-3 3 2 2 0 0 0 3 3 2 2 0 0 0 3-3Z"></path>
            </svg>
            {teamMembers.length}
          </div>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="text-center text-gray-400 py-4">Loading members...</div>
          ) : teamMembers.length > 0 ? (
            teamMembers.map((member, index) => (
              <div key={member._id || index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                    {member.user?.fullName ? member.user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{member.user?.fullName || 'Unknown User'}</p>
                  <p className="text-xs text-gray-400 truncate">{member.role?.toUpperCase() || 'MEMBER'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">No team members</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SidebarRightHome;
