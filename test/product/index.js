var app = require('../../server');
var request = require('supertest')(app);
var should = require("should"); 

describe('site/test.js', function() {
  var loginname = 'yuanzm' + Math.random(1);
  var password = 'password';

  describe('sign up', function() {
    it('should sign up an user', function(done) {
      request.post('/user/signup')
      .send({
        name: loginname,
        password: password
      })
      .expect(200, function(err, res) {
        should.not.exist(err);
        res.text.should.containEql('注册成功');
        done();
      });
    });
    it('should not sign up an user when it is exist', function(done) {
      request.post('/user/signup')
      .send({
        name: loginname,
        password: password
      })
      .expect(200, function(err, res) {
        should.not.exist(err);
        res.text.should.containEql('用户已经存在');
        done();
      });
    });
  });

  describe('sign in', function(done) {
    it('should not sign in successful when loginname is not exist', function(done) {
      request.post('/user/signin')
      .send({
        // 之前的测试用例已经注册了用户名为loginname的用户，现在改变一下loginname的值，确保该用户不存在
        name: loginname + '1',
        password: password
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.text.should.containEql('用户不存在');
        done();
      });
    });
    it('should not sign in successful when password is wrong', function(done) {
      request.post('/user/signin')
      .send({
        name: loginname,
        password: password + '1' // 在用户名存在的前提下改变密码的值
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.text.should.containEql('用户密码错误');
        done();
      });
    });
    it('should sign in successful', function(done) {
      request.post('/user/signin')
      .send({
        name: loginname,
        password: password
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.text.should.containEql('登录成功');
        done();
      });
    });
  })
});
