deleteStore = require('../commands/store_delete_command')
checkKeyAndFind = require('../commands/profile_check_key_and_find_command')
log = require('3vot-db/logger').getLogger('store_delete_operation')

execute= ( store ) ->
  store.profile_id = checkKeyAndFind(store)
  deleteStore(store)
  return {};

module.exports = execute;