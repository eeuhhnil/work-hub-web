function TaskStatistic({ title, count, icon }) {
  return (
    <div className="p-4 flex flex-col space-y-1 border border-color rounded-lg">
      <div className="flex flex-row text-[14px] items-center gap-2 font-semibold">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div>
        <span className="text-xl block font-bold">{count}</span>
      </div>
    </div>
  );
}
export default TaskStatistic;
