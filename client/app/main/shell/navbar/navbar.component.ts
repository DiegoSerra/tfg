import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppMatchMedia } from '../../../core/services/match-media.service';
import { AppNavbarService } from './navbar.service';
import { ObservableMedia } from '@angular/flex-layout';
import { AppMainComponent } from '../../main.component';
import { NavigationEnd, Router } from '@angular/router';
import { AppNavigationService } from '../../../core/components/navigation/navigation.service';
import { UserService } from '../../../core/services/user.service';

@Component({
    selector     : 'app-navbar',
    templateUrl  : './navbar.component.html',
    styleUrls    : ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppNavbarComponent implements OnInit, OnDestroy
{
    @HostBinding('class.close') isClosed: boolean;
    @HostBinding('class.folded') isFoldedActive: boolean;
    @HostBinding('class.folded-open') isFoldedOpen: boolean;
    @HostBinding('class.initialized') initialized: boolean;
    @Input('folded') foldedByDefault = false;

    matchMediaWatcher: Subscription;

    constructor(
        private appMainComponentEl: AppMainComponent,
        private appMatchMedia: AppMatchMedia,
        private appNavigationService: AppNavigationService,
        private userService: UserService,
        private navBarService: AppNavbarService,
        public media: ObservableMedia,
        private router: Router
    )
    {
        navBarService.setNavBar(this);

        // TODO: perfectScrollbar
        // this.appNavigationService.onNavCollapseToggled.subscribe(() => {

        //     setTimeout(() => {
        //         this.perfectScrollbarDirective.update();
        //     }, 310);
        // });

        this.matchMediaWatcher =
            this.appMatchMedia.onMediaChange
                .subscribe((mediaStep) => {
                    setTimeout(() => {

                        if ( this.media.isActive('lt-lg') )
                        {
                            this.closeBar();
                            this.deActivateFolded();
                        }
                        else
                        {
                            this.openBar();
                        }
                    });
                });

        router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationEnd )
                {
                    if ( this.media.isActive('lt-lg') )
                    {
                        setTimeout(() => {
                            this.closeBar();
                        });
                    }
                }
            }
        );
    }

    ngOnInit()
    {
        this.isClosed = false;
        this.isFoldedActive = this.foldedByDefault;
        this.isFoldedOpen = false;
        this.initialized = false;
        this.updateCssClasses();

        setTimeout(() => {
            this.initialized = true;
        });

        if ( this.media.isActive('lt-lg') )
        {
            this.closeBar();
            this.deActivateFolded();
        }
        else
        {
            if ( !this.foldedByDefault )
            {
                this.deActivateFolded();
            }
            else
            {
                this.activateFolded();
            }
        }
    }

    openBar()
    {
        this.isClosed = false;
        this.updateCssClasses();
    }

    closeBar()
    {
        this.isClosed = true;
        this.updateCssClasses();
    }

    toggleBar()
    {
        if ( this.isClosed )
        {
            this.openBar();
        }
        else
        {
            this.closeBar();
        }
    }

    toggleFold()
    {
        if ( !this.isFoldedActive )
        {
            this.activateFolded();
        }
        else
        {
            this.deActivateFolded();
        }
    }

    activateFolded()
    {
        this.isFoldedActive = true;
        this.appMainComponentEl.addClass('app-nav-bar-folded');
        this.isFoldedOpen = false;
    }

    deActivateFolded()
    {
        this.isFoldedActive = false;
        this.appMainComponentEl.removeClass('app-nav-bar-folded');
        this.isFoldedOpen = false;
    }

    @HostListener('mouseenter')
    onMouseEnter()
    {
        this.isFoldedOpen = true;
    }

    @HostListener('mouseleave')
    onMouseLeave()
    {
        this.isFoldedOpen = false;
    }

    updateCssClasses()
    {
        if ( this.isClosed )
        {
            this.appMainComponentEl.addClass('app-nav-bar-opened');
            this.appMainComponentEl.removeClass('app-nav-bar-closed');
        }
        else
        {
            this.appMainComponentEl.addClass('app-nav-bar-closed');
            this.appMainComponentEl.removeClass('app-nav-bar-opened');
        }
    }

    logout() 
    {
        this.userService.logout(() => {
          this.router.navigate(['/auth/login']);
        });
    }

    ngOnDestroy()
    {
        this.matchMediaWatcher.unsubscribe();
    }
}
