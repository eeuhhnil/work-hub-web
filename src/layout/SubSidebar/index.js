function SubSidebar({ viewMode, setViewMode }) {
  return (
    <div className="border border-color min-w-[200px]">
      <nav className="grid gap-1 px-2">
        <button className={`px-3 py-2 text-sm text-left rounded-md ${viewMode === "list" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`} onClick={() => setViewMode("list")}>
          List View
        </button>
        <button className={`px-3 py-2 text-sm text-left rounded-md ${viewMode === "board" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`} onClick={() => setViewMode("board")}>
          Board View
        </button>
      </nav>
    </div>
  );
}

export default SubSidebar;
