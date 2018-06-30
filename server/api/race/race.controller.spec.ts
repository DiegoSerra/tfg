'use strict';

import RaceDao from '../race/race.dao';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();
chai.use(chaiHttp);


describe('The race module', function () {
  it('get all races', function(done){
    chai.request(server)
      .get('/api/race')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        done();
      });
  });

  it('get all my races', function(done) {
    const me = {_id: '5a7f3f34518142383c1767c8', name: 'Admin'};
    chai.request(server)
      .get('/api/race/me')
      .send(me)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        done();
      });
  });

  it('create new', function(done) {
    chai.request(server)
      .post('/api/race')
      .send({name: 'test', kms: 10})
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        done();
      });
  });

});
