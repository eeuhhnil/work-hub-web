// Notification types from backend
export const NotificationType = {
  // Space
  UPDATE_SPACE: 'UPDATED_SPACE',

  // Space Member
  ADD_MEMBER_TO_SPACE: 'ADDED_MEMBER_TO_SPACE',
  REMOVE_MEMBER_FROM_SPACE: 'REMOVED_MEMBER_FROM_SPACE',
  YOU_WERE_ADDED_TO_SPACE: 'YOU_WERE_ADDED_TO_SPACE',

  // Project
  UPDATE_PROJECT: 'UPDATED_PROJECT',
  YOU_WERE_ADDED_TO_PROJECT: 'YOU_WERE_ADDED_TO_PROJECT',
  YOU_WERE_REMOVED_FROM_PROJECT: 'YOU_WERE_REMOVED_FROM_PROJECT',

  // Project Member
  ADD_MEMBER_TO_PROJECT: 'ADDED_MEMBER_TO_PROJECT',
  REMOVE_MEMBER_FROM_PROJECT: 'REMOVED_MEMBER_FROM_PROJECT',

  // Task
  UPDATE_TASK: 'UPDATED_TASK',
  YOU_WERE_ASSIGNED_TASK: 'YOU_WERE_ASSIGNED_TASK',
  TASK_STATUS_CHANGED: 'TASK_STATUS_CHANGED',
};

// Format notification message based on type and data
export const formatNotificationMessage = (notification) => {
  console.log('🎨 Formatting notification:', {
    type: notification.type,
    actorName: notification.actorName,
    data: notification.data,
    fullNotification: notification
  });

  const { type, data, actorName } = notification;
  const actor = actorName
  console.log('🎨 Final actor name:', actor);

  switch (type) {
    // Space notifications
    case NotificationType.UPDATE_SPACE:
      return `${actor} updated space "${data.spaceName || 'a space'}"`;

    case NotificationType.ADD_MEMBER_TO_SPACE:
      return `${actor} added ${data.newMemberName || 'a member'} to space "${data.spaceName}"`;

    case NotificationType.YOU_WERE_ADDED_TO_SPACE:
      return `${actor} added ${data.newMemberName || 'a member'} to space "${data.spaceName}"`;

    case NotificationType.REMOVE_MEMBER_FROM_SPACE:
      return `${actor} removed ${data.removedMemberName || 'a member'} from space "${data.spaceName}"`;

    // Project notifications
    
    case NotificationType.UPDATE_PROJECT:
      return `${actor} updated project "${data.projectName || 'a project'}"`;

    
    case NotificationType.YOU_WERE_ADDED_TO_PROJECT:
      return `${actor} added ${data.newMemberName || 'a member'} to project "${data.projectName}"`;

    case NotificationType.YOU_WERE_REMOVED_FROM_PROJECT:
      return `${actor} removed ${data.removedMemberName || 'a member'} from project "${data.projectName}"`;

    case NotificationType.ADD_MEMBER_TO_PROJECT:
      return `${actor} added ${data.newMemberName || 'a member'} to project "${data.projectName}"`;

    case NotificationType.REMOVE_MEMBER_FROM_PROJECT:
      return `${actor} removed ${data.removedMemberName || 'a member'} from project "${data.projectName}"`;

    // Task notifications

    case NotificationType.UPDATE_TASK:
      return `${actor} updated task "${data.taskTitle}"`;


    case NotificationType.YOU_WERE_ASSIGNED_TASK:
      return `${actor} assigned task "${data.taskTitle}" to ${data.assigneeName}`;

    case NotificationType.TASK_STATUS_CHANGED:
      return `${actor} changed status of task "${data.taskTitle}" to ${data.newStatus}`;

    default:
      return `${actor} performed an action`;
  }
};

// Get notification icon based on type
export const getNotificationIcon = (type) => {
  switch (type) {
    case NotificationType.UPDATE_SPACE:
    case NotificationType.ADD_MEMBER_TO_SPACE:
    case NotificationType.YOU_WERE_ADDED_TO_SPACE:
    case NotificationType.REMOVE_MEMBER_FROM_SPACE:
      return 'building';

    case NotificationType.UPDATE_PROJECT:
    case NotificationType.YOU_WERE_ADDED_TO_PROJECT:
    case NotificationType.YOU_WERE_REMOVED_FROM_PROJECT:
    case NotificationType.ADD_MEMBER_TO_PROJECT:
    case NotificationType.REMOVE_MEMBER_FROM_PROJECT:
      return 'folder';

    // case NotificationType.CREATE_TASK:
    case NotificationType.UPDATE_TASK:
    case NotificationType.DELETE_TASK:
    case NotificationType.YOU_WERE_ASSIGNED_TASK:
    case NotificationType.TASK_STATUS_CHANGED:
      return 'tasks';

    default:
      return 'bell';
  }
};

// Get notification color based on type
export const getNotificationColor = (type) => {
  switch (type) {
    case NotificationType.CREATE_SPACE:
    case NotificationType.CREATE_PROJECT:
    case NotificationType.CREATE_TASK:
      return 'text-green-600';

    case NotificationType.DELETE_SPACE:
    case NotificationType.DELETE_PROJECT:
    case NotificationType.DELETE_TASK:
    case NotificationType.YOU_WERE_REMOVED_FROM_SPACE:
    case NotificationType.YOU_WERE_REMOVED_FROM_PROJECT:
    case NotificationType.REMOVE_MEMBER_FROM_SPACE:
    case NotificationType.REMOVE_MEMBER_FROM_PROJECT:
      return 'text-red-600';

    case NotificationType.YOU_WERE_ADDED_TO_SPACE:
    case NotificationType.YOU_WERE_ADDED_TO_PROJECT:
    case NotificationType.YOU_WERE_ASSIGNED_TASK:
    case NotificationType.ADD_MEMBER_TO_SPACE:
    case NotificationType.ADD_MEMBER_TO_PROJECT:
      return 'text-blue-600';

    case NotificationType.UPDATE_SPACE:
    case NotificationType.UPDATE_PROJECT:
    case NotificationType.UPDATE_TASK:
    case NotificationType.TASK_STATUS_CHANGED:
      return 'text-yellow-600';

    default:
      return 'text-gray-600';
  }
};

// Format time ago
export const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};

// Check if notification is recent (within last 24 hours)
export const isRecentNotification = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  return diffInHours < 24;
};
