query = "INSERT INTO apps (name, profile_id, version,version_details, marketing, sales, billing, events)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id, version"

create= (app) ->
  sqlResponse = plv8.__execute query, [ app.name , app.profile_id, 1, app.version_details, app.marketing, app.sales, app.billing, app.events ]

  app.version = 1;
  app.id = sqlResponse[0].id
  app.version = sqlResponse[0].id
  return app;

module.exports = create
  
module.exports.query = query;