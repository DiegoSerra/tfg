const mongoose = require('mongoose');
const expect = require('chai').expect;

  const eventDAO = require(process.cwd() + '/server/api/event/dao/event-dao');
  const setupMongoose = require('../../_helpers/db').setupMongoose;



describe('eventDAO', () => {
  before(() => {
    setupMongoose(mongoose);
  });

  afterEach(() => {
    eventDAO.remove();
  })

  describe('getAll', () => {

  })

  describe('createNew', () => {

  })

  describe('removeById', () => {

  })
})
