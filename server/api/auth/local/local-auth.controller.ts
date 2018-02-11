'use strict';

import * as express from 'express';
import * as passport from 'passport';
import * as base64url from 'base64-url';

import {Strategy as LocalStrategy} from 'passport-local';

import User from '../../user/user.dao';

export class LocalAuthController {

  static setup() {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
      },
      (email, password, done) => {
        User.findOne({
          email: email.toLowerCase()
        }, (err, user) => {
          if (err) {
            return done(err);
          }

          if (!user) {
            return done(null, false, {message: 'This email is not registered.', email: true});
          }
          if (!user.authenticate(password)) {
            return done(null, false, {message: 'This password is not correct.', password: true});
          }

          return done(null, user);
        });
      }
    ));
  }

  static callback(req: any, res: express.Response, next: express.NextFunction) {
    req['redirect'] = false;
    req.user = req.user._doc;
    next();
  }

}
