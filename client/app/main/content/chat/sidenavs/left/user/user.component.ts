import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {ChatService} from '../../../chat.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-chat-user-sidenav',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class AppChatUserSidenavComponent implements OnInit, OnDestroy {
  user: any;
  onFormChange: any;
  userForm: FormGroup;

  constructor(private chatService: ChatService) {
    this.user = this.chatService.user;
    this.userForm = new FormGroup({
      mood: new FormControl(this.user.mood),
      status: new FormControl(this.user.status)
    });
  }

  ngOnInit() {
    this.onFormChange = this.userForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((data: any) => {
        this.user.mood = data.mood;
        this.user.status = data.status;
        this.chatService.updateUserData(this.user);
      });
  }

  changeLeftSidenavView(view) {
    this.chatService.onLeftSidenavViewChanged.next(view);
  }

  ngOnDestroy() {
    this.onFormChange.unsubscribe();
  }
}
