query = "UPDATE stores SET apps = $1, marketing= $2, security= $3 where name = $4 and profile_id = $5;"
queryAddApp = "UPDATE stores SET apps = array_append(apps, $1) where name = $2 and profile_id = $3 returning apps;"
queryRemoveApp = "UPDATE stores SET apps = array_remove_item(apps, $1) where name = $2 and profile_id = $3 returning apps;"

update= (store, query) ->

  values = []
  if store.apps && store.marketing && store.security
    values = [ store.apps, store.marketing, store.security ]

  else if store.appToAdd
    query = queryAddApp
    values = [ store.appToAdd.id, store.name, store.profile_id ]

  else if store.appToRemove
    query = queryRemoveApp
    values = [ store.app.id, store.name, store.profile_id ]

  sqlResponse = plv8.__execute query, values
  
  store = handleResponseByType(store, sqlResponse)
  return store;

handleResponseByType= (store, response) ->
  if store.app
    store.apps = response[0].apps;

  return store;
  
module.exports = update  
module.exports.query = query;