process.env.NODE_ENV = 'test';

var expect = require('expect.js');
var app;
var request = require('supertest'); 


suite('usercases test', function() {

setup('wait for db',function(done){
  app = require('../../main.js');
  setTimeout(function(){ done();},1000);

});

// teardown('close server',function(done){
//   app.close();
//   done();
// })

     test('1.Get administration data', function(done) {
        request(app)
          .get('/admin/active') 
          .expect('Content-Type', /json/)  
          .end(function(err, res){
            expect(res).to.have.property('statusCode');
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success');
            if (err) throw err;
             done();
          });
      });

       test('2.put administration data', function(done) {
        request(app)
          .put('/admin/active/keert') 
          .expect('Content-Type', /json/) 
          .end(function(err, res){
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('success');
              expect(res.body).to.have.property('message','User updated successfully!');
            if (err) throw err;
             done();
          });
      });
  
     test('3.Update user by id', function (done) {
         request(app)
          .post('/admin/updateUser/keert/coord')
          .set('Content-Type', 'application/json')
          .send({ 'user_id': 'coord', 'password': 'hello', 'privilege':'4', 'acc_active':'1'})
          .end(function(err,res){
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('success');
              expect(res.body).to.have.property('message','User updated successfully!');
              expect(res.body).to.have.property('user');
            if (err) throw err;
            done();
        });
    });     


});