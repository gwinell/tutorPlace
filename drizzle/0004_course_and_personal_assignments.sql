CREATE TABLE `course_enrollments` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`student_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `course_enrollment_unique` ON `course_enrollments` (`course_id`,`student_id`);--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`position` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `courses` (`id`, `title`, `description`, `position`) VALUES ('course-python', 'Путь в Python', 'От первых программ к собственным проектам', 0);--> statement-breakpoint
CREATE TABLE `__new_topics` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`position` integer DEFAULT 0,
	`content` text NOT NULL,
	`format` text NOT NULL,
	`colab_url` text
);--> statement-breakpoint
INSERT INTO `__new_topics` (`id`,`course_id`,`title`,`description`,`position`,`content`,`format`,`colab_url`)
SELECT `id`,'course-python',`title`,`description`,`position`,`content`,`format`,`colab_url` FROM `topics`;--> statement-breakpoint
DROP TABLE `topics`;--> statement-breakpoint
ALTER TABLE `__new_topics` RENAME TO `topics`;--> statement-breakpoint
INSERT OR IGNORE INTO `course_enrollments` (`id`,`course_id`,`student_id`)
SELECT lower(hex(randomblob(16))), 'course-python', `topic_access`.`student_id`
FROM `topic_access` JOIN `topics` ON `topics`.`id` = `topic_access`.`topic_id` GROUP BY `topic_access`.`student_id`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`topic_id` text,
	`student_id` text,
	`lesson_id` text,
	`title` text NOT NULL,
	`kind` text NOT NULL,
	`prompt` text NOT NULL,
	`options` text,
	`answer` text,
	`tests` text,
	CONSTRAINT "assignment_target_check" CHECK(("__new_assignments"."topic_id" IS NOT NULL AND "__new_assignments"."student_id" IS NULL) OR ("__new_assignments"."topic_id" IS NULL AND "__new_assignments"."student_id" IS NOT NULL))
);
--> statement-breakpoint
INSERT INTO `__new_assignments`("id", "topic_id", "student_id", "lesson_id", "title", "kind", "prompt", "options", "answer", "tests") SELECT "id", "topic_id", NULL, "lesson_id", "title", "kind", "prompt", "options", "answer", "tests" FROM `assignments`;--> statement-breakpoint
DROP TABLE `assignments`;--> statement-breakpoint
ALTER TABLE `__new_assignments` RENAME TO `assignments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
