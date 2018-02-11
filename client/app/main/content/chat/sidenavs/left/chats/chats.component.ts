import {Component, OnDestroy, OnInit} from '@angular/core';
import {ObservableMedia} from '@angular/flex-layout';
import {ChatService} from '../../../chat.service';
import {AppMatSidenavHelperService} from '../../../../../../core/directives/mat-sidenav-helper/mat-sidenav-helper.service';
import {UserService} from '../../../../../../core/services/user.service';
import {User} from '../../../../../../models/user.model';
import {ChatSocketio} from '../../../chat.socketio';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-chat-chats-sidenav',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class AppChatChatsSidenavComponent implements OnInit, OnDestroy {
  user: User;
  conversations: any[];
  contacts: any[];
  chatSearch: any;
  searchText = '';

  chatUpdatedSubscription: Subscription;
  messageSendSubscription: Subscription;
  messageReceivedSubscription: Subscription;
  userSubscription: Subscription;
  typingSubscription: Subscription;

  constructor(private chatService: ChatService,
              private appMdSidenavService: AppMatSidenavHelperService,
              public media: ObservableMedia,
              private userService: UserService,
              private chatSocketio: ChatSocketio) {
    this.chatSearch = {
      name: ''
    };
  }

  ngOnInit() {
    this.userSubscription = this.userService.user$
      .subscribe((user: User) => {
        this.user = user;
        this.chatSocketio.socket.emit('receive-timeout', false); 
        this.chatSocketio.socket.emit('stop-timeout', <string> this.user._id); 
      });

    this.conversations = this.chatService.chats;
    this.contacts = this.chatService.contacts;

    this.chatUpdatedSubscription = this.chatService.onChatsUpdated.subscribe(updatedChats => {
      this.conversations = updatedChats;
    });

    this.messageSendSubscription = this.chatService.onSendMessage
      .subscribe(newMessage => {
        const conversation = this.conversations.find(conversations => conversations._id === newMessage.idMessageConversation);
        conversation.lastMessage = newMessage.message.body;
      });

    this.messageReceivedSubscription = this.chatSocketio.onMessageReceived
      .subscribe((data) => {
        if (data !== null) {
          const conversation = this.conversations.find((conv) => conv._id === data.conversationId);
          if (conversation) {
            conversation.lastMessage = data.message.body;
          } else {
            this.chatService.getChats();
          }
        }
      });

    this.typingSubscription = this.chatSocketio.onTyping
      .subscribe((data) => {
        if (data !== null) {
          const conversation = this.conversations.find((conv) => conv.receiver.receiverId === data.userId);
          if (conversation && data.typing) {
            conversation.typing = 'Escribiendo...';
          } else {
            this.chatService.getChats();
          }
        }
      });
  }

  ngOnDestroy() {
    this.chatSocketio.socket.emit('receive-timeout', true); 
    this.chatUpdatedSubscription.unsubscribe();
    this.messageSendSubscription.unsubscribe();
    this.messageReceivedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  getChat(conversation) {
    this.chatService.getChat(conversation);

    if (!this.media.isActive('gt-md')) {
      this.appMdSidenavService.getSidenav('chat-left-sidenav').toggle();
    }
  }

  setUserStatus(status) {
    this.chatService.setUserStatus(status);
    this.user.status = status;
  }

  changeLeftSidenavView(view) {
    this.chatService.onLeftSidenavViewChanged.next(view);
  }

  logout() {

  }
}
