process.env.POSTGRES_URL = process.env.POSTGRES_URL || "postgres://roberto@localhost/vot_api_dev";

var express = require('express')
var app = express();
var routes = require('./routes')
var postgres_api = require('./postgres-api')
var http = require('http')
var path = require('path');
var pg = require("pg")
var sessions = require("client-sessions");
var cors = require("3vot-cors");

var pgConnect = require("./middleware/pg-connect")( { config: process.env.POSTGRES_URL  } )
var pgobj = require('pg-objects')
var SFLogin = require("3vot-salesforce-proxy").Login;
var SFProxy = require("3vot-salesforce-proxy").Controller;
var pgRoutes = require("./routes/pg")
var generalRoutes = require("./routes/general")
var googleRoutes = require("./routes/googleCSV")
var AWS = require("aws-sdk")

try{
  AWS.config.loadFromPath('./aws_keys.json');
}
catch(e){
  AWS.config.update( { accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_KEY });  
}


// all environments
app.set('port', process.env.PORT || 3002);

app.use(sessions({
  cookieName: 'session',
  secret: 'blargadeeblargblarg',
  duration: 2 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

app.use(cors.middleware( { origins: ["localhost:3000", "google.com","3vot.com", "nitrousbox.com" , ".com"] } ));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('for whom the bells toll'));
app.use(express.methodOverride());
app.use(app.router);

SFLogin(app, {route: "/v1/salesforce" });
SFProxy(app, {route: "/v1/salesforce"});

app.all('/v1/tokens/developerToken', generalRoutes.developerToken)

app.get('/v1/logins', generalRoutes.getLogins);

app.post('/v1/login/:provider', generalRoutes.setLogin);

app.get("/v1/google/csv", googleRoutes )

pgRoutes(app, { route: "/v1" } )

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;