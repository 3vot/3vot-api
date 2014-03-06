module.exports = (app) ->
  wrong_key_error = "Error: Security Key does not match " + app.user_name + "   public or private keys";
  no_user_name_error = "Error: Request Body should have provided a user_name field and your developers public_dev_key for authentication";
  throw no_user_name_error if !app.user_name or !app.public_dev_key
  response = plv8.__executeRow "select id,security from profiles where user_name = $1", [app.user_name];
  throw wrong_key_error if(response.security.public_dev_key != app.public_dev_key)
  return response.id
  