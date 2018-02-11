import * as socketio from 'socket.io';
import {BadgeSocket} from './badge.socket';
import {ChatSocket} from './chat.socket';

export class SocketRoute {
  private static users = {};

  static init(server) {
    const sockets = socketio(server);

    sockets.on('connection', (socket) => {
      const _userId = socket.handshake.query.userId;
      this.users[_userId] = socket;

      BadgeSocket.initializeBadges(_userId, socket);  

      ChatSocket.init(socket, this.users);
      BadgeSocket.init(socket, this.users);

      socket.on('disconnect', (userId) => {
        delete this.users[userId];
      });
    });
  }
}

