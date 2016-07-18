process.env.NODE_ENV = 'test';

var expect = require('expect.js');
var models = require('../../models');

suite('usercases test', function() {


setup('wait for db',function(done){
  app = require('../../main.js');
  setTimeout(function(){ done();},1000);
});

// teardown('close server',function(done){
//   app.close();
//   done();
// })
  
var user_id ='keert';
var msg = 'hi test';
var time_id = '2015-10-21 16:40';
var first_msg_id =1;
var limit = 2;

test('create a new public message in database', function(done){
    models.MESSAGES.create({user_id: user_id, msg: msg, time_id: time_id})
    .then(function(res){
      expect(res).to.have.property('user_id');
      expect(res.msg).to.equal(msg);
      done();
    });
  });

test('find One message from database', function(done){
     models.MESSAGES.findOne({ order: 'msg_id'})
     .then(function(res){
       expect(res.msg_id).to.equal(first_msg_id); 
       expect(res).to.have.property('user_id');
       expect(res.msg).to.equal(msg);
      // expect(res).to.have.property('');
       done();
     });
  });

test('find all public message from database', function(done){
	 models.MESSAGES.findAll()
     .then(function(res){
      expect(res).to.be.an('object');
      expect(res[0].msg_id).to.be.within(0, Infinity);
      expect(res[0].msg).to.equal('hi test');
       done();
     });
  });

test('find messages  by limit from database', function(done){
     models.MESSAGES.findAll({ limit: limit , order:'msg_id'})
     .then(function(res){
      expect(res).to.be.an('object');
      expect(res[0].msg_id).to.be.within(first_msg_id,Infinity);
      done();
    });
  });


});