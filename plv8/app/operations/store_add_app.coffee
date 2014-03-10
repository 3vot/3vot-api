updateStore = require('../commands/store_update_command');
checkKeyAndFind = require('../commands/profile_check_key_and_find_command');
log = require('3vot-db/logger').getLogger('store_add_app_operation');

execute= ( store ) ->
  store.profile_id = checkKeyAndFind(store);
  store.appToAdd = findAppByNameAndProfile(store);
  store = updateStore(store);
  return store;

findAppByNameAndProfile= (store) ->
  query = "select id from apps where name = $1 and profile_id = $2"
  app = plv8.__executeRow query, [ store.app, store.profile_id]
  throw "App not Found for name #{store.app} and profile #{store.user_name}" if !app
  return app;
    
module.exports = execute;