import {Link, useParams} from "react-router-dom";
import { getTokenPayload } from "~/utils/tokenUtils";

function SubSidebar({ viewMode, setViewMode }) {
  const {spaceId, projectId} = useParams();

  // Get user role to determine if they can see Pending Approval
  const userPayload = getTokenPayload();
  const isProjectManager = userPayload?.role === 'project_manager';

  return (
    <div className="border border-color min-w-[200px]">
      <nav className="grid gap-1 px-2">
        <Link to={`/space/${spaceId}/project/${projectId}/taskList`}
            className={`px-3 py-2 text-sm text-left rounded-md ${viewMode === "list" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`} onClick={() => setViewMode("list")}>
          List View
        </Link>
        <Link to={`/space/${spaceId}/project/${projectId}/calendar`}
            className={`px-3 py-2 text-sm text-left rounded-md ${viewMode === "calendar" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`} onClick={() => setViewMode("calendar")}>
          Calendar View
        </Link>
        {/* Only show Pending Approval for Project Managers */}
        {isProjectManager && (
          <Link to={`/space/${spaceId}/project/${projectId}/pending-approval`}
              className={`px-3 py-2 text-sm text-left rounded-md ${viewMode === "pending-approval" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`} onClick={() => setViewMode("pending-approval")}>
            Pending Approval
          </Link>
        )}
      </nav>
    </div>
  );
}

export default SubSidebar;
