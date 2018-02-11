'use strict';

import * as express from 'express';
import * as passport from 'passport';

import {LocalAuthController} from './local-auth.controller';
import {AuthService} from '../auth.service';

export class LocalRoute {

  static init(router: express.Router) {
    router
      .post('/api/authenticate',
        (req: any, res: express.Response, next: express.NextFunction) => {
          passport.authenticate('local', (err, user, info) => {
            const error = err || info;
            if (error) {
              return res.status(401).json(error);
            }
            if (!user) {
              return res.status(404).json({message: 'Something went wrong, please try again.'});
            }

            req.query.redirect = req.query.next || `${req.headers.referer}/app`;
            req.user = user;
            next();
          })(req, res, next);
        },
          LocalAuthController.callback,
          AuthService.authActions,
          AuthService.setTokenCookie
      );

    return router;
  }
}
