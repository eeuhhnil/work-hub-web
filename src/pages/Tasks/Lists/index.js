import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { createTaskWithFiles } from "~/api/taskApi";
import { useNotifications } from "~/contexts/NotificationContext";


function TaskList() {
  const { projectId, spaceId } = useParams();
  console.log("TaskList params:", { projectId, spaceId }); // Debug log
  const [tasks, setTasks] = useState([]);
  const { refreshNotifications } = useNotifications();
  const [task, setTask] = useState({
    name: "",
    description: "",
    assignee: "",
    startDate: "",
    dueDate: "",
    status: "pending",
    priority: "medium",
  });

  const TASK_STATUS = {
    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
  };

  const TASK_PRIORITY = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  const PRIORITY_COLORS = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
  };

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editSearch, setEditSearch] = useState("");
  const [showEditDropdown, setShowEditDropdown] = useState(false);
  const editDropdownRef = useRef(null);
  const [editSelectedFiles, setEditSelectedFiles] = useState([]);
  const editFileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

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
      setEditSearch(data.data.assignee?.fullName || "");
      setEditSelectedFiles([]);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch danh sách task từ API
  useEffect(() => {
    const fetchTasksData = async () => {
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

        // Đảm bảo tasks luôn là array
        const tasksData = data.data?.docs || data.data || [];
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]); // Set empty array nếu có lỗi
      }
    };

    if (spaceId || projectId) {
      fetchTasksData();
    }
  }, [projectId, spaceId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (editDropdownRef.current && !editDropdownRef.current.contains(event.target)) {
        setShowEditDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      setMessage("Task deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message || "Failed to delete task");
      setTimeout(() => setMessage(""), 5000);
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

        // Handle pagination response format
        const membersData = data.data?.docs || data.data || [];
        setMembers(Array.isArray(membersData) ? membersData : []);
      } catch (error) {
        console.error("Error fetching members:", error);
        setMembers([]); // Set empty array on error
      }
    };

    fetchMembers();
  }, [projectId]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Xử lý thay đổi input
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      let data;

      // Prepare task data
      const updatedTask = {
        name: currentTask.name,
        description: currentTask.description,
        status: currentTask.status,
        startDate: currentTask.startDate || null,
        dueDate: currentTask.dueDate || null,
        priority: currentTask.priority || 'medium',
        assignee: currentTask.assignee?._id || currentTask.assignee || null,
        attachments: currentTask.attachments || [] // Existing attachments
      };

      // Always use FormData for consistency (like create task)
      const formData = new FormData();

      // Add task data to FormData
      Object.keys(updatedTask).forEach(key => {
        if (key === 'attachments') {
          formData.append(key, JSON.stringify(updatedTask[key]));
        } else if (updatedTask[key] !== null && updatedTask[key] !== undefined) {
          formData.append(key, updatedTask[key]);
        }
      });

      // Add new files if any
      if (editSelectedFiles.length > 0) {
        editSelectedFiles.forEach(file => {
          formData.append('files', file);
        });
      }

      console.log("FormData to be sent:"); // Debug
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Update task using FormData
      const response = await fetch(`http://localhost:3000/tasks/${currentTask._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData, browser will set it automatically with boundary
        },
        body: formData,
      });

      data = await response.json();
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
      setEditSelectedFiles([]);
      if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
      }

      // Refresh notifications để hiển thị thông báo mới ngay lập tức
      setTimeout(() => {
        refreshNotifications();
      }, 1000);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsLoading(false);
    }
  };



  // Lọc thành viên theo tìm kiếm
  const filteredMembers = Array.isArray(members) ? members.filter((member) => {
    if (!member || !member.user || !member.user.fullName) return false;
    return member.user.fullName.toLowerCase().includes(search.toLowerCase());
  }) : [];

  // Xử lý chọn thành viên
  const handleSelectMember = (member) => {
    setTask({ ...task, assignee: member.user._id });
    setSearch(member.user.fullName);
    setShowDropdown(false);
  };

  // Xử lý chọn file
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // Xóa file đã chọn
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Kiểm tra file type có hợp lệ không
  const isValidFileType = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    return allowedTypes.includes(file.type) || /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(file.name);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    // Validation
    if (!task.name.trim()) {
      setMessage("Task name is required");
      setIsSubmitting(false);
      return;
    }

    if (!spaceId) {
      setMessage("Space ID is required");
      setIsSubmitting(false);
      return;
    }

    if (!projectId) {
      setMessage("Project ID is required");
      setIsSubmitting(false);
      return;
    }

    const bodyData = {
      assignee: task.assignee || null,
      name: task.name.trim(),
      description: task.description.trim(),
      startDate: task.startDate || null,
      dueDate: task.dueDate || null,
      status: task.status,
      priority: task.priority || 'medium',
    };

    console.log("Dữ liệu sẽ gửi:", bodyData); // In ra trước khi gửi
    console.log("SpaceId:", spaceId, "ProjectId:", projectId);
    console.log("Selected files:", selectedFiles);

    try {
      let data;

      // Nếu có file, sử dụng createTaskWithFiles
      if (selectedFiles.length > 0) {
        // Validate files
        const invalidFiles = selectedFiles.filter(file => !isValidFileType(file));
        if (invalidFiles.length > 0) {
          throw new Error(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}. Only PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX are allowed.`);
        }

        // Check file size (50MB limit)
        const oversizedFiles = selectedFiles.filter(file => file.size > 50 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
          throw new Error(`Files too large: ${oversizedFiles.map(f => f.name).join(', ')}. Maximum size is 50MB per file.`);
        }

        data = await createTaskWithFiles(spaceId, projectId, bodyData, selectedFiles);
      } else {
        // Nếu không có file, sử dụng API cũ
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:3000/tasks/space/${spaceId}/project/${projectId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to create task");
      }

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
      setTask({
        name: "",
        description: "",
        assignee: "",
        startDate: "",
        dueDate: "",
        status: "pending",
        priority: "medium",
      });
      setSearch("");
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Đóng modal sau khi tạo task thành công
      setIsCreateModalOpen(false);

      // Refresh notifications để hiển thị thông báo mới ngay lập tức
      setTimeout(() => {
        refreshNotifications();
      }, 1000);

      // Auto clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeEdit = (e) => {
    setCurrentTask({ ...currentTask, [e.target.name]: e.target.value });
  };

  // Filter members for edit assignee search
  const filteredEditMembers = members.filter((member) =>
    member.user.fullName.toLowerCase().includes(editSearch.toLowerCase())
  );

  // Handle selecting member in edit modal
  const handleSelectEditMember = (member) => {
    setCurrentTask({
      ...currentTask,
      assignee: {
        _id: member.user._id,
        fullName: member.user.fullName,
      },
    });
    setEditSearch(member.user.fullName);
    setShowEditDropdown(false);
  };

  // Handle edit assignee search input change
  const handleEditSearchChange = (e) => {
    setEditSearch(e.target.value);
    setShowEditDropdown(true);
  };

  // Handle file change for edit modal
  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEditSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  // Remove file from edit modal
  const removeEditFile = (index) => {
    setEditSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Remove existing attachment from task
  const removeExistingAttachment = (attachmentIndex) => {
    setCurrentTask(prevTask => ({
      ...prevTask,
      attachments: prevTask.attachments.filter((_, i) => i !== attachmentIndex)
    }));
  };

  return (
      <div className="relative">
        <div className="flex flex-col h-full min-h-0">
          <div className="p-4">
            <div className="mb-6">
              <h1 className="font-bold text-xl">Task list</h1>
              <p className="text-sm text-muted-foreground">List of tasks in project</p>
            </div>

            <div className="flex items-center justify-between">
              <Dialog.Root open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
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
                  <Dialog.Overlay
                    className="dialog-overlay fixed inset-0 backdrop-blur-sm"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      zIndex: 9998
                    }}
                  />
                  <Dialog.Content
                      className="fixed top-1/2 left-1/2 w-full max-w-lg rounded-xl shadow-2xl p-0 max-h-[90vh] overflow-hidden"
                      style={{
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333'
                      }}
                  >

                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b" style={{ borderColor: '#333' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <Dialog.Title className="text-xl font-semibold text-white">Create New Task</Dialog.Title>
                          <Dialog.Description className="text-sm text-gray-400 mt-1">
                            Enter the details to create a new task for your project
                          </Dialog.Description>
                        </div>
                        <Dialog.Close asChild>
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </Dialog.Close>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                      {message && (
                        <div className={`mb-4 p-3 rounded-lg ${message.includes('successfully') ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-red-900/20 text-red-400 border border-red-800'}`}>
                          <p className="text-sm">{message}</p>
                        </div>
                      )}

                      <form id="create-task-form" className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Task Name *</label>
                          <input
                              name="name"
                              value={task.name}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              type="text"
                              placeholder="Enter task name..."
                              required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                          <textarea
                              name="description"
                              value={task.description}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                              placeholder="Describe the task in detail..."
                              rows="4"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                          <select
                            name="status"
                            value={task.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          >
                            {Object.entries(TASK_STATUS).map(([key, value]) => (
                                <option key={key} value={key} className="bg-gray-800">
                                  {value}
                                </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                            <input
                                name="startDate"
                                value={task.startDate || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                type="date"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                            <input
                                name="dueDate"
                                value={task.dueDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                type="date"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                            <select
                                name="priority"
                                value={task.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                              {Object.entries(TASK_PRIORITY).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                              ))}
                            </select>
                          </div>


                        </div>

                        <div className="relative" ref={dropdownRef}>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Assign to</label>
                          <div className="relative">
                            <input
                                name="assignee"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full px-4 py-3 pr-10 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                type="text"
                                placeholder="Search team members..."
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>

                          {showDropdown && (
                              <div
                                className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-40 overflow-auto"
                                style={{ zIndex: 10000 }}
                              >
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <div
                                            key={member.user._id}
                                            className="p-3 hover:bg-gray-700 cursor-pointer flex items-center gap-3 transition-colors"
                                            onClick={() => handleSelectMember(member)}
                                        >
                                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm">
                                            {member.user.fullName.charAt(0).toUpperCase()}
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-white">{member.user.fullName}</p>
                                            <p className="text-xs text-gray-400">Team Member</p>
                                          </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center">
                                      <p className="text-sm text-gray-400">No members found</p>
                                    </div>
                                )}
                              </div>
                          )}
                        </div>

                        {/* File Upload Section */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Attach Files
                            <span className="text-xs text-gray-400 ml-2">(PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX - Max 50MB each)</span>
                          </label>
                          <div className="space-y-3">
                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                              onChange={handleFileChange}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />

                            {/* Display selected files */}
                            {selectedFiles.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-300">Selected files:</p>
                                {selectedFiles.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      <div>
                                        <p className="text-sm text-white">{file.name}</p>
                                        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(index)}
                                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                                    >
                                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-4 border-t" style={{ borderColor: '#333' }}>
                      <div className="flex items-center justify-end gap-3">
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </Dialog.Close>
                        <button
                          type="submit"
                          form="create-task-form"
                          disabled={isSubmitting}
                          className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Creating..." : "Create Task"}
                        </button>
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background" style={{ zIndex: 1 }}>
              <tr className="border-b border-color">
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Priority</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Assignees</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Attachments</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Start Date</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Due Date</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
              </thead>
              <tbody>
              {Array.isArray(tasks) && tasks.length > 0 ? tasks.map((task) => {
                if (!task || !task._id) return null;

                return (
                  <tr key={task._id} className="border-b border-color">
                    <td className="px-2 py-2">{task.name || 'Untitled Task'}</td>
                    <td className="px-2 py-2">{TASK_STATUS[task.status] || 'Unknown'}</td>
                    <td className="px-2 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority] || 'bg-gray-100 text-gray-800'}`}>
                        {TASK_PRIORITY[task.priority] || 'Medium'}
                      </span>
                    </td>
                    <td className="px-2 py-2">{task.assignee?.fullName || "Unassigned"}</td>
                    <td className="px-2 py-2">
                      {task.attachments && task.attachments.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {task.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200 transition-colors"
                              title={`${attachment.originalName} (${formatFileSize(attachment.size)})`}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {attachment.originalName.length > 15
                                ? `${attachment.originalName.substring(0, 15)}...`
                                : attachment.originalName
                              }
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No files</span>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {task.startDate ? (() => {
                        try {
                          return new Date(task.startDate).toLocaleDateString("vi-VN");
                        } catch (e) {
                          return "Invalid date";
                        }
                      })() : "No start date"}
                    </td>
                    <td className="px-2 py-2">
                      {task.dueDate ? (() => {
                        try {
                          return new Date(task.dueDate).toLocaleDateString("vi-VN");
                        } catch (e) {
                          return "Invalid date";
                        }
                      })() : "No due date"}
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
                );
              }) : (
                <tr>
                  <td colSpan="8" className="px-2 py-8 text-center text-gray-400">
                    No tasks found
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
        {isEditModalOpen && currentTask && (
            <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <Dialog.Portal>
                <Dialog.Overlay
                  className="fixed inset-0 backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    zIndex: 9998
                  }}
                />
                <Dialog.Content
                  className="fixed top-1/2 left-1/2 w-full max-w-lg rounded-xl shadow-2xl p-0 max-h-[90vh] overflow-hidden"
                  style={{
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333'
                  }}
                >
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b" style={{ borderColor: '#333' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <Dialog.Title className="text-xl font-semibold text-white">Edit Task</Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-400 mt-1">
                          Update the task details
                        </Dialog.Description>
                      </div>
                      <Dialog.Close asChild>
                        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </Dialog.Close>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                    <form id="edit-task-form" className="space-y-5" onSubmit={handleSaveTask}>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Task Name *</label>
                        <input
                          name="name"
                          value={currentTask.name}
                          onChange={handleChangeEdit}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                          name="description"
                          value={currentTask.description}
                          onChange={handleChangeEdit}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                          rows="4"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                        <select
                          name="status"
                          value={currentTask.status}
                          onChange={handleChangeEdit}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          {Object.entries(TASK_STATUS).map(([key, value]) => (
                              <option key={key} value={key} className="bg-gray-800">
                                {value}
                              </option>
                          ))}
                        </select>
                      </div>
                      <div className="relative" ref={editDropdownRef}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Assign to</label>
                        <div className="relative">
                          <input
                            name="assignee"
                            value={editSearch}
                            onChange={handleEditSearchChange}
                            onFocus={() => setShowEditDropdown(true)}
                            className="w-full px-4 py-3 pr-10 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            type="text"
                            placeholder="Search team members..."
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>

                        {showEditDropdown && (
                          <div
                            className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-40 overflow-auto"
                            style={{ zIndex: 10000 }}
                          >
                            {filteredEditMembers.length > 0 ? (
                              filteredEditMembers.map((member) => (
                                <div
                                  key={member.user._id}
                                  className="p-3 hover:bg-gray-700 cursor-pointer flex items-center gap-3 transition-colors"
                                  onClick={() => handleSelectEditMember(member)}
                                >
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm">
                                    {member.user.fullName.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-white">{member.user.fullName}</p>
                                    <p className="text-xs text-gray-400">Team Member</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center">
                                <p className="text-sm text-gray-400">No members found</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                          <input
                            name="startDate"
                            value={currentTask.startDate || ""}
                            onChange={handleChangeEdit}
                            type="date"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                          <input
                            name="dueDate"
                            value={currentTask.dueDate || ""}
                            onChange={handleChangeEdit}
                            type="date"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                        <select
                            name="priority"
                            value={currentTask.priority || 'medium'}
                            onChange={handleChangeEdit}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          {Object.entries(TASK_PRIORITY).map(([key, label]) => (
                            <option key={key} value={key} className="bg-gray-800">{label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Existing Attachments Section */}
                      {currentTask.attachments && currentTask.attachments.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Current Attachments</label>
                          <div className="space-y-2">
                            {currentTask.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <div>
                                    <p className="text-sm text-white">{attachment.originalName}</p>
                                    <p className="text-xs text-gray-400">{formatFileSize(attachment.size)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                                    title="Download"
                                  >
                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => removeExistingAttachment(index)}
                                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                                    title="Remove"
                                  >
                                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add New Attachments Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Add New Attachments
                          <span className="text-xs text-gray-400 ml-2">(PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX - Max 50MB each)</span>
                        </label>
                        <div className="space-y-3">
                          <input
                            ref={editFileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                            onChange={handleEditFileChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                          />

                          {/* Display selected new files */}
                          {editSelectedFiles.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm text-gray-300">New files to upload:</p>
                              {editSelectedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <div>
                                      <p className="text-sm text-white">{file.name}</p>
                                      <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeEditFile(index)}
                                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                                  >
                                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 border-t" style={{ borderColor: '#333' }}>
                    <div className="flex items-center justify-end gap-3">
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        form="edit-task-form"
                        disabled={isLoading}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
        )}
      </div>
  );
}

export default TaskList;
