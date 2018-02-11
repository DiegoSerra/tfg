import UserDao from '../api/user/user.dao';
import {BadgeSocket} from './badge.socket';

const emoji = require('node-emoji');

export class ChatSocket {
  private static users = {};

  static init(socket, users) {
    this.users = users;

    socket.on('message-sent', (receiverId, conversationId, message) => {
      this.emitReceiveMessage(receiverId, conversationId, message);
      BadgeSocket.emitReceiveMessage(receiverId, conversationId);
    });

    socket.on('emojify-message', (conversationId, message) => {
      this.emojifyMessage(conversationId, message, socket);
    });

    socket.on('typing', (userId, receiverUserId, typing, message) => {
      this.emitTypingMessage(userId, receiverUserId, typing);
    });
  }

  static emitReceiveMessage(receiverUserId, conversationId, message) {
    const receiverSocket = this.users[receiverUserId];
    if (receiverSocket) {
      receiverSocket.emit('receive-message', conversationId, message);
    }
  }

  static emitTypingMessage(userId, receiverUserId, typing) {
    const receiverSocket = this.users[receiverUserId];
    if (receiverSocket) {
      receiverSocket.emit('update-typing', userId, typing);
    }
  }

  static emojifyMessage(conversationId, message, socket) {
    if (message) {
      message.body = emoji.emojify(message.body);
      socket.emit('message-emojified', conversationId, message);
    }
  }
}
