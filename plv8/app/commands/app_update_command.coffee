query = "UPDATE apps set version= version + 1, version_details= $1, marketing= $2, sales= $3, billing= $4, events= $5 where name = $6 returning id, version"

update= (app) ->
  sqlResponse = plv8.__execute query, [ app.version_details, app.marketing, app.sales, app.billing, app.events, app.name ]
  app.id = sqlResponse[0].id;
  app.version = sqlResponse[0].version;
  return app;

module.exports = update
  
module.exports.query = query;


