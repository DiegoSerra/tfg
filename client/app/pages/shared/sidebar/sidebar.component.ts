import { AppSplashScreenService } from '../../../core/services/splash-screen.service';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {LandingScrollService} from '../../../landing-page/services/landing-scroll.service';
import {UserService} from '../../../core/services/user.service';
import {User} from '../../../models/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [LandingScrollService]
})
export class SidebarComponent implements OnInit {
  user: User;
  isLogedIn;

  hideAccessPanel = environment.hideAccessPanel;
  _open = false;
  @Output('onGoToFragment') onGoToFragment = new EventEmitter<string>();

  @ViewChild('sidenav') sidenav;

  @Input('open')
  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    if (value) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }

    this._open = value;

  }

  constructor(private userService: UserService, private landingScroll: LandingScrollService, private splashScreen: AppSplashScreenService) {
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

  showLoading() {
    this.splashScreen.show();
  }
}
