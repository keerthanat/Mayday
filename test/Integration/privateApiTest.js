
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

      test('1.post Private Chat Message', function (done) {
         request(app)
          .post('/privatemessage/message')
          .set('Content-Type', 'application/json')
          .send({ 'msg': 'hello test', 'sender': 'keert', 'receiver':'coord', 'time_id':'2015-10-21 16:40'})
          .expect('Content-Type', /json/)
          .end(function(err,res){
              expect(res).to.have.property('statusCode');
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('message','Message sent!');
            if (err) throw err;
            done();
        });
    });

    test('2.Get Private Chat messages between 2 users', function(done) {
    request(app)
      .get('/privatemessage/messages/coord/keert')
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

      test('3. get message by id', function (done) {
        request(app)
            .get('/privatemessage/messages/2')
            .expect('Content-Type', /json/)
            .end(function(err,res){
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('success');
              expect(res.body).to.have.property('message','Message by id retrieved!');
               if (err) throw err;
              done();
            });
        });

});
