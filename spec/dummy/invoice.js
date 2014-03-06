
var pg = require("pg")

var json= { 
  taxes: {},
  tax: 0,
  total: 100,
  pending: 0,
  due_on: new Date(),
  paid_on: new Date()
}

var profile = {};


function create(callback){
  client = new pg.Client(process.env.POSTGRES_URL);
  var _this = this;

  client.connect(function(err) {
    if(err) return console.error('could not connect to postgres', err);
    var request = { "params": { "object": "profiles", "operation": "create" }, "body": profileJson };
    var query = "insert into invoice  (profile_id, taxes, tax, total, pending, due_on,paid_on) values ($1,$2,$3,$4,$5,$6,$7)"
    var values = [json.profile_id,json.taxes, json.tax, json.total, json.pending, json.due_on, json.paid_on ]
     client.query(query, values, function(err, result) {
        if(err) console.log(err)
        callback();
      });
  });
}


module.exports = {
 json: profileJson,
 create: create
}