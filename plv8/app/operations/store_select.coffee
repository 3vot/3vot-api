queryWithApps = ( store ) ->

  profileQuery = "select id, user_name, marketing from profiles where user_name = $1"
  profile = plv8.__executeRow profileQuery, [store.user_name]

  profileQuery = "select * from stores where  profile_id = $1"
  stores = plv8.__execute profileQuery, [ profile.id ]

  app_ids = []
  
  profile.stores = stores;
  
  for store in stores
    for id in store.apps
      if app_ids.indexOf(id) == -1 then app_ids.push id

  appQuery = "select id,name,marketing,profile_id from apps where id = ANY($1) and active = true"
  apps = plv8.execute appQuery, [app_ids]
  
  appMap = {}
  for app in apps
    appMap["" + app.id]= app 

  for store in stores
    store.full_apps = []
    for app in store.apps
      store.full_apps.push appMap[app]
  
  return profile

module.exports = {
  queryWithApps: queryWithApps
}