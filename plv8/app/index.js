var restController = require("./controllers/rest");
var businessController = require("./controllers/business");
var selectController = require("./controllers/select");

var log = require('3vot-db/logger').getLogger('App_Index')

var controllers = {}

var constants = {
  DEFAULT_CREDITS: 15,
  OPEN_SOURCE_DISCOUNT: 0.50,
  SMALL_APP_COST: 5,
  REGULAR_APP_COST: 10,
  LARGE_APP_COST: 15
}

function registerControllers(){
  controllers["REST_CONTROLLER"] = restController;
  controllers["BUSINESS_CONTROLLER"] = businessController;
  controllers["SELECT_CONTROLLER"] = selectController;

}

function controllerRouter(controllerName, request){
  registerControllers();
  if(!controllers[controllerName]) throw "Controller " + controllerName + " does not exist";
  var operation = controllers[controllerName](request);
  return execute(operation, request);
}


function execute(operation, request){
  var response = {};
  try{
    plv8.subtransaction( function(){    
      var operation_result = operation(request.body);
      response = {success: true, response: operation_result, message: '' };
    });
  } catch(e) {

    var response = {success: false, message: e.toString(), request: request, reason: e.stack };
    return response;
  }
  return response;
  
}

module.exports = {
  controllerRouter: controllerRouter,
  constants: constants
};