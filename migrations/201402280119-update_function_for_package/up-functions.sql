/* TODO: add Function declarations here */

CREATE OR REPLACE FUNCTION controller(controller_name text, request json) RETURNS json AS $$
  plv8.execute("select plv8_startup()");
  var response = App.controllerRouter(controller_name, request);
  return JSON.stringify(response);
$$ LANGUAGE plv8;

CREATE OR REPLACE FUNCTION array_remove_item (array_in INTEGER[], item INTEGER)
RETURNS INTEGER[]
LANGUAGE SQL
AS $$
SELECT ARRAY(
  SELECT DISTINCT $1[s.i] AS "foo"
    FROM GENERATE_SERIES(ARRAY_LOWER($1,1), ARRAY_UPPER($1,1)) AS s(i)
   WHERE $2 != $1[s.i]
   ORDER BY foo
);
$$;