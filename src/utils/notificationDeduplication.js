export const deduplicateNotifications = (notifications) => {
  if (!Array.isArray(notifications)) {
    return [];
  }

  const seen = new Set();
  const deduplicated = [];

  for (const notification of notifications) {
    // Skip if no ID
    if (!notification._id) {
      continue;
    }

    // Check for exact ID duplicates
    if (seen.has(notification._id)) {
      continue;
    }

    // Check for similar notifications (same type, same target, within 5 seconds)
    const similarKey = `${notification.type}-${notification.data?.taskId || ''}-${notification.data?.projectId || ''}-${notification.data?.spaceId || ''}-${Math.floor(new Date(notification.createdAt).getTime() / 5000)}`;

    if (seen.has(similarKey)) {
      continue;
    }

    seen.add(notification._id);
    seen.add(similarKey);
    deduplicated.push(notification);
  }

  return deduplicated;
};

export const isDuplicateNotification = (newNotification, existingNotifications) => {
  if (!newNotification || !Array.isArray(existingNotifications)) {
    return false;
  }

  // Check for exact ID match
  if (existingNotifications.some(n => n._id === newNotification._id)) {
    return true;
  }

  // Check for similar notifications within last 5 seconds
  const fiveSecondsAgo = new Date(Date.now() - 5000);
  const similarExists = existingNotifications.some(n => 
    n.type === newNotification.type &&
    n.data?.taskId === newNotification.data?.taskId &&
    n.data?.projectId === newNotification.data?.projectId &&
    n.data?.spaceId === newNotification.data?.spaceId &&
    n.actorId === newNotification.actorId &&
    new Date(n.createdAt) > fiveSecondsAgo
  );

  return similarExists;
};

export const cleanOldNotifications = (notifications, maxAge = 24, maxCount = 100) => {
  if (!Array.isArray(notifications)) {
    return [];
  }

  const maxAgeMs = maxAge * 60 * 60 * 1000;
  const cutoffTime = new Date(Date.now() - maxAgeMs);

  // Filter by age and sort by creation time (newest first)
  const filtered = notifications
    .filter(n => new Date(n.createdAt) > cutoffTime)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, maxCount);

  return filtered;
};


export const groupNotifications = (notifications) => {
  if (!Array.isArray(notifications)) {
    return {};
  }

  const groups = {};

  for (const notification of notifications) {
    const groupKey = `${notification.type}-${notification.data?.taskId || notification.data?.projectId || notification.data?.spaceId || 'general'}`;
    
    if (!groups[groupKey]) {
      groups[groupKey] = {
        type: notification.type,
        target: notification.data?.taskTitle || notification.data?.projectName || notification.data?.spaceName || 'Unknown',
        notifications: [],
        latestTime: notification.createdAt,
        count: 0
      };
    }

    groups[groupKey].notifications.push(notification);
    groups[groupKey].count++;
    
    // Update latest time if this notification is newer
    if (new Date(notification.createdAt) > new Date(groups[groupKey].latestTime)) {
      groups[groupKey].latestTime = notification.createdAt;
    }
  }

  return groups;
};

export const mergeSimilarNotifications = (notifications) => {
  if (!Array.isArray(notifications) || notifications.length <= 1) {
    return notifications;
  }

  const groups = groupNotifications(notifications);
  const merged = [];

  for (const [groupKey, group] of Object.entries(groups)) {
    if (group.count === 1) {
      // Single notification, keep as is
      merged.push(group.notifications[0]);
    } else {
      // Multiple similar notifications, create summary
      const latest = group.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      const summary = {
        ...latest,
        _id: `summary-${groupKey}-${Date.now()}`,
        isSummary: true,
        summaryCount: group.count,
        summaryNotifications: group.notifications,
        createdAt: group.latestTime
      };
      merged.push(summary);
    }
  }

  // Sort by creation time (newest first)
  return merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
