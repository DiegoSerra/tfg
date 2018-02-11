import * as mongoose from 'mongoose';
import * as express from 'express';

import MessagesDao from './messages.dao';
import UserDao from '../user/user.dao';

export class MessagesController {

  static createNewConversation(req: express.Request, res: express.Response, next: express.NextFunction) {
    const reqParticipants = [req['user']._id, ...req.body.participants];

    const newMessageConversation = {
      users: reqParticipants,
      userMessages: []
    };

    MessagesDao['getOneByQuery']({users: reqParticipants})
      .then((message) => {
        if (!message) {
          MessagesDao['createNew'](newMessageConversation)
          .then(messageConversationSaved => {
            UserDao['getAll']({_id: {'$in': reqParticipants}})
              .then(participants => {
                const participant1 = participants[0];
                const participant2 = participants[1];
                const updatePromises = [];

                participant1.messageConversations.push({
                  _id: messageConversationSaved._id,
                  lastMessage: '',
                  lastUpdate: new Date(),
                  receiver: {
                    receiverId: participant2._id,
                    name: participant2.name
                  }
                });
                updatePromises.push(participant1.save());

                participant2.messageConversations.push({
                  _id: messageConversationSaved._id,
                  lastMessage: '',
                  lastUpdate: new Date(),
                  receiver: {
                    receiverId: participant1._id,
                    name: participant1.name
                  }
                });
                updatePromises.push(participant2.save());

                Promise.all(updatePromises)
                  .then(values => {
                    return res.status(200).json({chatId: messageConversationSaved._id});
                  })
                  .catch(error => {
                    return res.status(400).json(error);
                  });

              });
          });
        } else {
          return res.status(200).json({chatId: message._id});
        }
      });
  }

  static getConversationMessages(req: express.Request, res: express.Response) {
    // TODO check if the conversation can be read from the Session User

    MessagesDao['getOneByQuery']({_id: req.params.conversationId})
      .then(messageConversation => {
        return res.status(200).json(messageConversation);
      })
      .catch(error => {
        return res.status(400).json(error);
      });
  }

  static getConversationMessagesByUsers(req: express.Request, res: express.Response) {
    MessagesDao['getOneByQuery']({users: {$in: [req['user']._id, req.params.userId]}})
      .then(messageConversation => {
        return res.status(200).json(messageConversation);
      })
      .catch(error => {
        return res.status(400).json(error);
      });
  }

  static sendMessage(req: express.Request, res: express.Response) {

    const me = req['user'];

    const userIds = [me._id, req.body.receiver];

    const idMessageConversation = req.body.idMessageConversation;

    const message = req.body.message;

    const updateQueryPromises = [];

    const sender = me._id;

    updateQueryPromises.push(
      UserDao['updateMessageConversations']
      (
        idMessageConversation,
        message.body,
      )
    );

    updateQueryPromises.push(
      MessagesDao['updateArrProp']
      (
        idMessageConversation,
        {'userMessages': {senderId: me._id, ...message}}
      )
    );

    Promise.all(updateQueryPromises)
      .then(values => {
        return res.status(200).json(values);
      })
      .catch(reason => {
        return res.status(400).json(reason);
      });

  }
}
