import BadgeDao from '../api/badge/badge.dao';

export class BadgeSocket {
  private static users = {};

  static init(socket, users) {
    this.users = users; 
  }

  static initializeBadges(userId, socket) {
    BadgeDao['getBadges'](userId)
      .then(badges => {
        socket.emit('initialize-badges', badges.chat, badges.coincidence);
      });
  }

  static emitReceiveMessage(receiverUserId, conversationId) {
    const receiverSocket = this.users[receiverUserId];
    if (receiverSocket) {
      receiverSocket.emit('increase-chat-badge', conversationId);
    } else {
      BadgeDao['incrementChats'](receiverUserId);
    }
  }
}
