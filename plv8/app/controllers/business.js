var billProfiles = require("../operations/profile_bill");
var addAppToStore = require("../operations/store_add_app");
var removeAppFromStore = require("../operations/store_remove_app");
var log = require('3vot-db/logger').getLogger('busines_controller');

module.exports = function(request){
  var operation = null;
  if(request.params.operation == "bill") operation = billProfiles
  else if(request.params.operation == "addAppToStore") operation = addAppToStore
  else if(request.params.operation == "removeAppFromStore") operation = removeAppFromStore


  else{
    throw "Business Controller could not find what operation to execute " + request.params;
  }
  return operation;
}



