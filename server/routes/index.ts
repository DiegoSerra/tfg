import * as express from 'express';

import {UserRoutes} from '../api/user/user.route';
import {AuthRoutes} from '../api/auth/auth.route';

import {StaticDispatcher} from '../commons/static/index';

import {MessageRoutes} from '../api/chat/messages.route';

import {ErrorHandler} from '../config/error-handler.config';
import {RaceRoutes} from '../api/race/race.route';
import {MapRoutes} from '../api/map/map.route';

export class Routes {
  static init(app: express.Application, router: express.Router) {

    UserRoutes.init(router);
    AuthRoutes.init(router);
    
    MessageRoutes.init(router);
    RaceRoutes.init(router);
    MapRoutes.init(router);

    ErrorHandler.notFound(router);

    router
      .route('*')
      .get(StaticDispatcher.sendIndex);

    app.use('/', router);
  }
}
