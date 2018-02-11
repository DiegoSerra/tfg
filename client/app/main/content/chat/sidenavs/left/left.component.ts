import {Component, OnInit} from '@angular/core';
import {Animations} from '../../../../../core/animations';
import {ChatService} from '../../chat.service';

@Component({
  selector: 'app-chat-left-sidenav',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss'],
  animations: [Animations.slideInLeft, Animations.slideInRight]
})
export class AppChatLeftSidenavComponent implements OnInit {
  view: string;

  constructor(private chatService: ChatService) {
    this.view = 'conversations';
  }

  ngOnInit() {
    this.chatService.onLeftSidenavViewChanged.subscribe(view => {
      this.view = view;
    });
  }

}
