import {Link, useParams} from "react-router-dom";

function SubSidebar({ viewMode, setViewMode }) {
  const {spaceId, projectId} = useParams();

  return (
    <div className="border border-color min-w-[200px]">
      <nav className="grid gap-1 px-2">
        <Link to={`/space/${spaceId}/project/${projectId}/taskList`}
            className={`px-3 py-2 text-sm text-left rounded-md ${viewMode === "list" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`} onClick={() => setViewMode("list")}>
          List View
        </Link>
        <Link  to={`/space/${spaceId}/project/${projectId}/taskBoard`}
            className={`px-3 py-2 text-sm text-left rounded-md ${viewMode === "board" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`} onClick={() => setViewMode("board")}>
          Board View
        </Link>
      </nav>
    </div>
  );
}

export default SubSidebar;
