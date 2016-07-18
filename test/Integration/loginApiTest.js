
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
  test('1.Sign Up user', function(done) {
      request(app)
        .post('/signupUser')
        .set('Content-Type', 'application/json')
        .send({"loginUsername":"sim","loginPassword":"rata"})
        .expect('Content-Type', /json/)
        .end(function(err, res) {
            expect(res).to.have.property('statusCode');
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('message','Enjoy your token!');
            if (err) throw err;           
            done();
        });
      });
    // test: user login 
   test('2.login User', function(done) {
      request(app)
        .post('/loginUser')
        .set('Content-Type', 'application/json')
        .send({"loginUsername":"sim","loginPassword":"rata"})
        .expect('Content-Type', /json/)
        .end(function(err, res) {
              expect(res).to.have.property('statusCode');
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('success');
              expect(res.body).to.have.property('message');
              expect(res.body).to.have.property('user');
              expect(res.body).to.have.property('token');
            if (err) throw err; 
            done();
        });
      });

});