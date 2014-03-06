var createProfile = require("../operations/profile_create");
var createApp = require("../operations/app_create");
var createStore = require("../operations/store_create");
var deleteStore = require("../operations/store_delete");

var log = require('3vot-db/logger').getLogger('rest_controller');


module.exports = function(request){
  var operation = null;
  if(request.params.object == "profiles" && request.params.operation == "create" ) operation = createProfile
  else if( request.params.object == "apps" && request.params.operation == "create" ) operation = createApp
  else if( request.params.object == "stores" && request.params.operation == "create" ) operation = createStore
  else if( request.params.object == "stores" && request.params.operation == "delete" ) operation = deleteStore
  else{
    throw "Rest Controller could not find what operation to execute " + request.params;
  }
  return operation;
}