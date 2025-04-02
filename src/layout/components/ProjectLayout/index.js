import { useParams } from "react-router-dom";
import SideBar from "~/layout/Sidebar/ProjectDetail";
import Header from "../Header/Header";
import SubSidebar from "~/layout/SubSidebar";
import { useState, useMemo } from "react";
import TaskList from "~/pages/Tasks/Lists";
import Members from "~/pages/members";
import Setting from "~/pages/settings";

function ProjectLayout() {
  const { projectId } = useParams();
  const [selectedTab, setSelectedTab] = useState("members");
  const [viewMode, setViewMode] = useState("list");

  const taskComponent = useMemo(() => {
    return viewMode === "list" ? <TaskList /> : null
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
