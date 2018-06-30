'use strict';

import MapDao from '../map/map.dao';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();
chai.use(chaiHttp);


describe('The map module', function () {
  it('get all maps', function(done){
    chai.request(server)
      .get('/api/map')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        done();
      });
  });

  it('get all my maps', function(done) {
    const me = {_id: '5a7f3f34518142383c1767c8', name: 'Admin'};
    chai.request(server)
      .get('/api/map/me')
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
      .post('/api/map')
      .send({
        'raceId' : '5b237c6c21ec723100db18ce',
        'gpx' : 'assets/tracks/15kValldigna.geojson',
        '__v' : 0
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        done();
      });
  });

});
