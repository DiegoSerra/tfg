import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {UrlService} from '../../core/services/url.service';

@Injectable()
export class ContentGuard implements CanActivate {

  constructor(private userService: UserService, private urlService: UrlService) {
  }

  canActivate() {
    if (!this.userService.isLoggedIn()) {     
      const { inviteParams, campaignParams } = this.urlService.parseInvitationUrl();
      window.location.href = '/auth/login' + inviteParams + campaignParams;
    } else {
      return true;
    }
    return true;
  }
  
}
