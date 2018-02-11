'use strict';

import * as express from 'express';

export class ErrorHandler {

  static notFound(router: express.Router): void {
    router.all('/api/*', (req, res, next) => {
      res.status(404).send('Not Found');
    });
  }
}
