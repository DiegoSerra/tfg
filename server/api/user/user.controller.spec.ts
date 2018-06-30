'use strict';

import UserDAO from './user.dao';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();
chai.use(chaiHttp);


describe('The user module', function () {
  it('get all users', function(done){
    chai.request(server)
      .get('/api/user')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        done();
      });
  });

  it('get user by id', function(done) {
    const _id = '5abfb1d9fd5bae366843b789';
    chai.request(server)
      .get('/api/user')
      .send(_id)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        done();
      });
  });

  it('create new', function(done) {
    const _id = '5abfb1d9fd5bae366843b789';
    chai.request(server)
      .post('/api/user')
      .send({name: 'test', email: 'test@tfg.com', password: 'passwordTfg1'})
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        done();
      });
  });

  it('update one', function(done) {
    const _id = '5abfb1d9fd5bae366843b789';
    chai.request(server)
      .put('/api/user')
      .send({user: {_id, name: 'testchanged', email: 'testchanged@tfg.com'}})
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        done();
      });
  });

});
