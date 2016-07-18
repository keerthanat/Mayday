
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
 test('1. public wall', function (done) {
    request(app)
        .get('/publicmessage/wall')
        .expect('Content-Type', /json/)
        .end(function(err,res){
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('message','Messages found!');
          if (err) throw err; 
          done();
        });
    });

 test('2. user connected', function (done) {
    request(app)
        .get('/publicmessage/userConnected/keert')
        .expect('Content-Type', /json/)
        .end(function(err,res){
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success');
          if (err) throw err; 
          done();
        });
    });
 
 test('3. chat scroll up', function (done) {
    request(app)
        .get('/publicmessage/chatScrollUp/5')
        .expect('Content-Type', /json/)
        .end(function(err,res){
            expect(res).to.have.property('statusCode');
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('messages');
          if (err) throw err; 
          done();
        });
    });

  test('4.post public Chat Message', function (done) {
         request(app)
          .post('/publicmessage/message')
          .set('Content-Type', 'application/json')
          .send({'user_id':'keert','msg':'i am public','time_id':'2015-10-21 16:40'})
          .expect('Content-Type', /json/)
          .end(function(err,res){
              expect(res).to.have.property('statusCode');
              expect(res.statusCode).to.equal(201);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('success');
              expect(res.body).to.have.property('message','Message posted!');
              if (err) throw err;
            done();
        });
    });

});
