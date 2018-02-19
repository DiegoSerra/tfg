'use strict';

import * as express from 'express';
import {AuthService} from '../auth/auth.service';
import {MapController} from './map.controller';
import {MessagesController} from '../chat/messages.controller';

import * as multipart from 'connect-multiparty';
const multipartMiddleware = multipart();

export class MapRoutes {
  static init(router: express.Router) {
    router
      .route('/api/map')
      .get(MapController.getAll)
      .post(AuthService.needAuthenticate, MapController.createNew);

    router
      .route('/api/map/me')
      .get(AuthService.needAuthenticate, MapController.getAllMe);

    router
      .route('/api/map/race/:raceId')
      .get(MapController.getOneByRaceId);

    router
      .route('/api/map/files')
      .get(MapController.getFileNames);
      
    router
      .route('/api/map/:id')
      .get(MapController.getOne)
      .put(AuthService.needAuthenticate, MapController.updateOne)
      .delete(AuthService.needAuthenticate, MapController.removeById);


  }
}
