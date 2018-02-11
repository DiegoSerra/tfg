import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {NavigationStart, Router} from '@angular/router';
import {Platform} from '@angular/cdk/platform';

@Injectable()
export class AppConfigService {
  settings: any;
  defaultSettings: any;
  onSettingsChanged: BehaviorSubject<any>;

  /**
   * @param router
   */
  constructor(private router: Router,
              public platform: Platform) {
    // Set the default settings
    this.defaultSettings = {
      layout: {
        navigation: 'left', // 'right', 'left', 'top', none
        toolbar: 'below', // 'above', 'below', none
        footer: 'none' // 'above', 'below', none
      },
      colorClasses: {
        toolbar: 'md-white-500-bg',
        navbar: 'mat-primary-700-bg',
        footer: 'mat-app-dark-800-bg'
      },
      customScrollbars: true,
      routerAnimation: 'fadeIn'
    };

    /**
     * Disable Custom Scrollbars if Browser is Mobile
     */
    if (this.platform.ANDROID || this.platform.IOS) {
      this.defaultSettings.customScrollbars = false;
    }

    this.settings = Object.assign({}, this.defaultSettings);

    // Reload the default settings on every navigation start
    router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          this.setSettings({layout: this.defaultSettings.layout});
        }
      }
    );

    // Create the behavior subject
    this.onSettingsChanged = new BehaviorSubject(this.settings);

  }

  /**
   * Sets settings
   * @param settings
   */
  setSettings(settings) {
    this.settings = Object.assign({}, this.settings, settings);
    this.onSettingsChanged.next(this.settings);
  }
}
