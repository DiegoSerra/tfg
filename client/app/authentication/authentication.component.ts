import {Component, HostBinding, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Animations} from '../core/animations';
import {AppConfigService} from '../core/services/config.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  animations: [
    Animations.routerTransitionUp,
    Animations.routerTransitionDown,
    Animations.routerTransitionRight,
    Animations.routerTransitionLeft,
    Animations.routerTransitionFade
  ]
})
export class AuthenticationComponent implements OnInit, OnDestroy {
  onSettingsChanged: Subscription;
  appSettings: any;

  @HostBinding('@routerTransitionUp') routeAnimationUp = false;
  @HostBinding('@routerTransitionDown') routeAnimationDown = false;
  @HostBinding('@routerTransitionRight') routeAnimationRight = false;
  @HostBinding('@routerTransitionLeft') routeAnimationLeft = false;
  @HostBinding('@routerTransitionFade') routeAnimationFade = false;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private appConfig: AppConfigService) {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .subscribe((event) => {
        switch (this.appSettings.routerAnimation) {
          case 'fadeIn':
            this.routeAnimationFade = !this.routeAnimationFade;
            break;
          case 'slideUp':
            this.routeAnimationUp = !this.routeAnimationUp;
            break;
          case 'slideDown':
            this.routeAnimationDown = !this.routeAnimationDown;
            break;
          case 'slideRight':
            this.routeAnimationRight = !this.routeAnimationRight;
            break;
          case 'slideLeft':
            this.routeAnimationLeft = !this.routeAnimationLeft;
            break;
        }
      });

    this.onSettingsChanged =
      this.appConfig.onSettingsChanged
        .subscribe(
          (newSettings) => {
            this.appSettings = newSettings;
          }
        );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.onSettingsChanged.unsubscribe();
  }
}
