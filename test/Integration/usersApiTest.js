
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
     test('1.Online Users', function(done) {
      request(app)
        .get('/users/onlineUsers')   
        .expect('Content-Type', /json/)
        .end(function(err, res){
            expect(res).to.have.property('statusCode');
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('online');
            expect(res.body).to.have.property('message','Fetched Online User List!');
          if (err) throw err;
           done();
        });
      });
  
     test('2.get one user', function(done) {
      request(app)
        .get('/users/user/keert')   
        .expect('Content-Type', /json/)
        .end(function(err, res){
            expect(res).to.have.property('statusCode');
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('user');
            expect(res.body).to.have.property('message','Fetched a Single User!');
          if (err) throw err;
           done();
        });
      });


   test('3.Update user', function (done) {
       request(app)
        .put('/users/updateUser/keert')
        .set('Content-Type', 'application/json')
        .send({ 'time_id': '2015-10-21 16:40', 'lat':'3', 'long': '4' })
        .expect('Content-Type', /json/)
        .end(function(err,res){
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('uid');
            expect(res.body).to.have.property('message','User updated successfully!');
          if (err) throw err;
          done();
      });
    });


});
