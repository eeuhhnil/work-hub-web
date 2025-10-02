// import { useParams } from "react-router-dom";
import SideBar from "~/layout/Sidebar/ProjectDetail";
import Header from "../Header/Header";
import SubSidebar from "~/layout/SubSidebar";
import { useState, useMemo } from "react";
import TaskList from "~/pages/Tasks/Lists";
import TaskCalendar from "~/pages/Tasks/Calendar";
import PendingApprovalTasks from "~/pages/Tasks/PendingApproval";
import Members from "~/pages/members";
import Setting from "~/pages/settings";

function ProjectLayout() {
  const [selectedTab, setSelectedTab] = useState("members");
  const [viewMode, setViewMode] = useState("list");

  const taskComponent = useMemo(() => {
    if (viewMode === "list") return <TaskList />;
    if (viewMode === "calendar") return <TaskCalendar />;
    if (viewMode === "pending-approval") return <PendingApprovalTasks />;
    return null;
  }, [viewMode]);

  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="flex min-h-screen">
        <SideBar selectedTab={selectedTab} onSelectTab={setSelectedTab} />
        {selectedTab === "tasks" && <SubSidebar viewMode={viewMode} setViewMode={setViewMode} />}
        <div className="content w-full">
          {selectedTab === "members" && <Members />}
          {selectedTab === "tasks" && taskComponent}
          {selectedTab === "settings" && <Setting />}
        </div>
      </div>
    </div>
  );
}

export default ProjectLayout;
