ALTER TABLE users ADD COLUMN is_platform_admin integer NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN registration_status text NOT NULL DEFAULT 'active';
ALTER TABLE users ADD COLUMN email text;
CREATE UNIQUE INDEX users_email_unique ON users(email) WHERE email IS NOT NULL;
ALTER TABLE lessons ADD COLUMN tutor_id text;
ALTER TABLE courses ADD COLUMN tutor_id text;
CREATE INDEX lessons_tutor_start_idx ON lessons(tutor_id,start);
CREATE INDEX courses_tutor_position_idx ON courses(tutor_id,position);

UPDATE users
SET is_platform_admin=1
WHERE id=(SELECT id FROM users WHERE role='teacher' ORDER BY created_at LIMIT 1);

CREATE TABLE tutor_profiles (
  tutor_id text PRIMARY KEY,
  headline text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  subjects_json text NOT NULL DEFAULT '[]',
  experience text NOT NULL DEFAULT '',
  qualification text NOT NULL DEFAULT '',
  portrait_url text,
  price_per_lesson integer NOT NULL DEFAULT 1000,
  published integer NOT NULL DEFAULT 0,
  approved integer NOT NULL DEFAULT 0,
  created_at text NOT NULL,
  updated_at text NOT NULL
);

INSERT INTO tutor_profiles (tutor_id,headline,bio,subjects_json,experience,qualification,portrait_url,price_per_lesson,published,approved,created_at,updated_at)
SELECT id,'Репетитор по информатике и Python','Индивидуальные онлайн-занятия по информатике, Python и подготовке к экзаменам.','["Информатика","Python","ОГЭ","ЕГЭ"]','', '','/tutor-1024.webp',price_per_lesson,1,1,created_at,created_at
FROM users WHERE role='teacher';

UPDATE lessons
SET tutor_id=(SELECT id FROM users WHERE role='teacher' ORDER BY created_at LIMIT 1)
WHERE tutor_id IS NULL;

UPDATE courses
SET tutor_id=(SELECT id FROM users WHERE role='teacher' ORDER BY created_at LIMIT 1)
WHERE tutor_id IS NULL;

CREATE TABLE tutor_students (
  tutor_id text NOT NULL,
  student_id text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK(status IN ('active','invited','archived')),
  created_at text NOT NULL,
  PRIMARY KEY(tutor_id,student_id)
);
INSERT OR IGNORE INTO tutor_students(tutor_id,student_id,status,created_at)
SELECT DISTINCT tutor_id,student_id,'active',CURRENT_TIMESTAMP FROM lessons WHERE tutor_id IS NOT NULL AND student_id IS NOT NULL;
INSERT OR IGNORE INTO tutor_students(tutor_id,student_id,status,created_at)
SELECT (SELECT id FROM users WHERE role='teacher' ORDER BY created_at LIMIT 1),id,'active',created_at
FROM users WHERE role='student' AND EXISTS (SELECT 1 FROM users WHERE role='teacher');

CREATE TABLE tutor_settings (
  tutor_id text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  PRIMARY KEY(tutor_id,key)
);
CREATE TABLE tutor_slot_locks (
  tutor_id text NOT NULL,
  slot text NOT NULL,
  lesson_id text NOT NULL,
  PRIMARY KEY(tutor_id,slot)
);
CREATE INDEX tutor_slot_locks_lesson_idx ON tutor_slot_locks(lesson_id);
CREATE TRIGGER tutor_slot_locks_cleanup AFTER DELETE ON lessons BEGIN
  DELETE FROM tutor_slot_locks WHERE lesson_id=OLD.id;
END;

CREATE TABLE lesson_payments (
  id text PRIMARY KEY,
  lesson_id text NOT NULL UNIQUE,
  tutor_id text NOT NULL,
  student_id text NOT NULL,
  amount_rub integer NOT NULL CHECK(amount_rub BETWEEN 1 AND 1000000),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','failed','refunded')),
  adapter text NOT NULL DEFAULT 'local',
  created_at text NOT NULL,
  updated_at text NOT NULL
);
CREATE TABLE tutor_payouts (
  id text PRIMARY KEY,
  tutor_id text NOT NULL,
  payment_id text NOT NULL,
  amount_rub integer NOT NULL CHECK(amount_rub BETWEEN 1 AND 1000000),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','simulated','reversed')),
  created_at text NOT NULL,
  updated_at text NOT NULL
);

CREATE TABLE conversations (
  id text PRIMARY KEY,
  tutor_id text NOT NULL,
  student_id text NOT NULL,
  created_at text NOT NULL,
  updated_at text NOT NULL,
  UNIQUE(tutor_id,student_id)
);
INSERT INTO conversations(id,tutor_id,student_id,created_at,updated_at)
SELECT lower(hex(randomblob(16))),tutor_id,student_id,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
FROM tutor_students WHERE status='active';
CREATE TABLE conversation_messages (
  id text PRIMARY KEY,
  conversation_id text NOT NULL,
  author_id text NOT NULL,
  body text NOT NULL,
  created_at text NOT NULL,
  read_at text
);
CREATE INDEX conversation_messages_order_idx ON conversation_messages(conversation_id,created_at);

CREATE TABLE support_tickets (
  id text PRIMARY KEY,
  requester_id text NOT NULL,
  assigned_support_id text,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','waiting','closed')),
  created_at text NOT NULL,
  updated_at text NOT NULL
);
CREATE TABLE support_messages (
  id text PRIMARY KEY,
  ticket_id text NOT NULL,
  author_id text NOT NULL,
  body text NOT NULL,
  created_at text NOT NULL
);
CREATE INDEX support_messages_order_idx ON support_messages(ticket_id,created_at);
CREATE TABLE support_chat_access (
  id text PRIMARY KEY,
  ticket_id text NOT NULL,
  conversation_id text NOT NULL,
  support_id text NOT NULL,
  requested_by text NOT NULL,
  purpose text NOT NULL DEFAULT '',
  consented_by text,
  consented_at text,
  denied_at text,
  expires_at integer,
  revoked_at text,
  created_at text NOT NULL
);
CREATE TABLE support_access_audit (
  id text PRIMARY KEY,
  access_id text NOT NULL,
  support_id text NOT NULL,
  action text NOT NULL CHECK(action IN ('requested','consented','viewed','denied','revoked','expired')),
  created_at text NOT NULL
);
