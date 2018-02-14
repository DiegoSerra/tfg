'use strict';

import * as express from 'express';
import BadgeDao from './badge.dao';

export class BadgeController {

  static getAll(req: express.Request, res: express.Response) {
    BadgeDao
      ['getAll']()
      .then(badges => res.status(200).json(badges))
      .catch(error => res.status(400).json(error));
  }

  static getAllMe(req: express.Request, res: express.Response) {
    BadgeDao
      ['getAll']({userId: req.params.userId})
      .then(badges => res.status(200).json(badges))
      .catch(error => res.status(400).json(error));
  }

  static createNew(req: express.Request, res: express.Response, next: express.NextFunction) {
    const _badge = req.body;

    BadgeDao
      ['createNew'](_badge)
      .then(badge => res.status(200).json(badge))
      .catch(error => res.status(400).json(error));
  }

  static updateBadges(req: express.Request, res: express.Response) {
    const userId = req.params.userId;
    const query = req.body;

    BadgeDao
      ['updateBadges'](userId, query)
      .then(badge => {
        res.status(201).json(badge);
      })
      .catch(error => res.status(400).json(error));
  }

  static updateNewChats(req: any, res: express.Response, next: express.NextFunction) {
    const quantity = req.body.quantity || 1;
    const userId = req.params.userId;
    
    BadgeDao.incrementChats(userId, quantity)
      .then(user => next())
      .catch(error => res.status(400).json(error));
  }

}
