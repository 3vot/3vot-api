deleteApp = require('../commands/store_delete_app')
checkKeyAndFind = require('../commands/profile_check_key_and_find_command')
log = require('3vot-db/logger').getLogger('app_delete_operation')

execute= ( app ) ->
  app.profile_id = checkKeyAndFind(app)
  deleteApp(app)
  return {};

module.exports = execute;