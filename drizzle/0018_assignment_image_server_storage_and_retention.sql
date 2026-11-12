ALTER TABLE assignment_images ADD COLUMN storage_backend text NOT NULL DEFAULT 'r2'
  CONSTRAINT assignment_images_storage_backend_check CHECK (storage_backend IN ('r2', 'filesystem'));
--> statement-breakpoint
ALTER TABLE assignments ADD COLUMN created_at text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE assignments ADD COLUMN completed_at text;
--> statement-breakpoint
UPDATE assignments SET created_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE created_at='';
--> statement-breakpoint
UPDATE assignments SET completed_at=COALESCE(
  (
    SELECT COALESCE(s.feedback_at,s.created_at)
    FROM submissions s
    WHERE s.assignment_id=assignments.id
    ORDER BY julianday(s.created_at) DESC,s.id DESC
    LIMIT 1
  ),
  strftime('%Y-%m-%dT%H:%M:%fZ','now')
)
WHERE topic_id IS NULL AND student_id IS NOT NULL AND completed_at IS NULL
  AND (
    SELECT json_extract(s.result,'$.status')
    FROM submissions s
    WHERE s.assignment_id=assignments.id
    ORDER BY julianday(s.created_at) DESC,s.id DESC
    LIMIT 1
  ) IN ('passed','failed','needs_work');
