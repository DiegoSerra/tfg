import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren, ElementRef} from '@angular/core';
import {ChatService} from '../chat.service';
import {NgForm} from '@angular/forms';
import {User} from '../../../../models/user.model';
import {UserService} from '../../../../core/services/user.service';
import {ChatSocketio} from '../chat.socketio';
import {Subscription} from 'rxjs';

import * as _ from 'lodash';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { EmojisService } from '../../../../core/services/emojis.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class AppChatViewComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked  {
  user: User;
  chat: any;
  dialog: any;
  contact: any;
  replyInput: any;
  selectedChat: any;
  typing = false;
  emojis = {
    smiles: [],
    animals: [],
    vehicles: [],
    technology: [],
    stars: [],
    arrows: [],
    flags: [],
    others: [],
  };
  message = '';
  emojiName = '';

  tabs = [
    {icon: 'face', name: 'Smiles', code: 'smiles', content: this.emojis.smiles},
    {icon: 'local_florist', name: 'Animals', code: 'animals', content: this.emojis.animals},
    {icon: 'directions_car', name: 'Vehicles', code: 'vehicles', content: this.emojis.vehicles},
    {icon: 'stay_primary_portrait', name: 'Technology', code: 'technology', content: this.emojis.technology},
    {icon: 'star_rate', name: 'Stars', code: 'stars', content: this.emojis.stars},
    {icon: 'swap_vert', name: 'Arrows', code: 'arrows', content: this.emojis.arrows},
    {icon: 'flag', name: 'Flags', code: 'flags', content: this.emojis.flags},
    {icon: 'label', name: 'Others', code: 'others', content: this.emojis.others},
  ];

  @ViewChildren('replyInput') replyInputField;
  @ViewChild('replyForm') replyForm: NgForm;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chatSelectedSubscription: Subscription;
  chatReceivedSubscription: Subscription;
  sendMessageSubscription: Subscription;
  messageSentSubscription: Subscription; 
  messageEmojifiedSubscription: Subscription;

  constructor(private chatService: ChatService,
              private userService: UserService,
              private chatSocketio: ChatSocketio,
              private emojisService: EmojisService) {
  }

  ngOnInit() {
    this.userService.user$.subscribe((me: User) => this.user = me);
    this.chatSelectedSubscription = this.chatService.onChatSelected
      .subscribe(chatData => {
        if (chatData) {         
          this.selectedChat = chatData;
          this.contact = chatData.contact;
          this.dialog = chatData.dialog;
          this.readyToReply();
        }
      });

    this.chatReceivedSubscription = this.chatSocketio.onMessageReceived
      .subscribe((data) => {
        if (data !== null && this.selectedChat.chatId === data.conversationId) {
          this.dialog.push(data.message);
          this.scrollToBottom();
        }
      });

    this.sendMessageSubscription = this.chatService.onSendMessage
      .subscribe(newMessage => {
        if (newMessage !== null) {
          this.dialog.push(newMessage.message);
        }
      });

    this.messageSentSubscription = this.chatService.onMessageSent
      .subscribe(message => {
        if (message !== null) {
          const findedMessage: any = _.find(this.dialog, el => el === message.message);
          // console.log(findedMessage);
          if (findedMessage) {
            findedMessage.sending = false;
          }
        }
      });

    this.messageEmojifiedSubscription = this.chatSocketio.onMessageEmojified
      .subscribe(data => {
        if (data !== null) {
          const message = data.message;
          const receiverId = this.contact.receiverId;
          const chatId = data.conversationId;

          // Update the server
          this.chatService.sendMessage(chatId, message, chatId)
            .then(response => {
              this.chatSocketio.messageSent(receiverId, chatId, message);
            });
        }
      });

      this.emojisService.smiles()
        .subscribe(_emojis => {
          for (const emoji in _emojis) {
            if (_emojis.hasOwnProperty(emoji)) {
              this.emojis.smiles.push({code: _emojis[emoji], name: emoji});
            }
          }
        });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }

  ngAfterViewInit() {
    this.replyInput = this.replyInputField.first.nativeElement;
    this.replyInputField.first.nativeElement.addEventListener('keypress', (event) => {
      if (event.which === 13 && !event.shiftKey) {
        event.preventDefault();
      }
    });

    this.readyToReply();
  }

  ngOnDestroy() {
    this.chatSelectedSubscription.unsubscribe();
    this.chatReceivedSubscription.unsubscribe();
    this.sendMessageSubscription.unsubscribe();
    this.messageSentSubscription.unsubscribe();
  }

  selectContact() {
    this.chatService.selectContact(this.contact);
  }

  readyToReply() {
    setTimeout(() => {
      this.replyForm.reset();
      this.focusReplyInput();
      this.scrollToBottom();
    });

  }

  focusReplyInput() {
    setTimeout(() => {
      this.replyInput.focus();
    });
  }

  reply(event) {
    if (this.replyForm.value.message && this.replyForm.valid) {      
      const chatId = this.selectedChat.chatId;
      const messageBody = this.replyForm.form.value.message;

      const message = {
        sender: this.user._id,
        senderName: this.user.name,
        body: messageBody,
        createdAt: new Date()
      };

      this.readyToReply();
      this.chatSocketio.emojifyMessage(chatId, message);    
    }

  }

  isTyping() {
    const receiverId = this.contact.receiverId;
    this.chatSocketio.typing(this.user._id, receiverId, this.typing = true);
    setTimeout(() => this.chatSocketio.typing(this.user._id, receiverId, this.typing = false), 3000);
  }

  concatEmoji(emoji) {
    this.message = this.message ? this.message += emoji.code : emoji.code;
    this.replyInput.focus();
  }

  trackByFn(index, item) {
    return item ? item.name : undefined;
  }

  fillEmojisCategory(category) {
    if (this.emojis[category].length === 0) {
      this.emojisService.getByCategory(category)
        .subscribe(_categoryEmojis => {
          for (const emoji in _categoryEmojis) {
            if (_categoryEmojis.hasOwnProperty(emoji)) {
              this.emojis[category].push({code: _categoryEmojis[emoji], name: emoji});
            }
          }
        });
    }
  }
}
