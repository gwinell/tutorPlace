import { sqliteTable, text, integer, real, index, uniqueIndex, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(), login: text('login').notNull().unique(), password: text('password').notNull(),
  name: text('name').notNull(), role: text('role').notNull(), age: integer('age'), parentName: text('parent_name'),
  phone: text('phone'), parentPhone: text('parent_phone'), balance: integer('balance').notNull().default(0),
  pricePerLesson: integer('price_per_lesson').notNull().default(1000), createdAt: text('created_at').notNull(),
});
export const sessions = sqliteTable('sessions', { id: text('id').primaryKey(), userId: text('user_id').notNull(), expiresAt: integer('expires_at').notNull() }, t => [index('sessions_expires_at_idx').on(t.expiresAt)]);
export const settings = sqliteTable('settings', { key: text('key').primaryKey(), value: text('value').notNull() });
export const paymentRequests = sqliteTable('payment_requests', {
  id: text('id').primaryKey(), studentId: text('student_id').notNull(), amountRub: integer('amount_rub').notNull(),
  pricePerLesson: integer('price_per_lesson').notNull(), comment: text('comment'), status: text('status').notNull().default('pending'),
  creditedLessons: integer('credited_lessons'), reviewNote: text('review_note'), reviewedBy: text('reviewed_by'),
  createdAt: text('created_at').notNull(), reviewedAt: text('reviewed_at'),
}, t => [
  check('payment_requests_amount_check', sql`${t.amountRub} BETWEEN 1 AND 1000000`),
  check('payment_requests_price_check', sql`${t.pricePerLesson} BETWEEN 1 AND 1000000`),
  check('payment_requests_status_check', sql`${t.status} IN ('pending', 'approved', 'rejected')`),
  check('payment_requests_credits_check', sql`${t.creditedLessons} IS NULL OR ${t.creditedLessons} BETWEEN 1 AND 100`),
  index('payment_requests_student_created_idx').on(t.studentId, t.createdAt),
  index('payment_requests_status_created_idx').on(t.status, t.createdAt),
]);
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
  index('lessons_status_operation_started_at_idx').on(t.status, t.operationStartedAt),
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
  parentTopicId: text('parent_topic_id'), githubUrl: text('github_url'),
}, t => [index('topics_course_parent_position_idx').on(t.courseId, t.parentTopicId, t.position)]);
export const access = sqliteTable('topic_access', { id: text('id').primaryKey(), topicId: text('topic_id').notNull(), studentId: text('student_id').notNull() }, t => [uniqueIndex('access_unique').on(t.topicId, t.studentId)]);
export const assignments = sqliteTable('assignments', {
  id: text('id').primaryKey(), topicId: text('topic_id'), studentId: text('student_id'), lessonId: text('lesson_id'), title: text('title').notNull(),
  kind: text('kind').notNull(), prompt: text('prompt').notNull(), options: text('options'), answer: text('answer'), tests: text('tests'),
}, t => [check('assignment_target_check', sql`(${t.topicId} IS NOT NULL AND ${t.studentId} IS NULL) OR (${t.topicId} IS NULL AND ${t.studentId} IS NOT NULL)`)]);
export const assignmentImages = sqliteTable('assignment_images', {
  id: text('id').primaryKey(), assignmentId: text('assignment_id').notNull(), objectKey: text('object_key').notNull().unique(),
  contentType: text('content_type').notNull(), sizeBytes: integer('size_bytes').notNull(), originalName: text('original_name').notNull(), createdAt: text('created_at').notNull(),
}, t => [
  check('assignment_images_type_check', sql`${t.contentType} IN ('image/jpeg', 'image/png', 'image/gif', 'image/webp')`),
  check('assignment_images_size_check', sql`${t.sizeBytes} BETWEEN 1 AND 8388608`),
  index('assignment_images_assignment_created_idx').on(t.assignmentId, t.createdAt),
]);
export const lessonPreparationItems = sqliteTable('lesson_preparation_items', {
  id: text('id').primaryKey(), lessonId: text('lesson_id').notNull(), kind: text('kind').notNull(),
  topicId: text('topic_id'), assignmentId: text('assignment_id'), position: integer('position').notNull().default(0), completedAt: text('completed_at'),
}, t => [
  check('lesson_preparation_target_check', sql`(${t.kind}='topic' AND ${t.topicId} IS NOT NULL AND ${t.assignmentId} IS NULL) OR (${t.kind}='assignment' AND ${t.assignmentId} IS NOT NULL AND ${t.topicId} IS NULL)`),
  index('lesson_preparation_lesson_position_idx').on(t.lessonId, t.position),
  uniqueIndex('lesson_preparation_topic_unique').on(t.lessonId, t.topicId),
  uniqueIndex('lesson_preparation_assignment_unique').on(t.lessonId, t.assignmentId),
]);
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
}, t => [index('rooms_last_active_idx').on(t.lastActive)]);
export const typingResults = sqliteTable('typing_results', {
  id: text('id').primaryKey(), studentId: text('student_id').notNull(), roomId: text('room_id').notNull(),
  language: text('language').notNull(), exerciseId: text('exercise_id').notNull(), wpm: integer('wpm').notNull(),
  accuracy: real('accuracy').notNull(), durationMs: integer('duration_ms').notNull(), createdAt: text('created_at').notNull(),
}, t => [
  check('typing_results_language_check', sql`${t.language} IN ('ru', 'en')`),
  check('typing_results_wpm_check', sql`${t.wpm} BETWEEN 0 AND 250`),
  check('typing_results_accuracy_check', sql`${t.accuracy} BETWEEN 0 AND 100`),
  check('typing_results_duration_check', sql`${t.durationMs} BETWEEN 1 AND 900000`),
  index('typing_results_student_language_created_idx').on(t.studentId, t.language, t.createdAt),
]);
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(), studentId: text('student_id').notNull(), title: text('title').notNull(), body: text('body').notNull(),
  createdAt: text('created_at').notNull(), read: integer('read').default(0),
});
export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(), name: text('name').notNull(), body: text('body').notNull(), rating: integer('rating').notNull(), published: integer('published').default(0),
});
