import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UserService} from '../core/services/user.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate() {
    // console.log('Authentication Guard', this.userService.isLoggedIn());
    if (this.userService.isLoggedIn()) {

      this.router.navigate(['/app']);
    }
    return true;
  }
}
