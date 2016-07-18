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
   test('1.publish announcements', function (done) {
         request(app)
          .post('/announcement/publishAnnon')
          .set('Content-Type', 'application/json')
          .send({ 'user_id': 'keert', 'annon': 'testing', 'time_id':'2015-10-21 16:40'})
          .expect('Content-Type', /json/)
          .end(function(err,res){
            expect(res).to.have.property('statusCode');
            expect(res.statusCode).to.equal(201);
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('message','Announcement stored!');
            if (err) throw err;
            done();
          });
    });

     test('2.Get historic announcements', function(done) {
      request(app)
        .get('/announcement/getHistory')   
        .expect('Content-Type', /json/)
        .end(function(err, res){
            expect(res).to.have.property('statusCode');
            expect(res.statusCode).to.equal(201);
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('message','Get historic announcements');
          if (err) throw err;
           done();
        });
      });
  
     
});