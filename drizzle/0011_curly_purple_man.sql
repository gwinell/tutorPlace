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
