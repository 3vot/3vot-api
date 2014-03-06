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
//var invoiceDummy = require("./dummy/invoice")

function startAndEnd(done){
  client = new pg.Client(process.env.POSTGRES_URL);
  client.connect(function(err) {
    if(err) return console.error('could not connect to postgres', err);
     client.query("delete from apps where name LIKE $1", [ "_delete%" ], function(err, result) {
        client.query("delete from profiles where user_name = $1", [ profileDummy.json.user_name ] , function(err, result) {
          done();
        });          
      });
  });
}

describe('3VOT Backend', function() {

  before(startAndEnd)
  after(startAndEnd)

  describe('App Tests', function() {
    
    before(function(done){
      profileDummy.create(function(){
        appDummy.json.profile_id = profileDummy.profile.id
        appDummy.json.public_dev_key = profileDummy.profile.security.public_dev_key
        done()
      });
    })
    
    describe('First Days', function() {
    
      it('should insert open source small App', function(done) {
        var date = new Date();
        date.setDate(1);
        appDummy.json.fakeDate = date;
        
        request(app)
        .post("/v1/apps/")
        .send( appDummy.json )
        .expect(200)
        .end(function(err, res){
          if (err) console.log(err);
          profileDummy.reload(function(){
            profileDummy.profile.credits.should.equal(12);
            profileDummy.profile.bills[0].amount.should.equal(3);
            res.body.billing.cost.should.equal(3);
            done()
          });
        });
      });

 

      it('should update open source App and not charge', function(done) {
        var date = new Date();
        date.setDate(1);
        appDummy.json.fakeDate = date;

        request(app)
        .post("/v1/apps/")
        .send( appDummy.json )
        .expect(200)
        .end(function(err, res){
          if (err) console.log(err);
          profileDummy.reload(function(){
            profileDummy.profile.credits.should.equal(12);
            profileDummy.profile.bills.length.should.equal(1);
            res.body.billing.cost.should.equal(3);
            done()
          });
        });
      });

      it('should update an open source small App to large', function(done) {
        var date = new Date();
        date.setDate(1);
        appDummy.json.fakeDate = date;
        appDummy.json.billing.size = 'large';

        request(app)
        .post("/v1/apps/")
        .send( appDummy.json )
        .expect(200)
        .end(function(err, res){
          if (err) console.log(err);
          profileDummy.reload(function(){
            res.body.billing.cost.should.equal(8);
            profileDummy.profile.credits.should.equal(4);
            profileDummy.profile.bills[profileDummy.profile.bills.length -1].amount.should.equal(8);

            done()
          });
        });
      });
      
      it('should update an open source large App to regular', function(done) {
        var date = new Date();
        date.setDate(1);
        appDummy.json.fakeDate = date;
        appDummy.json.billing.size = 'regular';
        
        request(app)
        .post("/v1/apps/")
        .send( appDummy.json )
        .expect(200)
        .end(function(err, res){
          if (err) console.log(err);
          profileDummy.reload(function(){
            profileDummy.profile.credits.should.equal(4);
            profileDummy.profile.bills.length.should.equal(2);
            res.body.billing.cost.should.equal(5);
            done()
          });
        });
      });
    }); 
    
    describe('Middle Days', function() {

      it('should insert open source small App the 15', function(done) {
        var date = new Date();
        date.setDate(15);
        appDummy.json.fakeDate = date;
        appDummy.json.billing.size = 'small';
        
        appDummy.json.name += "_"
        
        request(app)
        .post("/v1/apps/")
        .send( appDummy.json )
        .expect(200)
        .end(function(err, res){
          if (err) console.log(err);
          profileDummy.reload(function(){
            profileDummy.profile.credits.should.equal(2);
            profileDummy.profile.bills[profileDummy.profile.bills.length - 1 ].amount.should.equal(2);
            res.body.billing.cost.should.equal(3);
            done()
          });
        });
      });




    });      
  }); 
})

/*
  describe('CHARGE APPS', function() {
  
    before(function(done){
      invoiceDummy.invoiceJson.profile_id = profileDummy.profile.id
      invoiceDummy.create();
    })
  
    it('should insert app', function(done) {
  
      request(app)
      .post("/v1/business/bill")
      .send(  )
      .expect(200)
      .end(function(err, res){
        app = res.body;
        if (err) console.log(err);
        profileDummy.reload(function(){
          profileDummy.profile.credits.should.equal(12);
          profileDummy.profile.bills[0].amount.should.equal(3);
          app.billing.cost.should.equal(3);
          done()
        });
      });
    });
  });
  

  
  
});

*/
