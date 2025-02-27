import TaskStatistic from "~/layout/Sidebar/Home/TaskStatistic";
function Home() {
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
  return (
    <div className="w-full ">
      <div className="pt-4 mt-6 px-2 space-y-4">
        <div>Task statics</div>
        <div className="grid  max-[830px]:grid-cols-2 max-[660px]:grid-cols-1 grid-cols-3 gap-4  max-[830px]:gap-3 max-[660px]:gap-2 overflow-x-auto">
          <TaskStatistic title="Pending Tasks" count={0} icon={clockIcon} />
          <TaskStatistic title="Completed Tasks" count={5} icon={clockIcon} />
          <TaskStatistic title="Overdue Tasks" count={2} icon={clockIcon} />
        </div>
        <div className="px-2">
          <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
