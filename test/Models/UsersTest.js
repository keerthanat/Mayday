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


test('create a new user in database', function(done){
	console.log('inside test');
   models.USERS.create({'user_id': 'abc', 'password': 'password' })
    .then(function(res){
        expect(res).to.have.property('user_id');
        done();
    });
  });

test('find all users from database', function(done){
	console.log('inside test');
   models.USERS.findAll({where:{user_id:'abc'}})
     .then(function(res){
      expect(res).to.be.an('object');
     expect(res[0].user_id).to.equal('abc');
      done();
    });
  });



});