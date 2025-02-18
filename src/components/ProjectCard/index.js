import { useNavigate } from "react-router-dom";

function ProjectCard({ project }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/project/${project.id}`);
  };

  return (
    <div className="py-4 px-4 border border-color" onClick={handleNavigate}>
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-center gap-2">
          <span class="relative flex shrink-0 w-11 h-11 !rounded cursor-pointer">
            <span class="flex h-full w-full items-center justify-center !rounded bg-muted">{project.initial}</span>
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h5>{project.name}</h5>
              <div class="inline-flex items-center rounded-md border border-color px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground capitalize">
                member
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-clipboard-list w-3.5 h-3.5"
                >
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <path d="M12 11h4"></path>
                  <path d="M12 16h4"></path>
                  <path d="M8 11h.01"></path>
                  <path d="M8 16h.01"></path>
                </svg>
                <p className="text-sm text-muted-foreground">tasks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
