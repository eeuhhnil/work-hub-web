function Project() {
  return (
    <div>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-row justify-between px-4 pt-4">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
            <p className="text-muted-foreground">Join projects on the system or create your own group</p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <div className="relative border border-color rounded-md flex items-center w-full">
              <span className="absolute left-2 opacity-80">
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
                  class="lucide lucide-search w-4 h-4 text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </span>
              <input className="flex rounded-md background-primary background-primary px-7 py-2 text-sm" placeholder="Search project" />
            </div>
            <button className="inline-flex items-center bg-primary text-primary-foreground justify-center rounded-md text-sm px-4 py-2">
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
                class="lucide lucide-plus w-4 h-4 mr-1"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
