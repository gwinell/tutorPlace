ALTER TABLE `lessons` ADD `jazz_room_needs_recreation` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `lessons` ADD `cancelled_by` text;--> statement-breakpoint
CREATE INDEX `lessons_student_idx` ON `lessons` (`student_id`);--> statement-breakpoint
CREATE INDEX `lessons_start_idx` ON `lessons` (`start`);--> statement-breakpoint
CREATE INDEX `lessons_jazz_room_idx` ON `lessons` (`jazz_room_id`);--> statement-breakpoint
CREATE INDEX `lessons_cancellation_month_idx` ON `lessons` (`student_id`,`cancelled_at`);--> statement-breakpoint
CREATE INDEX `sessions_expires_at_idx` ON `sessions` (`expires_at`);