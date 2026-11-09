CREATE INDEX `lessons_status_operation_started_at_idx` ON `lessons` (`status`,`operation_started_at`);--> statement-breakpoint
CREATE INDEX `rooms_last_active_idx` ON `rooms` (`last_active`);