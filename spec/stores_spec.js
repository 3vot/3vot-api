process.env.POSTGRES_URL = "postgres://roberto@localhost/vot_api_dev";

var app = require("../app")
var mockReq, mockRes;
var fs = require("fs")
var should = require("should")
var request = require('supertest')
var pg = require("pg")

var client = "";

var profileDummy = require("./dummy/profile")
var appDummy = require("./dummy/app")
var storeDummy = require("./dummy/store")

function startAndEnd(done){
  client = new pg.Client(process.env.POSTGRES_URL);
  client.connect(function(err) {
    if(err) return console.error('could not connect to postgres', err);
     client.query("delete from stores where name LIKE $1", [ "_delete%" ], function(err, result) {
       client.query("delete from apps where name LIKE $1", [ "_delete%" ], function(err, result) {
        client.query("delete from profiles where user_name = $1", [ profileDummy.json.user_name ] , function(err, result) {
          done();
        });          
      });
    });
  });
}

describe('3VOT Backend', function() {

  before(startAndEnd)
  after(startAndEnd)

  describe('Store Tests', function() {
    before(function(done){
      profileDummy.create(function(){
        storeDummy.json.user_name = profileDummy.profile.user_name
        storeDummy.json.public_dev_key = profileDummy.profile.security.public_dev_key
        appDummy.json.user_name = profileDummy.profile.user_name
        appDummy.json.public_dev_key = profileDummy.profile.security.public_dev_key
        appDummy.json.profile_id = profileDummy.profile.id
        appDummy.create(function(){
          done();
        })
      });
    })
    
    it('should insert store', function(done) {  
      request(app)
      .post("/v1/stores/")
      .send( storeDummy.json )
      .end(function(err, res){
        if (err) console.log(err);
        res.body.id.should.not.equal(null)
        done();
      });
    });

    it('should add an app to store', function(done) { 
      storeDummy.json.app = appDummy.app.name
      request(app)
      .post("/v1/business/addAppToStore")
      .send( storeDummy.json )
      .end(function(err, res){
        if (err) console.log(err);
        delete storeDummy.json.app;
        res.body.apps.length.should.equal(1)
        done();
      });
    });

    it('should select store', function(done) {
      request(app)
      .get( "/v1/select/stores/with_apps?profile_id=" + profileDummy.profile.id + "&name=" + storeDummy.json.name  )
      .end(function(err, res){
        if (err) console.log(err);
        console.log(res.body);
        done();
      });
    });


    it('should remove an app to store', function(done) { 
      storeDummy.json.app = appDummy.app.name
      request(app)
      .post("/v1/business/removeAppFromStore")
      .send( storeDummy.json )
      .end(function(err, res){
        if (err) console.log(err);
        delete storeDummy.json.app;
        res.body.apps.length.should.equal(0)
        done();
      });
    });


    it('should delete a store', function(done) {  
      request(app)
      .del("/v1/stores/")
      .send( storeDummy.json )
      .end(function(err, res){
        if (err) console.log(err);
        done();
      });
    });



  }); 
})


