function TaskBoard() {
  return (
    <div className="p-4">
      <h1 className="font-bold text-xl">Task Board</h1>
      <p className="text-sm text-muted-foreground">Board view of tasks in the project</p>
      {/* Thêm logic và UI cho Board */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="p-4 bg-muted rounded-md">To Do</div>
        <div className="p-4 bg-muted rounded-md">In Progress</div>
        <div className="p-4 bg-muted rounded-md">Done</div>
      </div>
    </div>
  );
}

export default TaskBoard;
