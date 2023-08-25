/* ************************************************************************** */
/* USERS */

CREATE TABLE users (
  id serial PRIMARY KEY,
  name varchar,
  email varchar,
  "createdAt" timestamp without time zone DEFAULT now()
);

INSERT INTO users (name, email) 
VALUES 
  ('Adam', 'adam@adam.com'),
  ('Bertrand', 'bertrand@bertrand.net'),
  ('Celine', 'celine@celine.mil');

/* ************************************************************************** */
/* NOTIFICATIONS */

CREATE OR REPLACE FUNCTION notify_trigger() RETURNS trigger AS $trigger$
DECLARE
  rec users;
  dat users;
  payload TEXT;
BEGIN

  -- Set record row depending on operation
  CASE TG_OP
  WHEN 'UPDATE' THEN
     rec := NEW;
     dat := OLD;
  WHEN 'INSERT' THEN
     rec := NEW;
  WHEN 'DELETE' THEN
     rec := OLD;
  ELSE
     RAISE EXCEPTION 'Unknown TG_OP: "%". Should not occur!', TG_OP;
  END CASE;

  -- Build the payload
  payload := json_build_object(
    'timestamp', CURRENT_TIMESTAMP,
    'schema', TG_TABLE_SCHEMA,
    'table', TG_TABLE_NAME,
    'action', LOWER(TG_OP),
    'record', row_to_json(rec),
    'old', row_to_json(dat)
  );

  -- Notify the channel
  PERFORM pg_notify('db_event', payload);

  RETURN rec;

END;
$trigger$ LANGUAGE plpgsql;

CREATE TRIGGER user_notify 
  AFTER INSERT OR UPDATE OR DELETE
  ON users
  FOR EACH ROW 
  EXECUTE PROCEDURE notify_trigger();

/* ************************************************************************** */
/* EOF */

