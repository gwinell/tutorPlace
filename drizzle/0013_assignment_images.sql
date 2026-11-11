CREATE TABLE `assignment_images` (
	`id` text PRIMARY KEY NOT NULL,
	`assignment_id` text NOT NULL,
	`object_key` text NOT NULL,
	`content_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`original_name` text NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "assignment_images_type_check" CHECK("assignment_images"."content_type" IN ('image/jpeg', 'image/png', 'image/gif', 'image/webp')),
	CONSTRAINT "assignment_images_size_check" CHECK("assignment_images"."size_bytes" BETWEEN 1 AND 8388608)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assignment_images_object_key_unique` ON `assignment_images` (`object_key`);--> statement-breakpoint
CREATE INDEX `assignment_images_assignment_created_idx` ON `assignment_images` (`assignment_id`,`created_at`);