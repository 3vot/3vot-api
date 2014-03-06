createStore = require('../commands/store_create_command')
checkKeyAndFind = require('../commands/profile_check_key_and_find_command')
log = require('3vot-db/logger').getLogger('store_create_operation')

execute= ( store ) ->
  store.profile_id = checkKeyAndFind(store)
  store = createStore(store)
  return store;

module.exports = execute;