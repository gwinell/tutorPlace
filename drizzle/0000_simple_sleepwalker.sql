CREATE TABLE `topic_access` (
	`id` text PRIMARY KEY NOT NULL,
	`topic_id` text NOT NULL,
	`student_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_unique` ON `topic_access` (`topic_id`,`student_id`);--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`topic_id` text NOT NULL,
	`lesson_id` text,
	`title` text NOT NULL,
	`kind` text NOT NULL,
	`prompt` text NOT NULL,
	`options` text,
	`answer` text,
	`tests` text
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text,
	`name` text NOT NULL,
	`phone` text,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`event_id` text,
	`meet_url` text,
	`topic` text,
	`cancelled_at` text,
	`charged` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	`read` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`body` text NOT NULL,
	`rating` integer NOT NULL,
	`published` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`name` text NOT NULL,
	`language` text NOT NULL,
	`student_code` text NOT NULL,
	`teacher_code` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`last_active` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `slot_locks` (
	`slot` text PRIMARY KEY NOT NULL,
	`lesson_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`assignment_id` text NOT NULL,
	`student_id` text NOT NULL,
	`content` text NOT NULL,
	`result` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`position` integer DEFAULT 0,
	`content` text NOT NULL,
	`format` text NOT NULL,
	`colab_url` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`login` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`age` integer,
	`parent_name` text,
	`phone` text,
	`parent_phone` text,
	`balance` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_login_unique` ON `users` (`login`);