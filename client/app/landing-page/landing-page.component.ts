import {AfterViewInit, Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, HostListener, Inject, EventEmitter, Output, AfterViewChecked, ChangeDetectorRef} from '@angular/core';
import {AppConfigService} from '../core/services/config.service';
import {User} from '../models/user.model';
import {UserService} from '../core/services/user.service';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LandingScrollService} from './services/landing-scroll.service';
import {MatSnackBar} from '@angular/material';
import { AppSplashScreenService } from '../core/services/splash-screen.service';
import { ScrollEvent } from 'ngx-scroll-event';
import { CdkScrollable } from '@angular/cdk/scrolling';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-login',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [LandingScrollService]
})

export class LandingPageComponent implements OnInit, AfterViewInit, AfterViewChecked {

  public navIsFixed = false;

  subscribed = false;
  isSideNavOpen = false;
  
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  
  user: User;
  isLogedIn = false;
  
  url: String;

  topOffset = 0;
  bottomOffset = 0;
  
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;   

  constructor(private appConfig: AppConfigService,
              private userService: UserService,
              private router: ActivatedRoute,
              private landingScroll: LandingScrollService,
              private snackBar: MatSnackBar,
              private splashScreen: AppSplashScreenService,
              private el: ElementRef,
              private cd: ChangeDetectorRef) {

    this.url = window.location.origin;            
    userService.user$.subscribe((user: User) => {
      this.user = user;
      this.isLogedIn = user.email !== undefined;
    });

    this.appConfig.setSettings({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
      }
    });

    this.landingScroll = landingScroll;
  }

  ngOnInit() {
    setTimeout(() => {
      this.router.queryParams
        .subscribe(queryParams => {
          if (queryParams.fragment) {
            // this.goToFragment(queryParams.fragment);
          }
        });
    });
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  ngAfterViewInit() {
    this.topOffset = document.getElementById('home').offsetHeight;
    this.bottomOffset = document.getElementById('landing-page').offsetHeight + this.topOffset;
  }

  goToFragment(fragment, speed = 1500) {
    try {
      this.myScrollContainer.nativeElement.scrollTop = document.getElementById(fragment).offsetTop;
    } catch (err) {
      console.log(err);
    }  
  }

  toggleSidenav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  showLoading() {
    this.splashScreen.show();
  }

  handleScroll(event: ScrollEvent) {
    if (this.bottomOffset !== 0 && this.topOffset !== 0) {
      if (event.isReachingBottom) {
        this.navIsFixed = true;
      }
      if (event.isReachingTop) {
        this.navIsFixed = false;
      } 
    }
  }

  // TODO: perfectScrollbar
  // goToFragment(fragment, speed = 1500) {
  //   if (this.directiveScroll) {
  //     const element = document.getElementById(fragment);
  //     this.directiveScroll.scrollToY(element.offsetTop, speed);
  //   } else {
  //     console.log('NO SCROLL SER');
  //   }
  // }

}
