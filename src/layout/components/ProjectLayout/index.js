import { useParams } from "react-router-dom";
import SideBar from "~/layout/Sidebar/ProjectDetail";
import Header from "../Header/Header";
import SubSidebar from "~/layout/SubSidebar";
import { useState, useMemo } from "react";
import TaskBoard from "~/pages/Tasks/Board";
import TaskList from "~/pages/Tasks/Lists";
import Members from "~/pages/members";
import Setting from "~/pages/settings";

function ProjectLayout() {
  const { projectId } = useParams();
  const [selectedTab, setSelectedTab] = useState("tasks");
  const [viewMode, setViewMode] = useState("list");

  const taskComponent = useMemo(() => {
    return viewMode === "list" ? <TaskList /> : <TaskBoard />;
  }, [viewMode]);

  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  const project = projects.find((p) => p.id === parseInt(projectId));

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="flex min-h-screen">
        <SideBar selectedTab={selectedTab} onSelectTab={setSelectedTab} />
        {selectedTab === "tasks" && <SubSidebar viewMode={viewMode} setViewMode={setViewMode} />}
        <div className="content w-full">
          {selectedTab === "tasks" && taskComponent}
          {selectedTab === "members" && <Members />}
          {selectedTab === "settings" && <Setting />}
        </div>
      </div>
    </div>
  );
}

export default ProjectLayout;
