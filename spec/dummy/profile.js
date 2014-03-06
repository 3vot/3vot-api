
var pg = require("pg")

var json= { 
  "user_name": "_delete_me", 
  "contacts" :  { "owner": { "email": "mvargas@ddd.com" , "password": "12345" }, 
  "billing": {}, "marketing": {} }, "marketing":  { "name": "Mario Producciones" } , 
  "security":  {  }
}

var profile = {};

function reload(callback){
  
  client = new pg.Client(process.env.POSTGRES_URL);
  var _this = this;

  client.connect(function(err) {
    if(err) return console.error('could not connect to postgres', err);
    var request = { "params": { "object": "profiles", "operation": "create" }, "body": json };
    var query = "select * from profiles where id = $1"
     client.query(query, [_this.profile.id] , function(err, result) {
        if(err) console.log(err)
        _this.profile = result.rows[0];
        callback();
      });
  });
  
}

function create(callback){
  client = new pg.Client(process.env.POSTGRES_URL);
  var _this = this;

  client.connect(function(err) {
    if(err) return console.error('could not connect to postgres', err);
    var request = { "params": { "object": "profiles", "operation": "create" }, "body": json };
    var query = "select controller('REST_CONTROLLER' , '" + JSON.stringify(request)  + "' )"
     client.query(query, function(err, result) {
        if(err) console.log(err)
        result= result.rows[0].controller;
        if(!result.success) throw result.message
        _this.profile = result.response;
        callback();
      });
  });
}

module.exports = {
 json: json,
 create: create ,
 profile: profile,
 reload: reload
}