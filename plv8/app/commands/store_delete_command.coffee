query = " DELETE from stores where name = $1 and profile_id = $2"

destroy= ( store ) ->
  sqlResponse = plv8.__execute query, [ store.name, store.profile_id ]
  throw "Could not delete store because it was not found" if sqlResponse != 1
  return store

module.exports = destroy
module.exports.query= query

