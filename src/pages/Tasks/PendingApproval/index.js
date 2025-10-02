import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as Dialog from "@radix-ui/react-dialog";
import { fetchPendingApprovalTasks, approveTask, rejectTask } from "~/api/taskApi";
import { useNotifications } from "~/contexts/NotificationContext";

function PendingApprovalTasks() {
  const { projectId, spaceId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const [selectedTask, setSelectedTask] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshNotificationsWithSocket } = useNotifications();

  const PRIORITY_COLORS = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
  };

  // Fetch pending approval tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = {};
      if (spaceId) query.space = spaceId;
      if (projectId) query.project = projectId;

      const response = await fetchPendingApprovalTasks(query);

      // Backend returns { data: [...], meta: {...} }
      const tasksData = response.data || [];
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error('Error fetching pending approval tasks:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [spaceId, projectId]);

  useEffect(() => {
    fetchTasks();
  }, [spaceId, projectId, fetchTasks]);

  const handleApprove = async () => {
    if (!selectedTask) return;
    
    setIsSubmitting(true);
    try {
      await approveTask(selectedTask._id, { comment });
      setIsApproveModalOpen(false);
      setComment('');
      setSelectedTask(null);
      await fetchTasks(); // Refresh the list
      refreshNotificationsWithSocket();
    } catch (error) {
      console.error('Error approving task:', error);
      alert('Failed to approve task: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTask) return;
    
    setIsSubmitting(true);
    try {
      await rejectTask(selectedTask._id, { reason });
      setIsRejectModalOpen(false);
      setReason('');
      setSelectedTask(null);
      await fetchTasks(); // Refresh the list
      refreshNotificationsWithSocket();
    } catch (error) {
      console.error('Error rejecting task:', error);
      alert('Failed to reject task: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Tasks Pending Approval</h1>
        <p className="text-gray-400">Review and approve tasks submitted by team members</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No tasks pending approval</h3>
          <p className="text-gray-400">All tasks are up to date!</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assignee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Submitted</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-700/50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">{task.name}</div>
                        {task.description && (
                          <div className="text-sm text-gray-400 mt-1 truncate max-w-xs">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-xs mr-3">
                          {task.assignee?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="text-sm text-white">{task.assignee?.fullName || 'Unassigned'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority] || 'bg-gray-100 text-gray-800'}`}>
                        {task.priority?.charAt(0)?.toUpperCase() + task.priority?.slice(1) || 'Medium'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">
                      {formatDate(task.updatedAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setIsApproveModalOpen(true);
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setIsRejectModalOpen(true);
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      <Dialog.Root open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-6 z-50 transform -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="text-lg font-semibold text-white mb-4">
              Approve Task
            </Dialog.Title>
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Are you sure you want to approve "{selectedTask?.name}"?
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Comment (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Add a comment for the assignee..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Reject Modal */}
      <Dialog.Root open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-6 z-50 transform -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="text-lg font-semibold text-white mb-4">
              Reject Task
            </Dialog.Title>
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Please provide a reason for rejecting "{selectedTask?.name}":
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows="3"
                  placeholder="Explain why this task needs to be reworked..."
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleReject}
                disabled={isSubmitting || !reason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default PendingApprovalTasks;
