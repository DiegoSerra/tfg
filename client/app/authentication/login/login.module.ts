import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppLoginComponent} from './login.component';
import {SharedModule} from '../../core/modules/shared.module';
import {AuthenticationGuard} from '../authentication.guard';

const routes = [
  {
    path: '',
    component: AppLoginComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  declarations: [
    AppLoginComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class LoginModule {

}
