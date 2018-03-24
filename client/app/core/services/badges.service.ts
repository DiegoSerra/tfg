import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';
import {Badges} from '../../models/badges.model';
import {Http, Response} from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BadgesService {

  private badgesSnapshot: Badges;
  private _badgesSubject: BehaviorSubject<Badges> = new BehaviorSubject<Badges>(new Badges({}));
  badges$: Observable<Badges> = this._badgesSubject.asObservable()
    .map(badges => this.badgesSnapshot = badges);

  constructor(private http: HttpClient) {}


  init(chat) {
    this._badgesSubject.value.chat.count = chat;
  }

  increaseChat(num = 1) {
    this.badgesSnapshot.chat.count++;
    this._badgesSubject.next(this.badgesSnapshot);
  }

  resetChat() {
    this.badgesSnapshot.chat.count = 0;
    this._badgesSubject.next(this.badgesSnapshot);
  }

  updateBadges(user: any): Observable<any> {
    const badges = {chat: this.badgesSnapshot.chat.count};
    
    return this.http.put(`api/badge/${user._id}`, badges);
  }

}
