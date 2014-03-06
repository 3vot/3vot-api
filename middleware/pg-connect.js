// ----------------------------------------------------------------------------
//
// connect-pgclient.js - Connect middleware to manage Postgres connections.
//
// Copyright 2013 Andrew Chilton <andychilton@gmail.com>
//
// ----------------------------------------------------------------------------
//
// options = {
//     config      : { ... }, // same as -> https://github.com/brianc/node-postgres/wiki/Client#parameters
//     transaction : <boolean>, // default: false, whether to start and finish a transaction
// };
//
// ----------------------------------------------------------------------------

var pg = require('pg');

// ----------------------------------------------------------------------------

var lastOptions = null

function pgclient(options) {
  var options = options || lastOptions;
  if(!options) throw "Options not supplied to pg-connect module"

  lastOptions = options;
  var log = options.log || function() {};

  // return the (configured) middleware
  return function pgclient(req, res, next) {

    // proxy end() to end the transaction (if needed) and release the client
    var origEnd = res.end;
    res.end = function(data, encoding) {
      log('connect-pgclient: wrapper res.end() called');
      res.end = origEnd;

      // if there is nothing to do, just call the original res.end()
      if (!req.db) {
          log('connect-pgclient: no req.db, calling res.end()');
          return res.end(data, encoding);
      }

      log('connect-pgclient: releasing client, calling res.end()');
      req.db.done();
      delete req.db;
      return res.end(data, encoding);
    };

    // get a client to the db
    log('connect-pgclient: getting new Pg client');
    pg.connect(options.config, function(err, client, done) {
      if (err) {
          log('connect-pgclient: error when getting new client');
          return next(err);
      }

      log('connect-pgclient: got client');
      // save the db stuff to the request
      req.db = {
          client       : client,
          done         : done,
          transaction  : false,
      };
      
      return next();
    });
  } 
}

module.exports = pgclient;