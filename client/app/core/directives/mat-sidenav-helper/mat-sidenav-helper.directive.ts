import {Directive, Input, OnInit, HostListener, OnDestroy, HostBinding, AfterViewInit} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Subscription} from 'rxjs';
import {AppMatSidenavHelperService} from './mat-sidenav-helper.service';
import {AppMatchMedia} from '../../services/match-media.service';
import {ObservableMedia} from '@angular/flex-layout';

@Directive({
  selector: '[appMatSidenavHelper]'
})
export class AppMatSidenavHelperDirective implements OnInit, AfterViewInit, OnDestroy {
  matchMediaSubscription: Subscription;

  @HostBinding('class.mat-is-locked-open') isLockedOpen = true;
  @HostBinding('class.md-stop-transition') stopTransition = true;

  @Input('appMatSidenavHelper') id: string;
  @Input('mat-is-locked-open') mdIsLockedOpenBreakpoint: string;

  constructor(private appMatSidenavHelperService: AppMatSidenavHelperService,
              private appMatchMedia: AppMatchMedia,
              private observableMedia: ObservableMedia,
              private mdSidenav: MatSidenav) {
  }

  ngOnInit() {
    this.appMatSidenavHelperService.setSidenav(this.id, this.mdSidenav);

    if (this.observableMedia.isActive(this.mdIsLockedOpenBreakpoint)) {
      this.isLockedOpen = true;
      this.mdSidenav.mode = 'side';
      this.mdSidenav.open();
    } else {
      this.isLockedOpen = false;
      this.mdSidenav.mode = 'over';
      this.mdSidenav.close();
    }

    this.matchMediaSubscription = this.appMatchMedia.onMediaChange.subscribe(() => {
      if (this.observableMedia.isActive(this.mdIsLockedOpenBreakpoint)) {
        this.isLockedOpen = true;
        this.mdSidenav.mode = 'side';
        this.mdSidenav.open();
      } else {
        this.isLockedOpen = false;
        this.mdSidenav.mode = 'over';
        this.mdSidenav.close();
      }
    });

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.stopTransition = false;
    }, 0);
  }

  ngOnDestroy() {
    this.matchMediaSubscription.unsubscribe();
  }
}

@Directive({
  selector: '[appMdSidenavToggler]'
})
export class AppMdSidenavTogglerDirective {
  @Input('appMdSidenavToggler') id;

  constructor(private appMatSidenavHelperService: AppMatSidenavHelperService) {
  }

  @HostListener('click')
  onClick() {
    this.appMatSidenavHelperService.getSidenav(this.id).toggle();
  }
}
