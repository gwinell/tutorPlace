CREATE TABLE `typing_results` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`room_id` text NOT NULL,
	`language` text NOT NULL,
	`exercise_id` text NOT NULL,
	`wpm` integer NOT NULL,
	`accuracy` real NOT NULL,
	`duration_ms` integer NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "typing_results_language_check" CHECK("typing_results"."language" IN ('ru', 'en')),
	CONSTRAINT "typing_results_wpm_check" CHECK("typing_results"."wpm" BETWEEN 0 AND 250),
	CONSTRAINT "typing_results_accuracy_check" CHECK("typing_results"."accuracy" BETWEEN 0 AND 100),
	CONSTRAINT "typing_results_duration_check" CHECK("typing_results"."duration_ms" BETWEEN 1 AND 900000)
);
--> statement-breakpoint
CREATE INDEX `typing_results_student_language_created_idx` ON `typing_results` (`student_id`,`language`,`created_at`);