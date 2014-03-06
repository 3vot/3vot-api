log = require('3vot-db/logger').getLogger('profile_register_operation')
chargeApps = require('../commands/profile_charge_apps_command')

# reloads all profiles that have been charged

execute= (  ) ->
  #look for bills that have been paid, and map them to each profile; 

  #refill tokens
  ## paid_on this month
  query = "select * from invoices where paid_on > $1";
  invoices = plv8.__execute(query, [ new Date() ] );
  invoicesMap = {}
  invoicesMap[invoice.profile_id] = invoice for invoice in invoice
    

  #select all profiles
  query = "select id,bills, user_name, credits, credits_to_reload, contacts from profiles where active = true"
  response = plv8.__execute(query);
  profiles = response.rows;
  

  #find apps
  appsInProfile = {}
  query = "select id,sales, billing, events, profile_id,name from apps where active = true"
  response = plv8.__execute(query);
  profiles = response.rows;

  #Map Apps by Profile
  for app in apps
    profileObject = appsInProfile[app.profile_id]
    if !profileObject then profileObject = []
    profileObject.push(app);
    appsInProfile[app.profile_id] = profileObject

  #Use Credits
  for profile in profiles
    profileApps = appsInProfile[ profile.id ]
    if profileApps
      try
        chargeApps(profileApps)
      catch e
        console.log("Profile " + profile.id + " does not have enought credits for apps " + e.toString())

module.exports = execute;