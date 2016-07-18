
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

 test('1. search announcements', function (done) {
    request(app)
        .get('/search/announcements')
        .set('Content-Type', 'application/json')
        .send({ 'searchTxt': 'Tsu'})
        .expect('Content-Type', "text/html; charset=utf-8")
        .end(function(err,res){
            if(res.length === 0){
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('hasError','true');
              expect(res.body).to.have.property('error','No results found!');
            }
          if (err) throw err; 
          done();
        });
    });
  
  test('2. search publicChat', function (done) {
    request(app)
        .get('/search/publicChat')
        .set('Content-Type', 'application/json')
        .send({ 'searchTxt': 'hi'})
        .expect('Content-Type', "text/html; charset=utf-8")
        .end(function(err,res){
              if(res.length === 0){
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('hasError','true');
                expect(res.body).to.have.property('error','No results found!');
            }
          if (err) throw err;
          done();
        });
    });

   test('3. search private chat', function (done) {
    request(app)
        .get('/search/privateChat')
        .set('Content-Type', 'application/json')
        .send({ 'searchTxt': 'hello'})
        .expect('Content-Type', "text/html; charset=utf-8")
        .end(function(err,res){
             if(res.length === 0){
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('hasError','true');
                expect(res.body).to.have.property('error','No results found!');
            }
          if (err) throw err;
          done();
        });
    });

   test('4. search citizen name', function (done) {
    request(app)
        .get('/search/cName')
        .set('Content-Type', 'application/json')
        .send({ 'searchTxt': 'user'})
        .expect('Content-Type', "text/html; charset=utf-8")
        .end(function(err,res){
             if(res.length === 0){
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('hasError','true');
                expect(res.body).to.have.property('error','No results found!');
            }
          if (err) throw err;
          done();
        });
    });

   test('5. search citizen status', function (done) {
    request(app)
        .get('/search/cStatus')
        .set('Content-Type', 'application/json')
        .send({ 'searchTxt': 'user'})
        .expect('Content-Type', "text/html; charset=utf-8")
        .end(function(err,res){
             if(res.length === 0){
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('hasError','true');
                expect(res.body).to.have.property('error','No results found!');
            }
          if (err) throw err;
          done();
        });
    });

   test('6. search first aid', function (done) {
    request(app)
        .get('/search/firstaid')
        .set('Content-Type', 'application/json')
        .send({ 'searchTxt': 'user'})
        .expect('Content-Type', "text/html; charset=utf-8")
        .end(function(err,res){
             if(res.length === 0){
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('hasError','true');
                expect(res.body).to.have.property('error','No results found!');
            }
          if (err) throw err;
          done();
        });
    });
});
