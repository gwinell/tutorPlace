CREATE TABLE `trial_booking_limits` (
	`client` text PRIMARY KEY NOT NULL,
	`window_start` integer NOT NULL,
	`attempts` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `lessons` ADD `trial_phone` text;--> statement-breakpoint
ALTER TABLE `lessons` ADD `move_id` text;--> statement-breakpoint
ALTER TABLE `lessons` ADD `move_start` text;--> statement-breakpoint
ALTER TABLE `lessons` ADD `move_end` text;--> statement-breakpoint
CREATE INDEX `lessons_trial_phone_idx` ON `lessons` (`trial_phone`);
--> statement-breakpoint
-- Keep existing display values and allow migrations even if duplicate trials already exist.
WITH RECURSIVE phone_digits(id, raw_phone, remaining, digits) AS (
  SELECT id, phone, phone, '' FROM lessons WHERE type = 'trial' AND phone IS NOT NULL
  UNION ALL
  SELECT id, raw_phone, substr(remaining, 2), digits ||
    CASE WHEN substr(remaining, 1, 1) GLOB '[0-9]' THEN substr(remaining, 1, 1) ELSE '' END
  FROM phone_digits WHERE remaining <> ''
), normalized AS (
  SELECT id, CASE
    WHEN substr(raw_phone, 1, 1) = '+' AND length(digits) BETWEEN 8 AND 15
      AND substr(digits, 1, 1) BETWEEN '1' AND '9'
      AND (substr(digits, 1, 1) <> '7' OR length(digits) = 11) THEN '+' || digits
    WHEN substr(raw_phone, 1, 1) <> '+' AND length(digits) = 10 THEN '+7' || digits
    WHEN substr(raw_phone, 1, 1) <> '+' AND length(digits) = 11
      AND substr(digits, 1, 1) IN ('7', '8') THEN '+7' || substr(digits, 2)
  END AS canonical FROM phone_digits WHERE remaining = ''
)
UPDATE lessons SET trial_phone = normalized.canonical
FROM normalized WHERE lessons.id = normalized.id AND normalized.canonical IS NOT NULL;
