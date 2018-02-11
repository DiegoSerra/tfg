import UserDao from '../api/user/user.dao';

export class BadgeSocket {
  private static users = {};

  static init(socket, users) {
    this.users = users; 
  }

  static initializeBadges(userId, socket) {
    UserDao['getOneByQuery']({_id: userId})
      .then(user => {
        socket.emit('initialize-badges', user.newChats);
      });
  }

  static emitReceiveMessage(receiverUserId, conversationId) {
    const receiverSocket = this.users[receiverUserId];
    if (receiverSocket) {
      receiverSocket.emit('increase-chat-badge', conversationId);
    } else {
      UserDao['incrementNewChats'](receiverUserId);
    }
  }
}
