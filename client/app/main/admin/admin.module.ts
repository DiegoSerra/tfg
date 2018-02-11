import {NgModule} from '@angular/core';
import {AdminGuard} from './admin.guard';
import {AdminComponent} from './admin.component';
import {Route, RouterModule} from '@angular/router';
import {SharedModule} from '../../core/modules/shared.module';

import {UserComponent} from './user/user.component';
import {RaceComponent} from './race/race.component';

const routes: Route[] = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'users',
        component: UserComponent
      },
      {
        path: 'races',
        component: RaceComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/admin/sample'
      }
    ]
  },
];

@NgModule({
  declarations: [
    AdminComponent,
    UserComponent,
    RaceComponent,
  ],
  entryComponents: [
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    AdminGuard,
  ]

})
export class AdminModule { }
