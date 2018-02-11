import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppLockComponent} from './lock.component';
import {SharedModule} from '../../core/modules/shared.module';

const routes = [
  {
    path: '',
    component: AppLockComponent
  }
];

@NgModule({
  declarations: [
    AppLockComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class LockModule {

}
