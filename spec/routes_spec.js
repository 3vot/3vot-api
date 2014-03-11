var app = require("../app")
var mockReq, mockRes;
var fs = require("fs")
var should = require("should")

var request = require('supertest')

describe('3VOT Backend', function() {

  it('should get aws temporary credentiasl an App with post', function(done) {
    var body = { 
      username: "bob123",
    };

    request(app)
    .post("/v1/tokens/developerToken")
    .send( body )
    .expect(200)
    .end(function(err, res){
        if (err) throw err;
        res.body.FederatedUser.Arn.indexOf("bob123").should.be.above(-1);
        done()
      });
  });

  it('should get aws temporary credentiasl an App with get', function(done) {

    request(app)
    .post("/v1/tokens/developerToken?username=bob123")
    .send()
    .expect(200)
    .end(function(err, res){
        if (err) throw err;
        res.body.FederatedUser.Arn.indexOf("bob123").should.be.above(-1);
        done()
      });
  });


});