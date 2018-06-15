import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {Http} from '@angular/http';

import {AppUtils} from '../../../core/appUtils';
import {UserService} from '../../../core/services/user.service';

@Injectable()
export class ChatService implements Resolve<any> {
  contacts: any[];
  chats: any[];
  user: any;
  chatSelected: any;
  onChatSelected = new BehaviorSubject<any>(null);
  onContactSelected = new BehaviorSubject<any>(null);
  onChatsUpdated = new Subject<any>();
  onUserUpdated = new Subject<any>();
  onSendMessage = new Subject<any>();
  onMessageSent = new Subject<any>();
  onLeftSidenavViewChanged = new Subject<any>();
  onRightSidenavViewChanged = new Subject<any>();

  constructor(private http: Http, private userService: UserService) {
  }


  getChat(conversationInUser) {

    return new Promise((resolve, reject) => {
      this.http.get('api/chat/' + conversationInUser._id)
        .subscribe(response => {
          const conversation = response.json();
          // const chatContact = this.contacts.find((contact) => {
          //   return contact.id === userId;
          // });

          this.chatSelected = {
            chatId: conversation._id,
            dialog: conversation.userMessages,
            contact: conversationInUser.receiver
          };

          this.onChatSelected.next({...this.chatSelected});

        }, reject);

    });

  }

  getChatByUsers(receiver) {

    return new Promise((resolve, reject) => {
      this.http.get('api/chat/users/' + receiver.receiverId)
        .subscribe(response => {
          const conversation = response.json();

          this.chatSelected = {
            chatId: conversation._id,
            dialog: conversation.userMessages,
            contact: receiver
          };

          this.onChatSelected.next({...this.chatSelected});

        }, reject);

    });

  }

  getChatId(chatId) {
    return new Promise((resolve, reject) => {
      this.http.get('api/chat/' + chatId)
        .subscribe(response => {
          const conversation = response.json();

          this.userService.user$
            .subscribe(user => {
              // conversation.users.some(userInConversation => .receiver.receiverId === userInConversation);

              this.chatSelected = {
                chatId: conversation._id,
                dialog: conversation.userMessages,
                contact: conversation.receiver
              };

              this.onChatSelected.next({...this.chatSelected});
            });
        });
    });
  }


  createNewChat(contactId) {
    return new Promise((resolve, reject) => {

      const contact = this.contacts.find((item) => {
        return item.id === contactId;
      });

      const chatId = AppUtils.generateGUID();

      const chat = {
        id: chatId,
        dialog: []
      };

      const chatListItem = {
        contactId: contactId,
        id: chatId,
        lastMessageTime: '2017-02-18T10:30:18.931Z',
        name: contact.name,
        unread: null
      };

      /**
       * Add new chat list item to the user's chat list
       */
      this.user.chatList.push(chatListItem);

      /**
       * Post the created chat
       */
      this.http.post('api/chat', {...chat})
        .subscribe(response => {

          /**
           * Post the new the user data
           */
          this.http.post('api/user/' + this.user.id, this.user)
            .subscribe(newUserData => {

              /**
               * Update the user data from server
               */
              this.getUser().then(updatedUser => {
                this.onUserUpdated.next(updatedUser);
                resolve(updatedUser);
              });
            });
        }, reject);
    });
  }

  selectContact(contact) {
    this.onContactSelected.next(contact);
  }

  setUserStatus(status) {
    this.http.post(`api/me/chat-status`, {status})
      .subscribe(response => {
          this.user.status = status;
        }
      );
  }

  updateUserData(userData) {
    this.http.post(`api/user/me/chat-status`, userData)
      .subscribe(response => {
          this.user = userData;
        }
      );
  }

  sendMessage(idMessageConversation, message, receiverId): Promise<any> {
    const newMessage = {
      idMessageConversation: idMessageConversation,
      message: {
        sending: true,
        ...message
      },
      receiver: receiverId
    };
    this.onSendMessage.next(newMessage);

    return new Promise((resolve, reject) => {
      this.http.post('api/chat/sendMessage', newMessage)
        .subscribe(updatedChat => {
          this.onMessageSent.next(newMessage);
          resolve(updatedChat);
        }, reject);
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      // resolve();
      Promise.all([
        this.getContacts(),
        this.getChats(),
        this.getUser()
      ]).then(
        ([contacts, chats, user]) => {
          this.contacts = contacts;
          this.chats = chats;
          this.user = user;
          resolve();
        },
        reject
      );
    });
  }

  getContacts(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve([]);
      // this.userService.user$
      //   .subscribe((user: User) => resolve(user.messageConversations));
    });
  }

  getChats(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.getChats()
        .subscribe((chats) => {
          this.onChatsUpdated.next(chats);
          resolve(chats);
        });
    });
  }

  getUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({});
      // this.http.get('api/user')
      //   .subscribe(response => {
      //     resolve(response.json().data[0]);
      //   }, reject);
    });
  }

}
