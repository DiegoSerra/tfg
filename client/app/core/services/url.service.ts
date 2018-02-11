import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UrlService {

  parseInvitationUrl() {
    const invitation = window.location.pathname.split('/');
    const invite = invitation[invitation.length - 2];
    const inviteId = invitation[invitation.length - 1];
    const inviteParams = (invite === 'invite' ? `?invite=${inviteId}&type=entity` : '');
    const campaignParams = this.getParameterByName('campaign') && inviteParams ? `&campaign=${this.getParameterByName('campaign')}` : '';
    return { inviteParams, campaignParams };
  }

  getParameterByName(name, url?) {
    if (!url) {
      url = window.location.href;
    }

    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);

    if (!results) {
      return null;
    }

    if (!results[2]) {
      return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}
