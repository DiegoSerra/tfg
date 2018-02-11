import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import {UserService} from '../../../core/services/user.service';
import {User} from '../../../models/user.model';

@Component({
    selector   : 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls  : ['./toolbar.component.scss']
})

export class AppToolbarComponent
{
    userStatusOptions: any[];
    languages: any;
    selectedLanguage: any;
    showSpinner: boolean;
    user: User;
    isLogedIn;


    constructor(private router: Router,
                private userService: UserService)
    {
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                'id'   : 'en',
                'title': 'English',
                'flag' : 'us'
            },
            {
                'id'   : 'es',
                'title': 'Spanish',
                'flag' : 'es'
            },
            {
                'id'   : 'tr',
                'title': 'Turkish',
                'flag' : 'tr'
            }
        ];

        this.selectedLanguage = this.languages[0];

        router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationStart )
                {
                    this.showSpinner = true;
                }
                if ( event instanceof NavigationEnd )
                {
                    this.showSpinner = false;
                }
            });

      this.userService.user$.subscribe((user: User) => {
        this.user = user;
        this.isLogedIn = user.email !== undefined;
      });

    }

    search(value) {
        // Do your search here...
        console.log(value);
    }

  logout() {
    this.userService.logout(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
