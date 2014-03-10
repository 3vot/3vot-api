
if(!process.env.POSTGRES_URL) process.env.POSTGRES_URL = "postgres://roberto@localhost/vot_api_dev";


var express = require('express')
var app = express();
var routes = require('./routes')
var postgres_api = require('./postgres-api')
var http = require('http')
var path = require('path');
var pg = require("pg")
var pgConnect = require("./middleware/pg-connect")( { config: process.env.POSTGRES_URL  } )
var pgobj = require('pg-objects')

// all environments
app.set('port', process.env.PORT || 3002);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

var options = { route: "/v1"}

app.post( options.route + "/business/:operation", pgConnect ,function(req, res) {
  var request = { "params": { "operation": req.params.operation }, "body": req.body  }
  var query = "SELECT controller('BUSINESS_CONTROLLER', '" + JSON.stringify(request) + "');";
  req.db.client.query( query ,
    function(err, result) {
      if(err) return res.send(500, err);
      if(!result.rows || result.rows.length == 0) return res.send(500, "Unexpected Error, no response from Database")
      if(result.rows[0].controller.success != true) return res.send(404, result.rows[0].controller )
      res.send( result.rows[0].controller.response);
    });
});

app.get( options.route + "/:object/views/:named", pgConnect ,function(req, res, next) {
  var request = { "params": { "object": req.params.object, "operation": req.params.named }, "body": req.query }
  var query = "SELECT controller('SELECT_CONTROLLER', '" + JSON.stringify(request) + "');";
  req.db.client.query( query ,
    function(err, result) {
      if(err) return res.send(500, err);
      if(!result.rows || result.rows.length == 0) return res.send(500, "Unexpected Error, no response from Database")
      if(result.rows[0].controller.success != true) return res.send(404, result.rows[0].controller )
      res.send( result.rows[0].controller.response);
    });
});

app.post( options.route + "/:object/actions/:named", pgConnect ,function(req, res, next) {
  var request = { "params": { "object": req.params.object, "operation": req.params.named }, "body": req.body }
  var query = "SELECT controller('BUSINESS_CONTROLLER', '" + JSON.stringify(request) + "');";
  req.db.client.query( query ,
    function(err, result) {
      if(err) return res.send(500, err);
      if(!result.rows || result.rows.length == 0) return res.send(500, "Unexpected Error, no response from Database")
      if(result.rows[0].controller.success != true) return res.send(404, result.rows[0].controller )
      res.send( result.rows[0].controller.response);
    });
});

app.get( options.route + "/:object/:id", pgConnect ,function(req, res) {
  req.db.client.query( "select * from " + req.params.object + " where id = $1" , [ req.params.id ], function(err, result) {
    if(err) return res.send(500, 'error running query ' + err);
     res.send(result.row);
   });
});

app.get( options.route + "/:object", pgConnect ,function(req, res) {
  var request = { "params": { "object": req.params.object, "operation": "select" }, "body": req.query  }
  var query = "SELECT controller('SELECT_CONTROLLER', '" + JSON.stringify(request) + "');";
  req.db.client.query( query ,
    function(err, result) {
      if(err) return res.send(500, err);
      if(!result.rows || result.rows.length == 0) return res.send(500, "Unexpected Error, no response from Database")
      if(result.rows[0].controller.success != true) return res.send(404, result.rows[0].controller )
      res.send( result.rows[0].controller.response);
    });
});

app.post( options.route + "/:object", pgConnect ,function(req, res) {
  var request = { "params": { "object": req.params.object, "operation": "create" }, "body": req.body  }
  var query = "SELECT controller('REST_CONTROLLER', '" + JSON.stringify(request) + "');";
  req.db.client.query( query ,
    function(err, result) {
      if(err) return res.send(500, err);
      if(!result.rows || result.rows.length == 0) return res.send(500, "Unexpected Error, no response from Database")
      if(result.rows[0].controller.success != true) return res.send(404, result.rows[0].controller )
      res.send( result.rows[0].controller.response);
    });
});

app.put( options.route + "/:object", pgConnect ,function(req, res) {
  var request = { "params": { "object": req.params.object, "operation": "update" }, "body": req.body  }
  var query = "SELECT controller('REST_CONTROLLER', '" + JSON.stringify(request) + "');";
  req.db.client.query( query ,
    function(err, result) {
      if(err) return res.send(500, err);
      if(!result.rows || result.rows.length == 0) return res.send(500, "Unexpected Error, no response from Database")
      if(result.rows[0].controller.success != true) return res.send(404, result.rows[0].controller )
      res.send( result.rows[0].controller.response);
    });
});

app.delete( options.route + "/:object", pgConnect ,function(req, res) {
  console.log(req.query)
  var request = { "params": { "object": req.params.object, "operation": "delete" }, "body": req.query  }
  var query = "SELECT controller('REST_CONTROLLER', '" + JSON.stringify(request) + "');";
  req.db.client.query( query ,
    function(err, result) {
      if(err) return res.send(500, err);
      if(!result.rows || result.rows.length == 0) return res.send(500,"Unexpected Error, no response from Database")
      if(result.rows[0].controller.success != true) return res.send(404, result.rows[0].controller )
      res.send( result.rows[0].controller.response);
    });
});


function handleProxy(req,res,controller){
  app.post( options.route + "/:object", pgConnect ,function(req, res) {
    var request = { "params": { "object": req.params.object, "operation": "create" }, "body": req.body  }
    var query = "SELECT controller(" + controller + ", '" + JSON.stringify(request) + "');";
    req.db.client.query( query ,
      function(err, result) {
        if(err) return res.send(500, err);
        if(!result.rows || result.rows.length == 0) return res.send(500, "Unexpected Error, no response from Database")
        if(result.rows[0].controller.success != true) return res.send(result.rows[0].controller )
        res.send( result.rows[0].controller.response);
      });
  });  
}

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;