-- Aegis migration: replace email authentication with username authentication.
-- Run this ONCE in the existing Aiven defaultdb database using MySQL Workbench.
-- Existing prototype accounts receive a safe generated username in the form
-- pengguna-ID. New registrations use username, full name, display name, age.

ALTER TABLE users
  DROP INDEX uq_users_email,
  CHANGE COLUMN email username VARCHAR(32) NOT NULL;

UPDATE users
  SET username = CONCAT('pengguna-', id)
  WHERE username LIKE '%@%';

ALTER TABLE users
  ADD COLUMN full_name VARCHAR(150) NOT NULL DEFAULT 'Pengguna Aegis' AFTER username,
  ADD COLUMN display_name VARCHAR(80) NOT NULL DEFAULT 'Pengguna' AFTER full_name,
  ADD COLUMN age TINYINT UNSIGNED NOT NULL DEFAULT 18 AFTER display_name,
  ADD UNIQUE KEY uq_users_username (username),
  ADD CONSTRAINT chk_users_age CHECK (age BETWEEN 10 AND 120);

-- Optional: remove the default values after all existing prototype accounts
-- have been updated. They are retained here to allow this migration to run
-- safely while the table already contains rows.
