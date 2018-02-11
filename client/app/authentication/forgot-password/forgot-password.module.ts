import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppForgotPasswordComponent} from './forgot-password.component';
import {SharedModule} from '../../core/modules/shared.module';
import {AuthenticationGuard} from '../authentication.guard';

const routes = [
  {
    path: '',
    component: AppForgotPasswordComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  declarations: [
    AppForgotPasswordComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class ForgotPasswordModule {

}
