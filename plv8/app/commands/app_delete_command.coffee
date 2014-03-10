query = " DELETE from apps where name = $1 and profile_id = $2"

destroy= ( app ) ->
  sqlResponse = plv8.__execute query, [ app.name, app.profile_id ]
  throw "Could not delete store because it was not found" if sqlResponse != 1
  return app

module.exports = destroy
module.exports.query= query

