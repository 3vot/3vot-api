fakeDate=null;

getCostInCredits= (app) =>
  constants = require("../").constants;
  costInCredits  = 0;
  if app.billing.size == "small"
    costInCredits = constants.SMALL_APP_COST;
  else if app.billing.size == "regular"
    costInCredits = constants.REGULAR_APP_COST;
  else 
    costInCredits = constants.LARGE_APP_COST;
  return adjustOpenSourceCost(app,costInCredits)

proRateCost= (cost) ->
  if fakeDate
    today = new Date(fakeDate).getDate()
  else
    today = new Date().getDate();

  prorate = 1
  if today >= 24 then prorate = 0.25
  else if today >= 15 and today < 24 then prorate = 0.5
  if today > 7 and today < 15  then prorate = 0.75
  
  return cost * prorate ;

adjustOpenSourceCost= (app, costInCredits) ->
  constants = require("../").constants;
  if( !app.sales.private ) then costInCredits = costInCredits * constants.OPEN_SOURCE_DISCOUNT 
  return costInCredits;

getTodayInFormat= ->
  d = new Date();
  curr_date = d.getDate();
  curr_month = d.getMonth() + 1;
  curr_year = d.getFullYear();
  return curr_date + "-" + curr_month + "-" + curr_year;

module.exports = (app) ->
  # return if app is not new and size did not change
  if app.old and !app.sizeIncreased and !app.sizeReduced
    return app;
    
  fakeDate = app.fakeDate
  costInCredits = Math.round( getCostInCredits(app) );
  proRatedCost = Math.round( proRateCost(costInCredits) );

  app.proRatedCost = proRatedCost
  app.billing.cost = costInCredits;
  app.billing.last_cost = proRatedCost;
  
  return app;