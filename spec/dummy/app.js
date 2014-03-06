
var pg = require("pg")


var json = {
  user_name: "_delete_me",
  developer: "roberto",
  name: "_delete_me_",
  billing: { size: "small"}    
}

function create(callback){
  client = new pg.Client(process.env.POSTGRES_URL);
  var _this = this;

  client.connect(function(err) {
    if(err) return console.error('could not connect to postgres', err);
    var request = { "params": { "object": "apps", "operation": "create" }, "body": json };
    var query = "select controller('REST_CONTROLLER' , '" + JSON.stringify(request)  + "' )"
     client.query(query, function(err, result) {
        if(err) console.log(err)
        result= result.rows[0].controller;
        if(!result.success) throw result.message
        _this.app = result.response;
        callback();
      });
  });
}


module.exports = {
  
  json: json,
  create: create
  
  
}