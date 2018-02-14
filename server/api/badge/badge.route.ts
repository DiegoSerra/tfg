'use strict';

import * as express from 'express';
import {AuthService} from '../auth/auth.service';
import {BadgeController} from './badge.controller';

import * as multipart from 'connect-multiparty';
const multipartMiddleware = multipart();

export class BadgesRoutes {
  static init(router: express.Router) {
    router
      .route('/api/badge')
      .get(BadgeController.getAll)
      .post(AuthService.needAuthenticate, BadgeController.createNew);

    router
      .route('/api/badge/:userId')
      .get(BadgeController.getAllMe)
      .put(BadgeController.updateBadges);

    router
      .route('/api/badge/chat/:userId')
      .put(BadgeController.updateNewChats);
  }
}
