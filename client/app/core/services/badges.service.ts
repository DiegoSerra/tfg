import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';
import {Badges} from '../../models/badges.model';

@Injectable()
export class BadgesService {

  private badgesSnapshot: Badges;
  private _badgesSubject: BehaviorSubject<Badges> = new BehaviorSubject<Badges>(new Badges({}));
  badges$: Observable<Badges> = this._badgesSubject.asObservable()
    .map(badges => this.badgesSnapshot = badges);

  init(chat) {
    this._badgesSubject.value.chat.count = chat || 0;
  }

  increaseChat(num = 1) {
    this.badgesSnapshot.chat.count++;
    this._badgesSubject.next(this.badgesSnapshot);
  }

  resetChat() {
    this.badgesSnapshot.chat.count = 0;
    this._badgesSubject.next(this.badgesSnapshot);
  }

  updateBadges(user: any, userService: any) {
    user.newChats = this.badgesSnapshot.chat.count;
    userService.updateBadges(user)
      .subscribe();
  }

}
