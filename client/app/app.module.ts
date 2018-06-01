import {NgModule, LOCALE_ID} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import 'hammerjs';

import {CookieModule} from 'ngx-cookie';
import {SharedModule} from './core/modules/shared.module';
import {AppComponent} from './app.component';
import {AppSplashScreenService} from './core/services/splash-screen.service';
import {AppConfigService} from './core/services/config.service';
import {UserService} from './core/services/user.service';
import {AuthenticationGuard} from './authentication/authentication.guard';
import {ContentGuard} from './main/content/content.guard';
import {AppNavigationCreation} from './navigation.creation';
import {TimeService} from './time.service';
import {ArrayService} from './array.service';
import {UrlService} from './core/services/url.service';
import {EmojisService} from './core/services/emojis.service';
import {BadgesService} from './core/services/badges.service';
import {RaceService} from './core/services/race.service';
import {MapService} from './core/services/map.service';
import {HttpClientModule} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localeES from '@angular/common/locales/es'; // to register spanish

registerLocaleData(localeES);

const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: './authentication/authentication.module#AuthenticationModule'
  },
  {
    path: 'pages',
    loadChildren: './pages/pages.module#PagesModule'
  },
  {
    path: 'app',
    loadChildren: './main/main.module#AppMainModule'
  },
  {
    path: '',
    loadChildren: './landing-page/landing-page.module#LandingPageModule'
  },
  {
    path: '**',
    redirectTo: 'app/race/all'
  }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'tfg.com'}),
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
    RouterModule.forRoot(appRoutes),
    SharedModule,
    CookieModule.forRoot(),
  ],
  providers: [
    // {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: LOCALE_ID, useValue: 'es' },
    AuthenticationGuard,
    ContentGuard,

    AppSplashScreenService,
    AppConfigService,
    UserService,
    RaceService,
    MapService,

    AppNavigationCreation,
    TimeService,
    ArrayService,
    UrlService,
    EmojisService,
    BadgesService
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {
}
