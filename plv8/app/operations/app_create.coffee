createApp = require('../commands/app_create_command')
updateApp = require('../commands/app_update_command')

checkKeyAndFind = require('../commands/profile_check_key_and_find_command')
chargeApps = require('../commands/profile_charge_apps_command')
updateCredits = require('../commands/app_update_credits_command')

log = require('3vot-db/logger').getLogger('app_create_operation')

#App Must have developer, user_name, public_dev_key or private_dev_key

execute= ( app ) ->
  # default and update
  
  
  app_found= findAppByName(app)
  app = defaultApp(app,app_found);
  app.profile_id = checkKeyAndFind(app)

  #billing
  app = updateCredits(app);
  if app.billCredits then app = chargeApps([app], false)[0];
  
  #version and events
  app = updateVersion(app);
  app = createEvent(app);
  
  if app_found != null then return updateApp(app) else  return createApp(app);

defaultApp= (app, app_found) ->
  app.marketing =  {} if !app.marketing
  app.billing =  { events: {}, cost: 0, last_cost: 0 } if !app.billing
  app.version_details = [] if !app.version_details
  app.sales =  {} if !app.sales
  app.events =  [] if !app.events
  app.billCredits = true;
  
  if app_found
    app.old = app_found;
    app.billCredits = false;
    
    app.id = app_found.id;
    app.version = app_found.version;
    app.events = app_found.events;
    app.version_details= app_found.version_details

    app.billing.events = app_found.billing.events
    app.billing.last_cost = app_found.billing.last_cost;
    app.billing.cost = app_found.billing.cost;


    if app_found.billing.size == "large" and ( app.billing.size == "regular" or app.billing.size == "small" )
      app.sizeReduced = true;

    else if app_found.billing.size == "regular" and app.billing.size == "small"
      app.sizeReduced = true;

    else if app_found.billing.size == "small" and ( app.billing.size == "regular" or app.billing.size == "large" )
      app.sizeIncreased = true;
      app.billCredits = true;

    else if app_found.billing.size == "regular" and app.billing.size == "large"
      app.sizeIncreased = true;
      app.billCredits = true;

  return app;

findAppByName = (app) ->
  return plv8.__executeRow "select id, billing, events,version_details, version from apps where name = $1" , [app.name]

updateVersion= (app) ->
  app.version++;
  app.version_details.push { developer: app.developer, when: Date.now() }
  return app;

createEvent= (app) ->
  version = app.version || 1;
  size = ""
  charged = ""
  charge = " " + app.proRatedCost + " credits charged" if app.billCredits
  if app.sizeIncreased or app.sizeDecreased
    size = " app size increased to " + app.billing.size if app.sizeIncreased
    size = " app size reduced to " + app.billing.size if app.sizeDecreased

  app.events.push app.developer + " deployed version " + version + ".0" + charged + size;
  return app;
  
module.exports = execute;