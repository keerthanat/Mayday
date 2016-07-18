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

var user_id ='keert';
var msg = 'hi perf test';
var time_id = '2015-10-21 16:40';
var first_msg ='hello test';

test('create a perf message in database', function(done){
	console.log('inside test');
  models.PERF_MESSAGES.create({user_id: user_id, msg: msg, time_id:time_id})
    .then(function(res){
      expect(res).to.have.property('msg_id');
      expect(res.msg).to.equal(msg);
      expect(res).to.have.property('user_id');
      done();
    });
  });


test('find all performance messages from database', function(done){
     models.PERF_MESSAGES.findAll()
    .then(function(res){
      expect(res).to.be.an('object');
      expect(res[0].user_id).to.be.equal(user_id);
      expect(res[0].msg).to.be.equal(msg);
      done();
    });
  });




});