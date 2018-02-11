'use strict';

import * as express from 'express';
import UserDAO from './user.dao';
import RaceDao from '../race/race.dao';
import {ExcelService} from '../../services/excel.service';

const randomToken = require('rand-token');

export class UserController {

  static getAll(req: any, res: express.Response) {
    UserDAO.getAll(req.query.filter ? {_id: {$in: req.query.filter}} : {})
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json(error));
  }

  static getUserById(req: any, res: express.Response) {
    UserDAO.getOneByQuery({_id: req.params.userId})
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json(error));
  }

  static createNew(req: any, res: express.Response, next: express.NextFunction) {
    const _user = req.body;
    _user.provider = 'local';
    _user.isValid = false;
    _user.validateToken = randomToken.generate(16);

    const inviteedBy = req.query.invite;
    const invitedType = req.query.type;
    const campaign = req.query.campaign;

    UserDAO.createNew(_user)
      .then(user => {
        req.user = user._doc;
        return user;
      })
      .then(data => next())
      .catch(error => console.log(error));
  }

  static updateOne(req: any, res: express.Response, next: express.NextFunction) {
    const userId = req.user._id;
    const user = req.body.user;

    UserDAO
      ['updateOne'](userId, user)
      .then(result => {
        next();
      })
      .catch(error => {
        res.status(400).json(error);
      });
  }

  static activateAccount(req: any, res: express.Response) {
    const _id = req.params.userId;

    UserDAO.findAndUpdate({_id}, req.body)
      .then((user) => {
        const eventsId = user.events.map(event => event.eventId);
        return RaceDao.updateAll(eventsId, {active: true});
      })
      .then((updated) => {
        return res.status(201).json(updated);
      })
      .catch(error => {
        return res.status(400).json(error);
      });
  }

  static deactiveAccount(req: any, res: express.Response) {
    const _id = req.params.userId;
    const hostUrl = req.headers.origin;

    UserDAO.findAndUpdate({_id}, {active: false})
      .then((user) => {
        const eventsId = user.events.map(event => event.eventId);
        return RaceDao.updateAll(eventsId, {active: false});
      })
      .then((updated) => {
        return res.status(201).json(updated);
      })
      .catch(error => {
        return res.status(400).json(error);
      });
  }

  static removeById(req: any, res: express.Response) {
    const _id = req.params.userId;

    UserDAO.removeById(_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  // static uploadProfileImage(req: any, res: express.Response, next: express.NextFunction) {
  //   const userId = req.user._id;
  //   const file = req['files'].file;

  //   S3Uploader.uploadLocalFile(file.path, `profile/${userId}`, {CacheControl: 'max-age=31536000'})
  //     .then(result => {
  //       UserDAO.updateOne(userId, {'profileImageUrl': result['Location']})
  //         .then(() => next())
  //         .catch(dbError => res.status(400).json(dbError));
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       res.status(500).send(err);
  //     });
  // }

  // static uploadCoverImage(req: any, res: express.Response, next: express.NextFunction) {
  //   const userId = req.user._id;
  //   const file = req['files'].file;
  //   S3Uploader.uploadLocalFile(file.path, `cover/${userId}`, {CacheControl: 'max-age=31536000'})
  //     .then(result => {
  //       UserDAO.updateOne(userId, {'coverImageUrl': result['Location']})
  //         .then((user) => next())
  //         .catch(dbError => res.status(400).json(dbError));
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       res.status(500).send(err);
  //     });
  // }

  // static getProfileImage(req: any, res: express.Response, next: express.NextFunction) {
  //   const userId = req.params.id;
  //   S3Uploader.getImage(`profile/${userId}`, res)
  //     .then(() => {
  //       return res.end();
  //     })
  //     .catch((error) => {
  //       S3Uploader.getImage(`profile/default`, res)
  //         .then(() => {
  //           return res.end();
  //         })
  //         .catch(defaultError => {
  //           res.status(404).send();
  //         });
  //     });
  // }

  // static getCoverImage(req: any, res: express.Response, next: express.NextFunction) {
  //   const userId = req.params.id;
  //   S3Uploader.getImage(`cover/${userId}`, res)
  //     .then(() => {
  //       return res.end();
  //     })
  //     .catch(() => {
  //       S3Uploader.getImage(`cover/default`, res)
  //         .then(() => {
  //           return res.end();
  //         })
  //         .catch(defaultError => {
  //           return res.status(500).json({
  //             error: defaultError
  //           });
  //         });
  //     });
  // }

  static search(req: any, res: express.Response, next: express.NextFunction) {
    const searchText = req.query.search;

    UserDAO.getAll(
      {'email': {'$regex': searchText, '$options': 'i'}},
      {'name': {'$regex': searchText, '$options': 'i'}}
    )
      .then(courses => res.status(200).json(courses))
      .catch(error => res.status(400).json(error));
  }

  static updateUserChat(req: any, res: express.Response, next: express.NextFunction) {
    UserDAO.updateOne(req['user']._id, {'status': req.body.status})
      .then(user => next())
      .catch(error => res.status(400).json(error));
  }

  static updateBadges(req: any, res: express.Response, next: express.NextFunction) {
    req['user'] = req.body.user;
    UserDAO.updateOne(req['user']._id, req.body.user)
      .then(user => next())
      .catch(error => res.status(400).json(error));
  }

  static updateNewChats(req: any, res: express.Response, next: express.NextFunction) {
    const quantity = req.body.quantity || 1;
    UserDAO.incrementNewChats(req['user']._id, quantity)
      .then(user => next())
      .catch(error => res.status(400).json(error));
  }

  static getChats(req: any, res: express.Response, next: express.NextFunction) {
    UserDAO.getChats(req.user._id)
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json(error));
  }

  static validateUser(req: any, res: express.Response, next: express.NextFunction) {
    const token = req.query.token;

    UserDAO.updateOneByToken(token, {'isValid': true})
      .then(user =>
        res.redirect('/app/trip/all')
      )
      .catch(error =>
        res.status(400).json(error)
      );

  }

  static forgotPassword(req: any, res: express.Response, next: express.NextFunction) {

    const email = req.body.email;

    const hostUrl = req.headers.origin;

    const passwordToken = randomToken.generate(16);

    const resetPasswordExpires = Date.now() + 3600000;

    UserDAO.findAndUpdate({email}, {'passwordToken': passwordToken, 'resetPasswordExpires': resetPasswordExpires})
      .then((user) => {
        return user;
      })
      .then((updated) => {
        return res.status(200).json(updated);
      })
      .catch(error => {
        return res.status(400).json(error);
      });

  }

  static passwordReset(req: any, res: express.Response, next: express.NextFunction) {
    const passwordToken = req.query.passwordToken;
    const newPassword = req.body.newPassword;

    UserDAO.getOneByQuery({'passwordToken': passwordToken, 'resetPasswordExpires': {'$gt': Date.now()}})
      .then(user => {
        if (!user) {
          throw Error('Password reset token is invalid or has expired');
        }
        return UserDAO['resetPassword'](passwordToken, newPassword);
      })
      .then((user) => {
        req['user'] = user.toObject();
        req['redirectUrl'] = '/app';
        next();
      })
      .catch(error => {
        return res.status(400).json({message: error.message});
      });

  }

  static updateEmail(req: any, res: express.Response, next: express.NextFunction) {
    const userId = req.user._id;
    const email = req.body.email;

    UserDAO.updateUserEmail(userId, email)
      .then(() => {
        // next() CALL AuthService.updateUser > AuthService.setTokenCookie
        next();
      })
      .catch(error => {
        return res.status(400).json(error);
      });
  }

  static updateName(req: any, res: express.Response, next: express.NextFunction) {
    const userId = req.user._id;
    const name = req.body.name;

    UserDAO.updateUserName(userId, name)
      .then(() => {
        // next() CALL AuthService.updateUser > AuthService.setTokenCookie
        next();
      })
      .catch(error => {
        return res.status(400).json(error);
      });
  }

  static updateProfileInfo(req: any, res: express.Response, next: express.NextFunction) {
    const userId = req.user._id;
    const body = req.body;

    UserDAO.updateOne(userId, body)
      .then(() => next())
      .catch(dbError => res.status(400).json(dbError));
  }
}
