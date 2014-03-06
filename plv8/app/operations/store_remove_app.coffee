updateStore = require('../commands/store_update_command');
checkKeyAndFind = require('../commands/profile_check_key_and_find_command');
log = require('3vot-db/logger').getLogger('store_remove_app_operation');

execute= ( store ) ->
  store.profile_id = checkKeyAndFind(store);
  store.appToRemove = findStoreByNameAndProfile(store);
  store = updateStore(store);
  return store;

findStoreByNameAndProfile= (store) ->
  query = "select id from apps where name = $1 and profile_id = $2"
  app = plv8.__executeRow query, [ store.app, store.profile_id]
  return app;

module.exports = execute;