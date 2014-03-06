query = " INSERT INTO profiles (user_name, credits, credits_to_reload, bills, contacts, marketing, security)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING id"

create= ( profile ) ->

    constants = require("../").constants;

    defaultCredits = constants.DEFAULT_CREDITS;
    sqlResponse = plv8.__execute query, [ profile.user_name , profile.credits or defaultCredits, profile.credits_to_reload or defaultCredits , [], profile.contacts, profile.marketing, profile.security ]

    profile.id = sqlResponse[0].id
    profile.credits = defaultCredits if !profile.credits
    profile.credits_to_reload = defaultCredits if !profile.credits_to_reload
    profile.bills = [] if !profile.bills
    return profile;
  
  
module.exports = create
module.exports.query= query

