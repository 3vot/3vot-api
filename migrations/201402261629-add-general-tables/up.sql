CREATE TABLE profiles (
  id serial primary key,
  user_name varchar(32) NOT NULL CONSTRAINT profile_user_name_found UNIQUE,
  credits int default 50 NOT NULL CONSTRAINT profile_credits_can_not_be_below_cero CHECK ( credits >= 0 ),
  credits_to_reload int default 50 NOT NULL CONSTRAINT profile_credits_to_reload_can_not_be_below_cero CHECK ( credits >= 0 ),
  active boolean NOT NULL default true,
  contacts json NOT NULL,
  marketing json NOT NULL,
  security json NOT NULL,
  bills json[] NOT NULL,
  refilled_on date,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);
