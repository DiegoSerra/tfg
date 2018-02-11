const mongoose = require('mongoose');
const expect = require('chai').expect;

  const spaceDAO = require(process.cwd() + '/server/api/space/dao/space-dao');
  const setupMongoose = require('../../_helpers/db').setupMongoose;



describe('spaceDAO', () => {
  before(() => {
    setupMongoose(mongoose);
  });

  afterEach(() => {
    spaceDAO.remove();
  })

  describe('getAll', () => {

  })

  describe('createNew', () => {

  })

  describe('removeById', () => {

  })
})
