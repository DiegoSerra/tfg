'use strict';

import * as express from 'express';
import UserDao from '../user/user.dao';


import * as jwt from 'jsonwebtoken';

const jwtConst = require(`../../constants/${process.env.NODE_ENV}/jwt.json`);


export class AuthService {

  static needAuthenticate(req: any, res: express.Response, next: express.NextFunction) {

    const token = req.cookies.token || req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, jwtConst.secret, function (err, decodedUser) {
        if (err) {
          return res.json({
            success: false,
            noToken: true,
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, saveHandler to request for use in other routes
          req.user = decodedUser;
          next();
        }
      });

    } else {

      // if there is no token
      // return an error
      return res.status(200).send({
        success: false,
        noToken: true,
        message: 'No token provided.'
      });

    }
  }

  static me(req: any, res: express.Response, next: express.NextFunction) {
    return res.json(req.user);
  }

  static setTokenCookie(req: any, res: express.Response) {
    if (!req.user) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }

    const token = jwt.sign(req.user, jwtConst.secret, {});
    res.cookie('token', token);

    if (req['redirect']) {
      return res.status(200).redirect(req['redirectUrl'] ? req['redirectUrl'] : '/');
    }

    if (req['redirectUrl']) {
      return res.status(200).json({
        redirectPath: req['redirectUrl'],
        token
      });
    }

    return res.status(200).json({token});
  }

  static updateUser(req: any, res: express.Response, next: express.NextFunction) {
    UserDao
      ['getOneByQuery']({_id: req.user._id})
      .then(user => {
        req.user = user;
        next();
      });
  }

  static authActions(req: any, res: express.Response, next: express.NextFunction) {
    const promises = [];

    if (req.user.active === false) {
      req.query.reactive = 'account';
    }

    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        switch (key) {
          case 'join': {
            console.log('Trigger Action JOIN', req.query[key], req.user._id);
            break;
          }
          case 'reactive': {
            console.log('Trigger Action REACTIVE', req.query[key], req.user._id);
            break;
          }
        }
      }
    }


    Promise.all(promises).then(() => {
      next();
    });

  }

  static sendSuccessRegisterEmail(req: any, res: express.Response, next: express.NextFunction) {
    // MailSenderService.successfulRegisterMail(req['user'].email, req['user'].name);
    console.log('Send email');
    next();
  }

  static getTokenFromUser(user: any) {
    return jwt.sign(user, jwtConst.secret, {});
  }

}
