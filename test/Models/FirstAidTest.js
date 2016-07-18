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


var topic ='Bandage';
var symptoms = 'Blood flow';
var steps = '1. stop 2. cover';

test('create a first aid in database', function(done){
	 models.FIRST_AID.create({topic: topic, symptoms: symptoms, steps: steps})
    .then(function(res){
      expect(res).to.have.property('topic');
      expect(res).to.have.property('symptoms');
      expect(res.steps).to.equal(steps);
      done();
    });
  });

test('find all first aid advice from database', function(done){
	console.log('inside test');
    models.FIRST_AID.findAll()
    .then(function(res){
      expect(res).to.be.an('object');
   //   expect(res[0].topic).to.be.equal('Bandage');
    //  expect(res[0].symptoms).to.be.equal('Blood flow');
      done();
    });
  });

});