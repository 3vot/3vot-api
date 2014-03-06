var app = require('../app');
var spec = require('./microspec');
var assert = require('assert');



spec('addProfile', {
  'should add a profile for mario from sql execute': function() {
    var request = '{ "params": { "object": "profiles", "operation": "create" }, "body": { "user_name": "mario", "contacts" :  { "owner": { "email": "mvargas@ddd.com" , "password": "12345" }, "billing": {}, "marketing": {} },  "marketing":  { "name": "Mario Producciones" } , "security":  { "public_dev_key": "abcdefg" } } }'
    var query = "select controller('REST_CONTROLLER' , '" + request  + "' )"
    console.log(query);
    var response = plv8.execute(query);
    assert(!response[0].controller.success);
  }
});
