import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {LandingPageComponent} from './landing-page.component';
import {SharedModule} from '../core/modules/shared.module';
import {PagesModule} from '../pages/pages.module';

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
    SharedModule,
    RouterModule.forChild(routes),
    PagesModule
  ]
})

export class LandingPageModule {

}
