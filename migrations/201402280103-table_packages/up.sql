/**
 * up.sql - Create/alter logic.
 */

CREATE TABLE apps (
 id serial primary key,
 name varchar(128) NOT NULL CONSTRAINT package_name_found UNIQUE,
 profile_id int NOT NULL references profiles,
 active boolean NOT NULL default true,
 version int NOT NULL,
 version_details json[],
 marketing json NOT NULL,
 sales json,
 billing json,
 events varchar(140)[],
 created_at timestamp default current_timestamp,
 updated_at timestamp default current_timestamp
);

COMMENT ON Table apps IS 'Application Information';
COMMENT ON COLUMN apps.name IS 'The url complaint name of the app';
COMMENT ON COLUMN apps.version IS 'Version information. [  published, latest, available ]';
COMMENT ON COLUMN apps.marketing IS 'Keys to be displayed in app listing [displayName, description, image, icon, etc]';
COMMENT ON COLUMN apps.sales IS 'used to sell apps [private, privateCode, price]';
COMMENT ON COLUMN apps.events IS 'event audit of the app ["published", "cloned from" ]';
COMMENT ON COLUMN apps.billing IS 'billing detailes about the app ["size", "credits", "overflow" ]';



CREATE TABLE invoices(

  id serial primary key,
  profile_id int NOT NULL references profiles,
  taxes json NOT NULL,
  tax decimal,
  total decimal,
  pending decimal,
  due_on date NOT NULL,
  paid_on date NOT NULL,
  created_at timestamp default current_timestamp
);

COMMENT ON Table invoices IS 'Invoices charged with external service';
COMMENT ON COLUMN invoices.profile_id IS 'The id of the profile that charge was made';
COMMENT ON COLUMN invoices.taxes IS 'A list of all taxed applied';
COMMENT ON COLUMN invoices.total IS 'The total amount';
COMMENT ON COLUMN invoices.pending IS 'The amount due';
COMMENT ON COLUMN invoices.due_on IS 'The date the invoice is due';
COMMENT ON COLUMN invoices.paid_on IS 'Date the invoice was paid';

CREATE TABLE stores (
  id serial primary key,
  name varchar(128) NOT NULL,
  profile_id int NOT NULL references profiles,
  apps int[],
  marketing json NOT NULL,
  security json,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  CONSTRAINT store_name_for_profile_found UNIQUE (profile_id, name)
);

COMMENT ON Table stores IS 'Stores in each profile';
COMMENT ON COLUMN stores.apps IS 'The apps that will be shown in the store, with marketing information';
COMMENT ON COLUMN stores.marketing IS 'Keys to be displayed in store listing [displayName, description, image, icon, etc]';
COMMENT ON COLUMN stores.security IS 'security info to decide if store is displayed or not. TB_Used';

CREATE TABLE apps_in_stores (
  id serial primary key,
  profile_id int NOT NULL references profiles,
  app_id int NOT NULL references apps,
  CONSTRAINT store_name_for_profile_found UNIQUE (profile_id, app_id)
);

COMMENT ON Table stores IS 'Stores in each profile';
COMMENT ON COLUMN stores.apps IS 'The apps that will be shown in the store, with marketing information';
COMMENT ON COLUMN stores.marketing IS 'Keys to be displayed in store listing [displayName, description, image, icon, etc]';
COMMENT ON COLUMN stores.security IS 'security info to decide if store is displayed or not. TB_Used';

