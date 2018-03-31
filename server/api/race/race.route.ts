'use strict';

import * as express from 'express';
import {AuthService} from '../auth/auth.service';
import {RaceController} from './race.controller';
import {MessagesController} from '../chat/messages.controller';

import * as multipart from 'connect-multiparty';
const multipartMiddleware = multipart();

export class RaceRoutes {
  static init(router: express.Router) {
    router
      .route('/api/race')
      .get(RaceController.getAll)
      .post(AuthService.needAuthenticate, RaceController.createNew);

    router
      .route('/api/race/me')
      .get(AuthService.needAuthenticate, RaceController.getAllMe);

    router
      .route('/api/race/search')
      .get(RaceController.search);

    router
      .route('/api/race/:id')
      .get(RaceController.getOne)
      .put(AuthService.needAuthenticate, RaceController.updateOne)
      .delete(AuthService.needAuthenticate, RaceController.removeById);

    router
      .route('/api/race/:id/import')
      .post(
        AuthService.needAuthenticate,
        multipartMiddleware,
        RaceController.importRaces
      );

  }
}
