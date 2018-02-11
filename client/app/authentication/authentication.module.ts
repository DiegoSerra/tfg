import {NgModule} from '@angular/core';
import {AuthenticationComponent} from './authentication.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../core/modules/shared.module';

const appRoutes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      {
        path: 'forgot-password',
        loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule'
      },
      {
        path: 'lock',
        loadChildren: './lock/lock.module#LockModule'
      },
      {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
      },
      {
        path: 'register',
        loadChildren: './register/register.module#RegisterModule'
      },
      {
        path: 'reset-password',
        loadChildren: './reset-password/reset-password.module#ResetPasswordModule'
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth/login'
      },
    ]
  }
];


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [AuthenticationComponent]
})
export class AuthenticationModule {
}
