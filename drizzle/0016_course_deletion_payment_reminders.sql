ALTER TABLE notifications ADD COLUMN type text NOT NULL DEFAULT 'general' CONSTRAINT notifications_type_check CHECK (type IN ('general', 'payment_reminder'));
--> statement-breakpoint
ALTER TABLE notifications ADD COLUMN popup integer NOT NULL DEFAULT 0 CONSTRAINT notifications_popup_check CHECK (popup IN (0, 1));
--> statement-breakpoint
ALTER TABLE notifications ADD COLUMN popup_dismissed_at text;
--> statement-breakpoint
CREATE INDEX notifications_student_popup_idx ON notifications (student_id, popup, read, popup_dismissed_at, created_at);
