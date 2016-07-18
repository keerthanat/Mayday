process.env.NODE_ENV = 'test';

var expect = require('expect.js');
var models = require('../../models');
var app;

suite('usercases test', function() {

setup('wait for db',function(done){
  app = require('../../main.js');
  setTimeout(function(){ done();},1000);

});

/*teardown('close server',function(done){
  app.close();
  done();
})*/

var user_id ='keert';
var annon = 'hi annon';
var time_id = '2015-10-21 16:40';

test('create a new annon in database', function(done){
    models.ANNOUNCEMENTS.create({user_id: user_id, annon: annon, time_id: time_id})
    .then(function(res){
      expect(res).to.have.property('user_id');
      expect(res.annon).to.equal('hi annon');
      done();
    });
  });


test('find all announcements from database', function(done){
   models.ANNOUNCEMENTS.findAll({where:{user_id:'keert'}})
     .then(function(res){
      expect(res).to.be.an('object');
    // expect(res[0].msg_id).to.be.within(0, Infinity);
     // expect(res[0].annon).to.equal('hi annon');
      done();
     });
  });

});

