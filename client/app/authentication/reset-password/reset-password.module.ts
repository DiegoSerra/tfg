import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppResetPasswordComponent} from './reset-password.component';
import {SharedModule} from '../../core/modules/shared.module';
import {AuthenticationGuard} from '../authentication.guard';

const routes = [
  {
    path: '',
    component: AppResetPasswordComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  declarations: [
    AppResetPasswordComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class ResetPasswordModule {

}
