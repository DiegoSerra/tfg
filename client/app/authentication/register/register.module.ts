import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppRegisterComponent} from './register.component';
import {SharedModule} from '../../core/modules/shared.module';
import {AuthenticationGuard} from '../authentication.guard';

const routes = [
  {
    path: '',
    canActivate: [AuthenticationGuard],
    component: AppRegisterComponent,
  }
];

@NgModule({
  declarations: [
    AppRegisterComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class RegisterModule {

}
