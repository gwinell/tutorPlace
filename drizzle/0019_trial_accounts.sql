ALTER TABLE `lessons` ADD `trial_goals` text;--> statement-breakpoint
ALTER TABLE `lessons` ADD `trial_comment` text;--> statement-breakpoint
ALTER TABLE `users` ADD `account_type` text DEFAULT 'regular' NOT NULL;