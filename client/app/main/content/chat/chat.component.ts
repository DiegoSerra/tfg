import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ChatService} from './chat.service';
import {ActivatedRoute} from '@angular/router';
import { BadgesService } from '../../../core/services/badges.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppChatComponent implements OnInit {
  selectedChat: any;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private badgesService: BadgesService) {

    }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      const userName = params['userName'];
      if (userId && userName) {
        const receiver = {receiverId: userId, name: userName};
        this.chatService.getChatByUsers(receiver);
      }
    });

    this.chatService.onChatSelected
      .subscribe(chatData => {
        this.selectedChat = chatData;
      });

    this.badgesService.resetChat();
  }

}
