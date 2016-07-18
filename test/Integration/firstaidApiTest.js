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
})
*/
     test('1.Retrieve first aid messages', function(done) {
      request(app)
        .get('/firstaid/topic/asth')   
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
            expect(res).to.have.property('statusCode');
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('message','Messages retrieved!');
            if (err) throw err;
              done();
        });
      });
  
      test('2.Post firstaid message', function (done) {
         request(app)
          .post('/firstaid/savefirstaid')
          .set('Content-Type', 'application/json')
          .send({ 'topic': 'testing', 'symptoms': 'testing', 'steps':'test'})
          .expect('Content-Type', /json/)
          .end(function(err,res){
            expect(res).to.have.property('statusCode');
            expect(res.statusCode).to.equal(201);
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('message','Saved!');
            if (err) throw err;
            done();
        });
    });


});