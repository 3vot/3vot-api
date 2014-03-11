AWS = require("aws-sdk")
/*
 * GET home page.
 */

exports.getLogins = function(req,res){ 
  res.set('Content-Type', 'application/json'); 
  res.send(req.session.logins || {}) ;
}

exports.setLogin = function(req,res){
  if(!req.session.logins) req.session.logins = {};
  req.session.logins[req.params.provider] = req.body;
  res.send(200);
}

exports.developerToken = function(req, res){
  
  var sts = new AWS.STS();
  var username = req.query.username || req.body.username
  
  var policy = {
    Version: "2012-10-17",
    Statement: [{
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    }]
  };

  sts.getFederationToken({ Name: username, Policy: JSON.stringify(policy) }, function(err, data){
    if(err){
      res.status(500);
      return res.send(err);
    }
    res.send(data)
    
  });
  
}