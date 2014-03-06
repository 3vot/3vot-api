/* TODO: add Function declarations here */

CREATE OR REPLACE FUNCTION plv8_source(lineno integer) RETURNS void AS $$
  // REMEMBER all argument names are converted to lowercase unless quoted.
  plv8.__dumpSource(lineno, 10);
$$ LANGUAGE plv8;

CREATE OR REPLACE FUNCTION plv8_source(lineno int, context_lines int) RETURNS void AS $$
  plv8.__dumpSource(lineno, context_lines);
$$ LANGUAGE plv8;

CREATE OR REPLACE FUNCTION controller(controller_name text, request json) RETURNS json AS $$
  //Request is made of params and body
  plv8.execute("select plv8_startup()");
  var response = App.controllerRouter(controller_name, request);
  return JSON.stringify(response);
$$ LANGUAGE plv8;