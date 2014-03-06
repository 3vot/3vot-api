queryWithApps = ( store ) ->
  profileQuery = "select * from stores where name = $1 and profile_id = $2"
  stores = plv8.execute profileQuery, [store.name, store.profile_id]

  app_ids = []
  
  for store in stores
    for id in store.apps
      if app_ids.indexOf(id) == -1 then app_ids.push id

  appQuery = "select * from apps where id = ANY($1)"
  apps = plv8.execute appQuery, [app_ids]
  
  appMap = {}
  for app in apps
    appMap["" + app.id]= app 

  for store in stores
    store.full_apps = []
    for app in store.apps
      store.full_apps.push appMap[app]
  
  return stores

module.exports = {
  queryWithApps: queryWithApps
}