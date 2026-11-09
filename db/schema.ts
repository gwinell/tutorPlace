import { sqliteTable, text, integer, index, uniqueIndex, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(), login: text('login').notNull().unique(), password: text('password').notNull(),
  name: text('name').notNull(), role: text('role').notNull(), age: integer('age'), parentName: text('parent_name'),
  phone: text('phone'), parentPhone: text('parent_phone'), balance: integer('balance').notNull().default(0), createdAt: text('created_at').notNull(),
});
export const sessions = sqliteTable('sessions', { id: text('id').primaryKey(), userId: text('user_id').notNull(), expiresAt: integer('expires_at').notNull() }, t => [index('sessions_expires_at_idx').on(t.expiresAt)]);
export const settings = sqliteTable('settings', { key: text('key').primaryKey(), value: text('value').notNull() });
export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(), studentId: text('student_id'), name: text('name').notNull(), phone: text('phone'),
  start: text('start').notNull(), end: text('end').notNull(), type: text('type').notNull(), status: text('status').notNull(),
  eventId: text('event_id'), meetUrl: text('meet_url'), jazzRoomId: text('jazz_room_id'), jazzRoomNeedsRecreation: integer('jazz_room_needs_recreation').notNull().default(0), topic: text('topic'), cancelledAt: text('cancelled_at'), cancelledBy: text('cancelled_by'), charged: integer('charged').default(0),
  trialPhone: text('trial_phone'), operationStartedAt: text('operation_started_at'),
  privacyConsentAt: text('privacy_consent_at'), privacyPolicyVersion: text('privacy_policy_version'),
  moveId: text('move_id'), moveStart: text('move_start'), moveEnd: text('move_end'),
}, t => [
  index('lessons_trial_phone_idx').on(t.trialPhone),
  index('lessons_student_idx').on(t.studentId),
  index('lessons_start_idx').on(t.start),
  index('lessons_jazz_room_idx').on(t.jazzRoomId),
  index('lessons_cancellation_month_idx').on(t.studentId, t.cancelledAt),
]);
export const trialBookingLimits = sqliteTable('trial_booking_limits', {
  client: text('client').primaryKey(),
  windowStart: integer('window_start').notNull(),
  attempts: integer('attempts').notNull(),
});
export const slotLocks = sqliteTable('slot_locks', { slot: text('slot').primaryKey(), lessonId: text('lesson_id').notNull() });
export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(), title: text('title').notNull(), description: text('description'),
  position: integer('position').default(0).notNull(),
});
export const courseEnrollments = sqliteTable('course_enrollments', {
  id: text('id').primaryKey(), courseId: text('course_id').notNull(), studentId: text('student_id').notNull(),
}, t => [uniqueIndex('course_enrollment_unique').on(t.courseId, t.studentId)]);
export const topics = sqliteTable('topics', {
  id: text('id').primaryKey(), courseId: text('course_id').notNull(), title: text('title').notNull(), description: text('description'), position: integer('position').default(0),
  content: text('content').notNull(), format: text('format').notNull(), colabUrl: text('colab_url'),
});
export const access = sqliteTable('topic_access', { id: text('id').primaryKey(), topicId: text('topic_id').notNull(), studentId: text('student_id').notNull() }, t => [uniqueIndex('access_unique').on(t.topicId, t.studentId)]);
export const assignments = sqliteTable('assignments', {
  id: text('id').primaryKey(), topicId: text('topic_id'), studentId: text('student_id'), lessonId: text('lesson_id'), title: text('title').notNull(),
  kind: text('kind').notNull(), prompt: text('prompt').notNull(), options: text('options'), answer: text('answer'), tests: text('tests'),
}, t => [check('assignment_target_check', sql`(${t.topicId} IS NOT NULL AND ${t.studentId} IS NULL) OR (${t.topicId} IS NULL AND ${t.studentId} IS NOT NULL)`)]);
export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey(), assignmentId: text('assignment_id').notNull(), studentId: text('student_id').notNull(),
  content: text('content').notNull(), result: text('result').notNull(), createdAt: text('created_at').notNull(),
  feedback: text('feedback'), feedbackAt: text('feedback_at'),
});
export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey(), studentId: text('student_id').notNull(), name: text('name').notNull(), language: text('language').notNull(),
  studentCode: text('student_code').notNull(), teacherCode: text('teacher_code').notNull(), revision: integer('revision').default(0).notNull(),
  studentState: text('student_state'), teacherState: text('teacher_state'),
  lastActive: integer('last_active').notNull(),
});
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(), studentId: text('student_id').notNull(), title: text('title').notNull(), body: text('body').notNull(),
  createdAt: text('created_at').notNull(), read: integer('read').default(0),
});
export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(), name: text('name').notNull(), body: text('body').notNull(), rating: integer('rating').notNull(), published: integer('published').default(0),
});
