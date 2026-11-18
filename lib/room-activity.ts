export const ROOM_ACTIVITY_TOUCH_INTERVAL_MS = 5 * 60_000;

export function shouldTouchRoomActivity(lastTouchAt: number, activityAt: number) {
  return lastTouchAt === 0 || activityAt - lastTouchAt >= ROOM_ACTIVITY_TOUCH_INTERVAL_MS;
}

export function reportRoomTypingActivity(previous: string, next: string, onActivity: () => void) {
  if (previous !== next) onActivity();
}
