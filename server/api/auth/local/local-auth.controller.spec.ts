'use strict';

import * as express from 'express';
import * as passport from 'passport';

import {LocalAuthController} from './local-auth.controller';

const expect = require('chai').expect;

describe('The local auth module', function () {
  it('setup', function * () {
    const email = 'test@tfg.com';
    const password = 'passwordTfg1';
    const setupStub = this.sandbox.stub(passport, 'use', function (localStrategy, cb) {
      cb(email, password, null);
    });

    const result = yield LocalAuthController.setup();

    expect(setupStub).to.be.calledWith();
    expect(result).to.eql('page');
  });
});
