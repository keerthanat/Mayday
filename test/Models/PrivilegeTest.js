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

var privilege ='testUser';
var rule = 'performance';


test('create a new privilege  in database', function(done){
	console.log('inside test');
    models.PRIVILEGE.create({privilege: privilege, rule: rule})
    .then(function(res){
       expect(res).to.have.property('rule');
        expect(res.rule).to.equal('performance');
        done();
    });
  });


});