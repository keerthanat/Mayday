
process.env.NODE_ENV = 'test';

var expect = require('expect.js');
var app;
var request = require('supertest'); 


suite('usercases test', function() {

setup('wait for db',function(done){
  app = require('../../main.js');
  setTimeout(function(){ done();},1000);

});

/*teardown('close server',function(done){
  app.close();
  done();
})*/

     test('1. post public message Perf Message', function(done) {
      request(app)
        .post('/performance/publicmessage') 
        .set('Content-Type', 'application/json')
        .send({ 'msg': 'hello test', 'user': 'keert'})  
        .expect('Content-Type', /json/)
        .end(function(err, res){
            expect(res).to.have.property('statusCode');
           // expect(res.body).to.have.property('message','Message posted!');
            if (err) throw err; 

           done();
        });
      });

    test('2. Get Perf messages', function(done) {
    request(app)
      .get('/performance/messages/wall')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success');
          expect(res.body).to.have.property('message','Messages found!');
          expect(res.body).to.have.property('result');
        if (err) expect(500);
         done();
      });
     });


});
