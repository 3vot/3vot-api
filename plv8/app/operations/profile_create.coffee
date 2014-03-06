log = require('3vot-db/logger').getLogger('profile_register_operation')
createProfile = require("../commands/profile_create_command")

execute= ( profile ) ->
  #Security
  profile.security.public_dev_key = randomString(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.');

  profile = createProfile( profile );  
  return profile;

randomString= (length, chars) ->
  result = '';
  i = length;
  while i > 0
    result += chars[Math.round(Math.random() * (chars.length - 1))];
    i--;
   return result;
   
module.exports = execute;