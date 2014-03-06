//var extend = require('node.extend');
var pgConnect = require("./middleware/pg-connect")
//var request = require("superagent")
var Q = require("q")
var pgobj = require('pg-objects')

function config(app, options){
  if(!options.route) options.route = "";

  app.get( options.route + "/:table/:id", pgConnect ,function(req, res) {
    req.db.client.query( "select * from " + req.params.table + " where id = $1" , [ req.params.id ], function(err, result) {
      if(err) return res.send(501, 'error running query ' + err);
       res.send(result.row);
     });
  });

  app.post( options.route + "/:table", pgConnect ,function(req, res) {
    var prepped = pgobj.insert(req.body);
    client.query( "INSERT INTO " + req.params.table + " (" + prepped.fields + ") VALUES (" + prepped.params + ")", prepped.values,
      function(err, result) {
        if(err) return res.send(501, 'error running query ' + err);
        res.send(result.row);
      });
  });

  
}

module.exports = config;