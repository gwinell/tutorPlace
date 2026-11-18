import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reportRoomTypingActivity, shouldTouchRoomActivity, ROOM_ACTIVITY_TOUCH_INTERVAL_MS } from '../lib/room-activity.ts';

test('Набор текста обновляет активность комнаты только при изменении текста', () => {
  let updates = 0;
  const onActivity = () => { updates += 1; };

  reportRoomTypingActivity('', 'a', onActivity);
  reportRoomTypingActivity('a', 'a', onActivity);
  reportRoomTypingActivity('a', 'ab', onActivity);

  assert.equal(updates, 2);
});

test('Heartbeat комнаты отправляется сразу и затем не чаще одного раза за пять минут', () => {
  const firstActivity = 1_000_000;
  assert.equal(shouldTouchRoomActivity(0, firstActivity), true);
  assert.equal(shouldTouchRoomActivity(firstActivity, firstActivity + ROOM_ACTIVITY_TOUCH_INTERVAL_MS - 1), false);
  assert.equal(shouldTouchRoomActivity(firstActivity, firstActivity + ROOM_ACTIVITY_TOUCH_INTERVAL_MS), true);
});
