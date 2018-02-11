import { AppSplashScreenService } from '../../../core/services/splash-screen.service';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LandingScrollService} from '../../../landing-page/services/landing-scroll.service';
import {environment} from '../../../../environments/environment';
import {UserService} from '../../../core/services/user.service';
import {User} from '../../../models/user.model';

@Component({
  selector: 'app-landing-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [LandingScrollService]
})
export class LandingHeaderComponent implements OnInit {
  user: User;
  hideAccessPanel = environment.hideAccessPanel;
  isSideNavOpen = false;

  @Output('onGoToFragment') onGoToFragment = new EventEmitter<string>();

  isLogedIn;


  constructor(private userService: UserService,
              private landingScroll: LandingScrollService,
              private splashScreen: AppSplashScreenService) {
    this.userService.user$.subscribe((user: User) => {
      this.user = user;
      this.isLogedIn = user.email !== undefined;
    });
  }

  ngOnInit() {
  }

  goToFragment(fragment, speed = 1500) {
    this.onGoToFragment.emit(fragment);
  }

  toggleSidenav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  showLoading() {
    this.splashScreen.show();
  }

}
