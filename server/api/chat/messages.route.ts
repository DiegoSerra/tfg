'use strict';

import * as express from 'express';
import { MessagesController } from './messages.controller';
import {AuthService} from '../auth/auth.service';


export class MessageRoutes {
  static init(router: express.Router) {

    router
      .route('/api/chat/new')
      .post(AuthService.needAuthenticate, MessagesController.createNewConversation)

    router
      .route('/api/chat/sendMessage')
      .post(AuthService.needAuthenticate, MessagesController.sendMessage);

    router
      .route('/api/chat/:conversationId')
      .get(MessagesController.getConversationMessages);

    router
      .route('/api/chat/users/:userId')
      .get(AuthService.needAuthenticate, MessagesController.getConversationMessagesByUsers);
  }
}
