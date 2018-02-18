import {Component, ViewEncapsulation} from '@angular/core';
import {AppSplashScreenService} from './core/services/splash-screen.service';

import {environment} from '../environments/environment';
import {NavigationEnd, Router} from '@angular/router';

declare const gtag: Function;
declare const fbq: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  constructor(private appSplashScreenService: AppSplashScreenService) {

    if (environment.analytics) {
      gtag('js', new Date());
      gtag('config', environment.analytics);
    }

    if (environment.pixel) {
      fbq('init', '1867547966890846');
      fbq('track', 'PageView');
    }

  }

}
