import {Injectable} from '@angular/core';

import * as io from 'socket.io-client';
import {UserService} from '../../../core/services/user.service';
import {User} from '../../../models/user.model';
import {Subject} from 'rxjs';
import * as _ from 'lodash';
import {Router} from '@angular/router';
import * as Push from 'push.js';
import {BadgesService} from '../../../core/services/badges.service';

const EMAIL_TIMEOUT = 600000;

@Injectable()
export class ChatSocketio {
  socket: SocketIOClient.Socket;
  onMessageReceived = new Subject<any>();
  onMessageEmojified = new Subject<any>();
  onTyping = new Subject<any>();
  onIncreaseChatBadge = new Subject<any>();
  connectedUser: User;
  blackList = [];
  timeouts = <any>[];
  reciveTimeout = true;
  me: User;

  constructor(
    private userService: UserService,
    private router: Router,
    private badgesService: BadgesService) {
    userService.user$
      .subscribe((user: User) => this.connectedUser = user);
  }

  connect() {
    this.me = this.connectedUser;

    this.socket = io('', {query: `userId=${this.connectedUser._id}`});

    this.socket.on('receive-message', (conversationId, message) => {
      this.updateTimeouts();
      Push.create(message.senderName, this.notifyOptions(message));
      this.onMessageReceived.next({conversationId, message});
    });

    // Chat events

    this.socket.on('email-sent', (receiverUserId, sendEmail) => {
      this.blackList.push({receiverUserId, sendEmail});
    });

    this.socket.on('clear-timeout', (userId) => {
      this.clearTimeout(userId);
    });

    this.socket.on('timeout-received', (recive) => {
      this.reciveTimeout = recive;
    });

    this.socket.on('update-typing', (userId, typing) => {
      this.onTyping.next({userId, typing});
    });

    this.socket.on('message-emojified', (conversationId, message) => {
      this.onMessageEmojified.next({conversationId, message});
    });

    // Badge events

    this.socket.on('initialize-badges', (chat) => {
      this.badgesService.init(chat);
    });

    this.socket.on('increase-chat-badge', (conversationId) => {
      this.onIncreaseChatBadge.next({conversationId});
      this.badgesService.increaseChat();
    });

    // Disconnect event

    this.socket.on('disconnect', (userId) => {
      this.clearTimeout(userId, true);
    });
  }

  disconnect() {
    this.badgesService.updateBadges(this.me)
      .subscribe();
  }

  messageSent(userId, conversationId, message) {
    this.socket.emit('message-sent', userId, conversationId, message);
    const isUserInBlackList = this.blackList.some(user => user.receiverUserId === userId && !user.sendEmail);
    if (!isUserInBlackList) {
      this.socket.emit('send-email', userId);
    }
  }

  typing(userId, receiverId, typing, message?) {
    this.socket.emit('typing', userId, receiverId, typing, message);
  }

  emojifyMessage(conversationId, message) {
    this.socket.emit('emojify-message', conversationId, message);
  }

  updateTimeouts() {
    if (this.reciveTimeout) {
      this.timeouts.push({
        userId: this.connectedUser._id,
        timeout: setTimeout(() => {
          this.socket.emit('send-timeout-email', this.connectedUser._id);
        }, EMAIL_TIMEOUT)
      });
    }
  }

  clearTimeout(userId: any, sendEmail = false) {
    this.timeouts = _.uniq(this.timeouts);
    const timeoutPos = this.timeouts.findIndex(timeout => timeout.userId === userId);
    if (timeoutPos !== -1) {
      clearTimeout(this.timeouts[timeoutPos].timeout);
      this.timeouts.splice(timeoutPos, 1);
      if (sendEmail) {
        this.socket.emit('send-email', userId);
      }
    }
  }

  private notifyOptions(message: any): any {
    return {
      body: message.body,
      icon: '../../../../favicon.ico',
      timeout: 4000,
      tag: message.sender,
      onClick: () => {
        window.focus();
        this.router.navigate(['/app/chat'], {queryParams: {userId: message.sender, userName: message.senderName}});
        Push.close(message.sender);
      }
    };
  }

}
