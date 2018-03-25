import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {LandingPageComponent} from './landing-page.component';
import {SharedModule} from '../core/modules/shared.module';
import {PagesModule} from '../pages/pages.module';
import { ScrollEventModule } from 'ngx-scroll-event';

const routes = [
  {
    path: '',
    component: LandingPageComponent
  }
];

@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    ScrollEventModule,
    SharedModule,
    RouterModule.forChild(routes),
    PagesModule
  ]
})

export class LandingPageModule {

}
