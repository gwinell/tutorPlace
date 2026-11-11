ALTER TABLE `topics` ADD `parent_topic_id` text;
--> statement-breakpoint
ALTER TABLE `topics` ADD `github_url` text;
--> statement-breakpoint
CREATE INDEX `topics_course_parent_position_idx` ON `topics` (`course_id`,`parent_topic_id`,`position`);
--> statement-breakpoint
CREATE TABLE `lesson_preparation_items` (
	`id` text PRIMARY KEY NOT NULL,
	`lesson_id` text NOT NULL,
	`kind` text NOT NULL,
	`topic_id` text,
	`assignment_id` text,
	`position` integer DEFAULT 0 NOT NULL,
	`completed_at` text,
	CONSTRAINT "lesson_preparation_target_check" CHECK(("lesson_preparation_items"."kind"='topic' AND "lesson_preparation_items"."topic_id" IS NOT NULL AND "lesson_preparation_items"."assignment_id" IS NULL) OR ("lesson_preparation_items"."kind"='assignment' AND "lesson_preparation_items"."assignment_id" IS NOT NULL AND "lesson_preparation_items"."topic_id" IS NULL))
);
--> statement-breakpoint
CREATE INDEX `lesson_preparation_lesson_position_idx` ON `lesson_preparation_items` (`lesson_id`,`position`);
--> statement-breakpoint
CREATE UNIQUE INDEX `lesson_preparation_topic_unique` ON `lesson_preparation_items` (`lesson_id`,`topic_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `lesson_preparation_assignment_unique` ON `lesson_preparation_items` (`lesson_id`,`assignment_id`);
--> statement-breakpoint
CREATE TRIGGER `topics_parent_insert_guard` BEFORE INSERT ON `topics`
WHEN NEW.`parent_topic_id` IS NOT NULL AND NOT EXISTS (
  SELECT 1 FROM `topics` WHERE `id`=NEW.`parent_topic_id` AND `course_id`=NEW.`course_id` AND `parent_topic_id` IS NULL
)
BEGIN SELECT RAISE(ABORT, 'topic parent must be a root in the same course'); END;
--> statement-breakpoint
CREATE TRIGGER `topics_parent_update_guard` BEFORE UPDATE OF `parent_topic_id`,`course_id` ON `topics`
WHEN NEW.`parent_topic_id` IS NOT NULL AND NOT EXISTS (
  SELECT 1 FROM `topics` WHERE `id`=NEW.`parent_topic_id` AND `course_id`=NEW.`course_id` AND `parent_topic_id` IS NULL
)
BEGIN SELECT RAISE(ABORT, 'topic parent must be a root in the same course'); END;
--> statement-breakpoint
CREATE TRIGGER `lesson_preparation_lesson_insert_guard` BEFORE INSERT ON `lesson_preparation_items`
WHEN NOT EXISTS (SELECT 1 FROM `lessons` WHERE `id`=NEW.`lesson_id` AND `student_id` IS NOT NULL)
BEGIN SELECT RAISE(ABORT, 'preparation item requires a student lesson'); END;
--> statement-breakpoint
CREATE TRIGGER `lesson_preparation_lesson_update_guard` BEFORE UPDATE OF `lesson_id` ON `lesson_preparation_items`
WHEN NOT EXISTS (SELECT 1 FROM `lessons` WHERE `id`=NEW.`lesson_id` AND `student_id` IS NOT NULL)
BEGIN SELECT RAISE(ABORT, 'preparation item requires a student lesson'); END;
--> statement-breakpoint
CREATE TRIGGER `lesson_preparation_target_insert_guard` BEFORE INSERT ON `lesson_preparation_items`
WHEN (NEW.`topic_id` IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `topics` WHERE `id`=NEW.`topic_id`)) OR (NEW.`assignment_id` IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `assignments` WHERE `id`=NEW.`assignment_id`))
BEGIN SELECT RAISE(ABORT, 'preparation target does not exist'); END;
--> statement-breakpoint
CREATE TRIGGER `lesson_preparation_target_update_guard` BEFORE UPDATE OF `topic_id`,`assignment_id` ON `lesson_preparation_items`
WHEN (NEW.`topic_id` IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `topics` WHERE `id`=NEW.`topic_id`)) OR (NEW.`assignment_id` IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `assignments` WHERE `id`=NEW.`assignment_id`))
BEGIN SELECT RAISE(ABORT, 'preparation target does not exist'); END;
