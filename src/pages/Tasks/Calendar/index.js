import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTasksForCalendar } from '~/api/taskApi';
import { fetchProjectMembers } from '~/api/projectMemberApi';

function TaskCalendar() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch project members for filter dropdown
  useEffect(() => {
    const fetchMembersData = async () => {
      try {
        const membersData = await fetchProjectMembers(projectId);
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    if (projectId) {
      fetchMembersData();
    }
  }, [projectId]);

  // Fetch tasks based on user permissions using new API endpoint
  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        setLoading(true);
        // Use the new calendar API endpoint that handles permissions on backend
        const tasksData = await fetchTasksForCalendar(projectId);
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks for calendar:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchTasksData();
    }
  }, [projectId]);

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDayTasks = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return tasks.filter(task => {
      let matchesDate = false;

      // Check if task starts on this day
      if (task.startDate) {
        const startDate = new Date(task.startDate);
        const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
        if (startDateStr === dateStr) matchesDate = true;
      }

      // Check if task is due on this day
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const dueDateStr = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`;
        if (dueDateStr === dateStr) matchesDate = true;
      }

      // Removed spanning logic - only show on start and due dates

      if (!matchesDate) return false;

      // Apply filters
      if (searchQuery && !task.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (selectedAssignee && task.assignee?._id !== selectedAssignee) {
        return false;
      }

      if (selectedStatus && task.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  };

  // Get task type for a specific day
  const getTaskTypeForDay = (task, day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    let isStart = false;
    let isDue = false;

    if (task.startDate) {
      const startDate = new Date(task.startDate);
      const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
      if (startDateStr === dateStr) isStart = true;
    }

    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const dueDateStr = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`;
      if (dueDateStr === dateStr) isDue = true;
    }

    // Removed spanning logic

    return { isStart, isDue, isSpanning: false };
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Get task color based on priority or status
  const getTaskColor = (task) => {
    if (task.status === 'completed') {
      return 'bg-gray-600 text-gray-300 border-gray-500';
    } else if (task.priority === 'urgent') {
      return 'bg-red-600 text-red-100 border-red-500';
    } else if (task.priority === 'high') {
      return 'bg-orange-600 text-orange-100 border-orange-500';
    } else if (task.priority === 'medium') {
      return 'bg-yellow-600 text-yellow-100 border-yellow-500';
    } else if (task.priority === 'low') {
      return 'bg-green-600 text-green-100 border-green-500';
    } else {
      return 'bg-blue-600 text-blue-100 border-blue-500'; // default
    }
  };

  // Get task prefix based on type
  const getTaskPrefix = (taskType) => {
    if (taskType.isStart && taskType.isDue) return '🔄'; // Same day start and due
    if (taskType.isStart) return '▶️'; // Start
    if (taskType.isDue) return '🏁'; // Due
    return '';
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Header with filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search calendar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
              <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Assignee Filter */}
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Assignee</option>
              {members.map(member => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.fullName}
                </option>
              ))}
            </select>

            {/* Type Filter - placeholder for now */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Type </option>
              <option value="task">Task</option>
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Status </option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-all text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h2 className="text-xl font-semibold mx-4 min-w-[200px] text-center text-white">{getMonthName(currentDate)}</h2>

              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-all text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-gray-700">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="p-4 text-center text-sm font-semibold text-gray-200 border-r border-gray-600 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className="min-h-[140px] border-r border-b border-gray-600 last:border-r-0 p-3 bg-gray-800 hover:bg-gray-750 transition-colors"
            >
              {day && (
                <>
                  <div className={`text-sm font-semibold mb-3 ${isToday(day) ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg' : 'text-gray-200 w-7 h-7 flex items-center justify-center'}`}>
                    {day}
                  </div>
                  
                  {/* Tasks for this day */}
                  <div className="space-y-1">
                    {getDayTasks(day).map(task => {
                      const taskType = getTaskTypeForDay(task, day);
                      const taskPrefix = getTaskPrefix(taskType);

                      return (
                        <div
                          key={`${task._id}-${day}`}
                          className={`text-xs p-1 rounded border cursor-pointer hover:opacity-80 truncate ${getTaskColor(task)}`}
                          title={`${taskPrefix} ${task.name} - ${task.assignee?.fullName || 'Unassigned'} - ${task.priority || 'medium'} priority
Start: ${task.startDate ? new Date(task.startDate).toLocaleDateString() : 'Not set'}
Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}`}
                        >
                          <div className="flex items-center gap-1">
                            {task.status === 'completed' && (
                              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span className="text-xs mr-1">{taskPrefix}</span>
                            <span className="truncate">{task.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskCalendar;
