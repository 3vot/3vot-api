process.env.POSTGRES_URL = "postgres://roberto@localhost/vot_api_dev";

var app = require("../app")
var mockReq, mockRes;
var fs = require("fs")
var should = require("should")
var request = require('supertest')
var pg = require("pg")

var profileDummy = require("./dummy/profile")

describe('3VOT Backend', function() {

  it('should insert profile', function(done) {
    request(app)
    .post("/v1/profiles/")
    .send( profileDummy.json )
    .end(function(err, res){
      if (err) console.log(err);
      res.body.credits.should.equal(15);
      res.body.security.public_dev_key.length.should.be.above(5);
      done();
    });
  });
  
  it('should not update profile for credits < 0', function(done) {
     var client = new pg.Client(process.env.POSTGRES_URL);
      client.connect(function(err) {
        if(err) return console.error('could not connect to postgres', err);
        
        client.query("update profiles set credits = -10 where user_name = '_delete_me'", function(err, result) {
          err.should.not.equal(null)
          done();
        });
      });
  });

  
  it('should not insert profile with same name', function(done) {
    request(app)
    .post("/v1/profiles/")
    .send( profileDummy.json )
    .expect(500)
    .end(function(err, res){
      if (err) console.log(err);
      done();
    });
  });
  
  after(function(done){
    var client = new pg.Client(process.env.POSTGRES_URL);
    client.connect(function(err) {
      if(err) return console.error('could not connect to postgres', err);
      client.query("delete from profiles where user_name = $1" , [ profileDummy.json.user_name ] , function(err, result) {
         done();
       });
      
      })
  })

  
});