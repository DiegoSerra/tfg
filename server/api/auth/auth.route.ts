'use strict';

import * as express from 'express';

import {AuthService} from './auth.service';
import {LocalAuthController} from './local/local-auth.controller';
import {LocalRoute} from './local/local-auth.route';

export class AuthRoutes {
  static init(router: express.Router) {

    LocalAuthController.setup();
    LocalRoute.init(router);

    router
      .route('/api/user/me')
      .get(AuthService.needAuthenticate, AuthService.me);

  }
}
