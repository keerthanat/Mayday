process.env.NODE_ENV = 'test';

var expect = require('expect.js');
var models = require('../../models');
var app;

suite('usercases test', function() {

setup('wait for db',function(done){
  app = require('../../main.js');
  setTimeout(function(){ done();},1000);
});

// teardown('close server',function(done){
//   app.close();
//   done();
// })

var sender ='keert';
var receiver ='coord';
var msg = 'hi test';
var time_id = '2015-10-21 16:40';
var first_msg_id =1;

test('create a new private message in database', function(done){
	console.log('inside test');
    models.PRIVATE_MESSAGES.create({sender: sender, receiver: receiver ,msg: msg, time_id:time_id})
    .then(function(res){
      expect(res).to.have.property('sender');
      expect(res.msg).to.equal(msg);
      expect(res).to.have.property('receiver');
      done();
    });
  });

test('find One private message from database', function(done){
     models.PRIVATE_MESSAGES.findById(first_msg_id)
     .then(function(res){
       expect(res.msg_id).to.equal(first_msg_id); 
       expect(res).to.have.property('user_id');
       expect(res.msg).to.equal(msg);
      // expect(res).to.have.property('');
       done();
     });
  });
test('find all private message from database', function(done){
	 models.PRIVATE_MESSAGES.findAll()
    .then(function(res){
      expect(res).to.be.an('object');
      expect(res[0].msg_id).to.be.equal(first_msg_id);
     // expect(res[0].msg).to.be.equal(first_msg);
      done();
    });
  });

});