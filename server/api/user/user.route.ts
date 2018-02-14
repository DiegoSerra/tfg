'use strict';

import * as express from 'express';
import {UserController} from './user.controller';
import {AuthService} from '../auth/auth.service';

import * as multipart from 'connect-multiparty';

const multipartMiddleware = multipart();

export class UserRoutes {
  static init(router: express.Router) {
    router
      .route('/api/user')
      .get(AuthService.needAuthenticate,
        UserController.getAll)

      .put(AuthService.needAuthenticate,
        UserController.updateOne,
        AuthService.updateUser,
        AuthService.setTokenCookie)

      .post(UserController.createNew,
        AuthService.authActions,
        AuthService.updateUser,
        AuthService.setTokenCookie);

    router
      .route('/api/user/search')
      .get(UserController.search);

    // router
    //   .route('/api/user/image/profile/:id')
    //   .get(UserController.getProfileImage);

    // router
    //   .route('/api/user/image/cover/:id')
    //   .get(UserController.getCoverImage);

    // router
    //   .route('/api/me/uploadProfileImage')
    //   .post(AuthService.needAuthenticate,
    //     multipartMiddleware,
    //     UserController.uploadProfileImage,
    //     AuthService.updateUser,
    //     AuthService.setTokenCookie);

    // router
    //   .route('/api/me/uploadCoverImage')
    //   .post(AuthService.needAuthenticate,
    //     multipartMiddleware,
    //     UserController.uploadCoverImage,
    //     AuthService.updateUser,
    //     AuthService.setTokenCookie);

    router
      .route('/api/me/chat-status')
      .post(AuthService.needAuthenticate,
        UserController.updateUserChat,
        AuthService.updateUser,
        AuthService.setTokenCookie);

    router
      .route('/api/user/chats')
      .get(AuthService.needAuthenticate,
        UserController.getChats);

    router
      .route('/api/user/validate')
      .get(UserController.validateUser);

    router
      .route('/api/user/forgotPassword')
      .post(UserController.forgotPassword);

    router
      .route('/api/user/passwordReset')
      .post(UserController.passwordReset,
        AuthService.setTokenCookie);

    router
      .route('/api/user/email')
      .put(AuthService.needAuthenticate,
        UserController.updateEmail,
        AuthService.updateUser,
        AuthService.setTokenCookie
      );

    router
      .route('/api/user/name')
      .put(AuthService.needAuthenticate,
        UserController.updateName,
        AuthService.updateUser,
        AuthService.setTokenCookie);

    router
      .route('/api/user/profileInfo')
      .put(AuthService.needAuthenticate,
        UserController.updateProfileInfo,
        AuthService.updateUser,
        AuthService.setTokenCookie);

    router
      .route('/api/user/:userId')
      .get(AuthService.needAuthenticate, UserController.getUserById)
      .put(UserController.activateAccount)
      .delete(UserController.deactiveAccount);
      // .delete(UserController.removeById);
  }
}
