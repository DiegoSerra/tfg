const mongoose = require('mongoose');
const expect = require('chai').expect;

  const fileDAO = require(process.cwd() + '/server/api/file/dao/file-dao');
  const setupMongoose = require('../../_helpers/db').setupMongoose;



describe('fileDAO', () => {
  before(() => {
    setupMongoose(mongoose);
  });

  afterEach(() => {
    fileDAO.remove();
  })

  describe('getAll', () => {

  })

  describe('createNew', () => {

  })

  describe('removeById', () => {

  })
})
