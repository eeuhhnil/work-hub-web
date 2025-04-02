import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {fetchProjectMembers} from "~/api/projectMemberApi";


function TaskList() {
  const { projectId, spaceId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    name: "",
    description: "",
    assignee: "",
    dueDate: "",
    status: "pending",
  });

  const TASK_STATUS = {
    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
  };

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //lay du lieu 1 task
  const handleEditTask = async (taskId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch task");

      setCurrentTask(data.data);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch danh sách task từ API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:3000/tasks?space=${spaceId}&project=${projectId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch tasks");

        setTasks(data.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [projectId]);

  //Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá task này?")) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete task");

      // Xoá khỏi state
      setTasks(tasks.filter(task => task._id !== taskId));
      setMessage("Xóa task thành công!");
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Fetch danh sách thành viên từ API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:3000/project?project=${projectId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log(data)
        if (!response.ok) throw new Error(data.message || "Failed to fetch members");

        setMembers(data.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, [projectId]);


  // Xử lý thay đổi input
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Chỉ lấy những trường cần thiết để gửi lên API
      const updatedTask = {
        name: currentTask.name,
        description: currentTask.description,
        status: currentTask.status,
        dueDate: currentTask.dueDate || null,
        assignee: currentTask.assignee?._id || currentTask.assignee || null, // Đảm bảo chỉ gửi ID
      };

      console.log("Data to be sent:", JSON.stringify(updatedTask, null, 2)); // Debug

      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:3000/tasks/${currentTask._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update task");

      if (typeof data.data.assignee === "string") {
        const matched = members.find((m) => m.user._id === data.data.assignee);
        if (matched) {
          data.data.assignee = {
            _id: matched.user._id,
            fullName: matched.user.fullName,
          };
        }
      }

      setTasks((prevTasks) => prevTasks.map((task) => (task._id === currentTask._id ? data.data : task)));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsLoading(false);
    }
  };



  // Lọc thành viên theo tìm kiếm
  const filteredMembers = members.filter((member) =>
      member.user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // Xử lý chọn thành viên
  const handleSelectMember = (member) => {
    setTask({ ...task, assignee: member.user._id });
    setSearch(member.user.fullName);
    setShowDropdown(false);
  };


  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const bodyData = {
      space: spaceId,
      project: projectId,
      assignee: task.assignee,
      name: task.name,
      description: task.description,
      dueDate: task.dueDate || null,
      status: task.status,
    };

    console.log("Dữ liệu sẽ gửi:", bodyData); // In ra trước khi gửi

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create task");
      console.log(data)

      if (typeof data.data.assignee === "string") {
        const matched = members.find((m) => m.user._id === data.data.assignee);
        if (matched) {
          data.data.assignee = {
            _id: matched.user._id,
            fullName: matched.user.fullName,
          };
        }
      }

      setMessage("Task created successfully!");
      setTasks([...tasks, data.data]);
      setTask({ name: "", description: "", assignee: "", dueDate: "", status: "pending" });
      setSearch("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleChangeEdit = (e) => {
    setCurrentTask({ ...currentTask, [e.target.name]: e.target.value });
  };

  return (
      <div>
        <div className="flex flex-col h-full min-h-0">
          <div className="p-4">
            <div className="mb-6">
              <h1 className="font-bold text-xl">Task list</h1>
              <p className="text-sm text-muted-foreground">List of tasks in project</p>
            </div>

            <div className="flex items-center justify-between">
              <Dialog.Root>
                <Dialog.Trigger
                    className="flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-full transition-colors hover:bg-primary/90">
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15"
                       fill="currentColor">
                    <path
                        d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"/>
                  </svg>
                  Create Task
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Overlay className="dialog-overlay fixed inset-0 bg-black bg-opacity-50 z-[999]" />
                  <Dialog.Content
                      className="fixed top-1/2 left-1/2 w-full max-w-lg border border-color rounded-md shadow-lg p-6 transform -translate-x-1/2 -translate-y-1/2 z-[1100] bg-background"
                  >

                    <Dialog.Title className="mb-2 text-lg font-semibold">Create Task</Dialog.Title>
                    <Dialog.Description className="mb-4 text-sm text-muted-foreground">Enter the details to create a new
                      task.</Dialog.Description>

                    {message && <p className="text-sm text-green-500">{message}</p>}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-muted-foreground">Task Name</label>
                        <input
                            name="name"
                            value={task.name}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border border-color bg-transparent rounded-md"
                            type="text"
                            placeholder="Task name"
                            required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-muted-foreground">Description</label>
                        <textarea
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border border-color bg-transparent rounded-md"
                            placeholder="Task description"
                            rows="4"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">Status</label>
                        <select name="status" value={task.status} onChange={handleChange} className="w-full px-3 py-2 border border-color bg-transparent rounded-md">
                          {Object.entries(TASK_STATUS).map(([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-muted-foreground">Assign to</label>
                        <input
                            name="assignee"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                            className="w-full mt-1 px-3 py-2 border border-color bg-transparent rounded-md"
                            type="text"
                            placeholder="Search..."
                        />

                        {showDropdown && (
                            <div
                                className="absolute top-full right-0 mt-2 w-[250px] bg-black border border-color rounded-md shadow-lg max-h-40 overflow-auto translate-x-full">
                              {filteredMembers.length > 0 ? (
                                  filteredMembers.map((member) => (
                                      <div
                                          key={member.user._id}
                                          className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                                          onClick={() => handleSelectMember(member)}
                                      >
                                <span
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white font-bold">
                                  {member.user.fullName.charAt(0).toUpperCase()}
                                </span>
                                        <span className="text-white">{member.user.fullName}</span>
                                      </div>
                                  ))
                              ) : (
                                  <p className="p-2 text-gray-400">No members found</p>
                              )}
                            </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-muted-foreground">Due Date</label>
                        <input
                            name="dueDate"
                            value={task.dueDate}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border border-color bg-transparent rounded-md"
                            type="date"
                        />
                      </div>
                      <div className="flex justify-end space-x-4">
                        <Dialog.Close asChild>
                          <button type="button" className="border border-color bg-white text-primary-foreground px-4 py-2 rounded-md">
                            Cancel
                          </button>
                        </Dialog.Close>
                        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md">
                          Create
                        </button>
                      </div>
                    </form>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background z-10]">
              <tr className="border-b border-color">
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Assignees</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Due Date</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
              </thead>
              <tbody>
              {tasks.map((task) => (
                  <tr key={task._id} className="border-b border-color">
                    <td className="px-2 py-2">{task.name}</td>
                    <td className="px-2 py-2">{TASK_STATUS[task.status]}</td>
                    <td className="px-2 py-2">{task.assignee?.fullName || "Unassigned"}</td>
                    <td className="px-2 py-2">
                      {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString("vi-VN")
                          : "No due date"}
                    </td>
                    <td className="px-2 py-2">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button
                              className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                              type="button"
                              id="radix-:r8e:"
                              aria-haspopup="menu"
                              aria-expanded="false"
                              data-state="closed"
                          >
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                            >
                              <path
                                  d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Content
                            className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                        >
                          <DropdownMenu.Item
                              className="flex cursor-pointer gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent"
                              onClick={() => handleEditTask(task._id)}
                          >
                            Edit

                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                              className="flex cursor-pointer gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent text-red-600"
                              onClick={() => handleDeleteTask(task._id)} // <-- Gọi hàm delete
                          >
                            Delete
                          </DropdownMenu.Item>

                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
        {isEditModalOpen && currentTask && (
            <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg border border-color rounded-md shadow-lg p-6 transform -translate-x-1/2 -translate-y-1/2 z-[1100] bg-background">
                  <h2 className="text-lg font-semibold">Edit Task</h2>
                  <form className="space-y-4" onSubmit={handleSaveTask}>
                    <input name="name" value={currentTask.name} onChange={handleChangeEdit} className="w-full mt-1 px-3 py-2 border border-color bg-transparent rounded-md" />
                    <textarea name="description" value={currentTask.description} onChange={handleChangeEdit} className="w-full mt-1 px-3 py-2 border border-color bg-transparent rounded-md" />
                    <label className="block text-sm font-medium text-muted-foreground">Status</label>

                    <select name="status" value={currentTask.status} onChange={handleChangeEdit} className="w-full px-3 py-2 border border-color bg-transparent rounded-md">
                      {Object.entries(TASK_STATUS).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                      ))}
                    </select>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground">Assignee</label>
                      <select
                          name="assignee"
                          value={currentTask.assignee?._id || ""}
                          onChange={(e) => {
                            const selectedMember = members.find((m) => m.user._id === e.target.value);
                            if (selectedMember) {
                              setCurrentTask({
                                ...currentTask,
                                assignee: {
                                  _id: selectedMember.user._id,
                                  fullName: selectedMember.user.fullName,
                                },
                              });
                            }
                          }}
                          className="w-full px-3 py-2 border border-color bg-transparent rounded-md"
                      >
                        {/*<option value="">Unassigned</option>*/}
                        {members.map((member) => (
                            <option key={member.user._id} value={member.user._id}>
                              {member.user.fullName}
                            </option>
                        ))}
                      </select>
                    </div>
                    <input name="name" value={currentTask.dueDate}  onChange={handleChangeEdit} className="w-full mt-1 px-3 py-2 border border-color bg-transparent rounded-md" />


                    <div className="flex justify-end space-x-4">
                      <Dialog.Close asChild>
                        <button type="button" className="border border-color bg-white text-primary-foreground px-4 py-2 rounded-md">
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md">
                        Save
                      </button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
        )}
      </div>
  );
}

export default TaskList;
