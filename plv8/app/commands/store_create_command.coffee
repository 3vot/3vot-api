query = "INSERT INTO stores (name, profile_id, apps, marketing, security)
VALUES ($1, $2, $3, $4, $5)
RETURNING id"

create= (store) ->
  sqlResponse = plv8.__execute query, [ store.name , store.profile_id, [], {}, {} ]

  store.id = sqlResponse[0].id
  return store;

module.exports = create
  
module.exports.query = query;