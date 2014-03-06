#Charges Apps Credits From Profile
# OJO's Monthly specifies if it's monthly charge
# OJO's uses app.proRatedCost, which is asigned by update_credits_command
# OJO's UPDATES app.billing.paid command

#####
####

module.exports = (apps, monthly = true) ->
  chargeAmount = 0;
  billingApps = {}
  profile_id = null;
  substractFrom = if monthly then "credits_to_reload" else "credits"
  reason = if monthly then "Monthly Subscription of Apps" else "First Creation of App"

  for app in apps
    
    if profile_id and profile_id != app.profile_id then throw "There are apps from different profiles" 
    if !profile_id then profile_id = app.profile_id;
    
    appCharge = app.proRatedCost || app.billing.cost;
    

    billingApps[app.name] = appCharge;
    chargeAmount += appCharge;

  chargeEvent = { date: new Date().getTime(), amount: chargeAmount, apps: billingApps , reason: reason }

  query = "update profiles set credits = " + substractFrom  + " - $1 , bills = array_append(bills, $2) where id = $3"
  values = [ chargeAmount, chargeEvent , profile_id]
  updateResponse = plv8.__execute query, values

  if(updateResponse.count == 0 ) then throw "Error: Could not update/find " + chargeAmount + " credits for profile " + app.user_name

  return apps;