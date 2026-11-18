import type {Notice} from './domain.ts';

export function hasUnreadNotifications(notifications: Pick<Notice, 'read'>[]) {
  return notifications.some(notification => !notification.read);
}

export function markNotificationsRead(notifications: Notice[]) {
  return notifications.map(notification => notification.read ? notification : {...notification, read: 1});
}
