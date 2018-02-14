import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CookieService} from 'ngx-cookie';
import {JwtHelper} from 'angular2-jwt';

import * as _ from 'lodash';
import {User} from '../../models/user.model';

import 'rxjs/add/operator/map';
import {Badges} from '../../models/badges.model';
import {BadgesService} from './badges.service';

@Injectable()
export class UserService {

  s3Server = 'https://elasticbeanstalk-us-west-2-026017025140.s3.amazonaws.com';

  private _userSubject: BehaviorSubject<User | {}> = new BehaviorSubject<User | {}>({});
  user$: Observable<User | {}> = this._userSubject.asObservable();

  private JwtHelper = new JwtHelper();
  private userDecoded;

  constructor(private http: Http,
              private cookieService: CookieService,
              private badgesService: BadgesService) {
    this.me();
  }

  me(): void {
    const token = this.cookieService.get('token');
    if (token) {
      this.userDecoded = this.JwtHelper.decodeToken(token);

      if (this.userDecoded.profileImageUrl) {
        this.userDecoded.profileImageUrl = `${this.userDecoded.profileImageUrl}?random=${Math.random()}`;
      }

      if (this.userDecoded.coverImageUrl) {
        this.userDecoded.coverImageUrl = `${this.userDecoded.coverImageUrl}?random=${Math.random()}`;
      }

    } else {
      this.userDecoded = {};
    }
    this._userSubject.next(this.userDecoded);
  }

  getUserProfile(userId: string) {
    return this.http.get(`api/user/${userId}`)
      .map((res: Response) => {
        return res.json();
      });
  }

  login(user: any, paramsString: string = ''): Observable<any> {
    return this.http.post(`api/authenticate${paramsString}`, user)
      .map((res: Response) => {
        return res.json();
      });
  }

  logout(funct?: Function) {
    this.cookieService.remove('token');
    this.me();
    if (funct) {
      funct();
    }    
  }

  create(user: any, queryParams?: {[key: string]: string}) {
    const observer: Observable<any> = this.http.post('api/user', user, {params: queryParams})
      .map((res: Response) => {
        return res.json();
      });

    return observer;
  }

  activate(user: any) {
    return this.http.put(`api/user/${user._id}`, {active: true})
      .map((res: Response) => {
        return res.json();
      });
  }

  deactivate(user: any) {
    return this.http.delete(`api/user/${user._id}`)
      .map((res: Response) => {
        return res;
      });
  }

  isLoggedIn() {
    const token = this.cookieService.get('token');
    // console.log(token);
    if (token) {
      const decodedToken = this.JwtHelper.decodeToken(this.cookieService.get('token'));
      return decodedToken.email !== undefined;
    }
    return false;
  }

  isSuperAdmin() {
    return _.toLower(this.userDecoded.role) === 'superadmin';
  }

  isAdmin() {
    return _.toLower(this.userDecoded.role) === 'admin';
  }

  all(filter?) {
    return this.http.get(`api/user`, {params: {filter}})
      .map(result => {
        return result.json();
      });
  }

  getChats() {
    return this.http.get(`api/user/chats`)
      .map(result => {
        return result.json();
      });
  }

  forgotPassword(email) {
    return this.http.post(`api/user/forgotPassword`, {email})
      .map(result => {
        return result.json();
      });
  }

  resetPassword(passwordToken, newPassword) {
    return this.http.post(`api/user/passwordReset`, {newPassword}, {params: {passwordToken}})
      .map(result => {
        return result.json();
      });
  }

  changeEmail(newEmail) {
    return this.http.put(`api/user/email`, {email: newEmail})
      .map(result => {
        return result.json();
      });
  }

  changeName(newName) {
    return this.http.put(`api/user/name`, {name: newName})
      .map(result => {
        return result.json();
      });
  }

  updateUser(user) {
    return this.http.put(`api/user`, {user: user})
      .map(result => {
        return result.json();
      });
  }

  exportExternalUsers() {
    return this.http.get(`api/users/export`)
      .map((result: Response) => {
        return result;
      });
  }
}
