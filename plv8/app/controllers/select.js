var defaultSelect = require("../operations/default_select");
var storeSelect = require("../operations/store_select");

var log = require('3vot-db/logger').getLogger('rest_controller');

module.exports = function(request){
  var operation = null;
  if( request.params.operation == "with_apps" && request.params.object == "stores" ) operation = storeSelect.queryWithApps
  else operation = defaultSelect;
  return operation;
}