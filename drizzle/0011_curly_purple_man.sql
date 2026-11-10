CREATE TABLE `payment_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`amount_rub` integer NOT NULL,
	`price_per_lesson` integer NOT NULL,
	`comment` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`credited_lessons` integer,
	`review_note` text,
	`reviewed_by` text,
	`created_at` text NOT NULL,
	`reviewed_at` text,
	CONSTRAINT "payment_requests_amount_check" CHECK("payment_requests"."amount_rub" BETWEEN 1 AND 1000000),
	CONSTRAINT "payment_requests_price_check" CHECK("payment_requests"."price_per_lesson" BETWEEN 1 AND 1000000),
	CONSTRAINT "payment_requests_status_check" CHECK("payment_requests"."status" IN ('pending', 'approved', 'rejected')),
	CONSTRAINT "payment_requests_credits_check" CHECK("payment_requests"."credited_lessons" IS NULL OR "payment_requests"."credited_lessons" BETWEEN 1 AND 100)
);
--> statement-breakpoint
CREATE INDEX `payment_requests_student_created_idx` ON `payment_requests` (`student_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `payment_requests_status_created_idx` ON `payment_requests` (`status`,`created_at`);--> statement-breakpoint
ALTER TABLE `users` ADD `price_per_lesson` integer DEFAULT 1000 NOT NULL;
--> statement-breakpoint
CREATE TRIGGER `payment_requests_student_insert_guard` BEFORE INSERT ON `payment_requests`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'payment request student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `payment_requests_student_update_guard` BEFORE UPDATE OF `student_id` ON `payment_requests`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'payment request student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `lessons_student_insert_guard` BEFORE INSERT ON `lessons`
WHEN NEW.`student_id` IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'lesson student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `lessons_student_update_guard` BEFORE UPDATE OF `student_id` ON `lessons`
WHEN NEW.`student_id` IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'lesson student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `sessions_user_insert_guard` BEFORE INSERT ON `sessions`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`user_id`)
BEGIN SELECT RAISE(ABORT, 'session user does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `sessions_user_update_guard` BEFORE UPDATE OF `user_id` ON `sessions`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`user_id`)
BEGIN SELECT RAISE(ABORT, 'session user does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `rooms_student_insert_guard` BEFORE INSERT ON `rooms`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'room student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `rooms_student_update_guard` BEFORE UPDATE OF `student_id` ON `rooms`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'room student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `typing_results_student_insert_guard` BEFORE INSERT ON `typing_results`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'typing result student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `typing_results_student_update_guard` BEFORE UPDATE OF `student_id` ON `typing_results`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'typing result student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `course_enrollments_student_insert_guard` BEFORE INSERT ON `course_enrollments`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'course enrollment student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `course_enrollments_student_update_guard` BEFORE UPDATE OF `student_id` ON `course_enrollments`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'course enrollment student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `topic_access_student_insert_guard` BEFORE INSERT ON `topic_access`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'topic access student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `topic_access_student_update_guard` BEFORE UPDATE OF `student_id` ON `topic_access`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'topic access student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `assignments_student_insert_guard` BEFORE INSERT ON `assignments`
WHEN NEW.`student_id` IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'assignment student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `assignments_student_update_guard` BEFORE UPDATE OF `student_id` ON `assignments`
WHEN NEW.`student_id` IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'assignment student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `submissions_student_insert_guard` BEFORE INSERT ON `submissions`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'submission student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `submissions_student_update_guard` BEFORE UPDATE OF `student_id` ON `submissions`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'submission student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `notifications_student_insert_guard` BEFORE INSERT ON `notifications`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'notification student does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `notifications_student_update_guard` BEFORE UPDATE OF `student_id` ON `notifications`
WHEN NOT EXISTS (SELECT 1 FROM `users` WHERE `id`=NEW.`student_id` AND `role`='student')
BEGIN SELECT RAISE(ABORT, 'notification student does not exist'); END;
